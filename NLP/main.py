import cv2
import numpy as np
import threading
import time
import sounddevice as sd
import soundfile as sf
import whisper
from deepface import DeepFace
from transformers import pipeline
import librosa
import mediapipe as mp
from collections import Counter
import json
import os
from tensorflow.keras.models import load_model
from tensorflow.keras import layers, models

# Set paths and initialize Whisper model
os.environ["FFMPEG_BIN"] = r"C:\Users\ASUS\Downloads\ffmpeg-master-latest-win64-gpl-shared\ffmpeg-master-latest-win64-gpl-shared\bin" # Replace with the correct path
audio_file = "output.wav"
audio_data = []

# Load Whisper model for speech-to-text
model_whisper = whisper.load_model("base")

# Initialize DeepFace for emotion detection
emotion_model = DeepFace.build_model('VGG-Face') 
# Initialize MediaPipe for body language detection
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Thread: Audio Recording
def record_audio():
    global audio_data
    samplerate = 44100
    print("🎙️ Recording audio...")
    audio_data = sd.rec(int(samplerate * 600), samplerate=samplerate, channels=1, dtype='float32')
    sd.wait()
    sf.write(audio_file, audio_data, samplerate)
    print("🛑 Audio recording stopped")

# Thread: Real-time Webcam Capture with Emotion and Pose
def start_camera_analysis():
    cap = cv2.VideoCapture(0)
    emotions = []
    body_positions = []

    print("📷 Starting camera, press 'q' to stop")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Emotion detection
        try:
            result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            emotions.append(result[0]['dominant_emotion'])
        except Exception:
            pass

        # Body pose detection
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb)
        if results.pose_landmarks:
            body_positions.append("Detected")

        cv2.imshow("Quick-o-Hire: Live Interview Analyzer", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("📸 Camera capture stopped")
    return emotions, body_positions

# Transcribe using Whisper
def transcribe_audio_whisper(file_path):
    print("🗣️ Transcribing audio...")
    result = model_whisper.transcribe(file_path)
    text = result["text"]
    print(f"🗣️ Transcribed: {text}")
    return text

# Analyze sentiment of the text
def analyze_text(text):
    sentiment = pipeline("sentiment-analysis")
    result = sentiment(text)[0]
    return {
        "answer": text,
        "sentiment": result["label"],
        "confidence": round(float(result["score"]) * 100, 2)
    }

# Analyze speech quality (volume, clarity, pitch)
# Correct pitch extraction using librosa
def extract_speech_features(audio_file):
    y, sr = librosa.load(audio_file, sr=None)
    
    # Extract pitch using librosa's piptrack method
    pitches, _ = librosa.piptrack(y=y, sr=sr)
    
    # Get the mean pitch
    pitch_mean = np.mean(pitches[pitches > 0])  # Only consider non-zero pitches
    
    # Calculate other speech features
    volume = np.mean(np.abs(y))  # Root mean square of audio signal
    clarity = np.mean(librosa.feature.rms(y=y))  # Clarity based on RMS
    
    return {
        "pitch_mean": round(float(pitch_mean), 2),
        "volume": round(float(volume), 6),
        "clarity": round(clarity, 6)
    }


# Calculate a mock "accuracy" score based on features
def calculate_accuracy(report):
    score = 0
    # Emotion and sentiment alignment
    if report['Facial Emotion'] in ['happy', 'neutral'] and report['Sentiment'] == "POSITIVE":
        score += 30
    elif report['Facial Emotion'] in ['sad', 'angry'] and report['Sentiment'] == "NEGATIVE":
        score += 30
    # Speech quality
    if report['Speech Quality']['clarity'] > 0.01:
        score += 30
    if report['Speech Quality']['volume'] > 0.01:
        score += 10
    # Bonus if body language was detected
    if report["Body Language Detected"]:
        score += 10
    return min(score, 100)

# Combine all features and generate a final report
def generate_report(emotions, body_positions, sentiment, speech_quality, anxiety_level):
    dominant_emotion = Counter(emotions).most_common(1)[0][0] if emotions else "Unknown"
    body_detected = len(body_positions) > 0

    report = {
        "Facial Emotion": dominant_emotion,
        "Body Language Detected": body_detected,
        "Sentiment": sentiment['sentiment'],
        "Sentiment Confidence": float(sentiment['confidence']),
        "Answer": sentiment['answer'],
        "Speech Quality": {k: float(v) for k, v in speech_quality.items()},
        "Anxiety Level (User Labeled)": anxiety_level
    }

    accuracy = calculate_accuracy(report)
    report["Model Accuracy"] = f"{accuracy}%"

    with open("interview_report.json", "w") as f:
        json.dump(report, f, indent=4)

    print("\n✅ Report generated and saved as 'interview_report.json'")
    print(f"📊 Model Accuracy: {accuracy}%")
    return report

# Combine all modalities (audio, video, text)
def combine_modalities_and_generate_report(anxiety_level="Not Provided"):
    # Thread to record audio in parallel
    audio_thread = threading.Thread(target=record_audio)
    audio_thread.start()

    # Webcam will wait for 'q' key to stop
    emotions, body_positions = start_camera_analysis()

    # Stop the audio recording
    sd.stop()

    # Transcribe audio to text with Whisper
    text = transcribe_audio_whisper(audio_file)

    # Analyze sentiment of the transcribed text
    sentiment = analyze_text(text)

    # Analyze speech quality (volume, clarity, pitch)
    speech_quality = extract_speech_features(audio_file)

    # Generate the final report (including anxiety level and body language detection)
    final_report = generate_report(emotions, body_positions, sentiment, speech_quality, anxiety_level)

    return final_report

# Train a model for final prediction (fine-tuning)
def train_final_model(features, labels):
    model = models.Sequential()
    model.add(layers.Dense(128, activation='relu', input_dim=features.shape[1]))
    model.add(layers.Dense(64, activation='relu'))
    model.add(layers.Dense(1, activation='sigmoid'))  # For binary output (e.g., "anxiety level")
    
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    model.fit(features, labels, epochs=10, batch_size=32)
    
    model.save("final_model.h5")
    return model

# Main logic
def main():
    final_report = combine_modalities_and_generate_report(anxiety_level="High") # Replace with user value from frontend
    return final_report

# Run directly
if __name__ == "__main__":
    main()
