"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Mic, Square, ChevronRight } from "lucide-react";

const InterviewInterface = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<"idle" | "recording" | "processing" | "complete">("idle");
  const [report, setReport] = useState<any>(null);
  const [processingUpdates, setProcessingUpdates] = useState<string[]>([]);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const questions = [
    "Tell me about your experience with React.",
    "How do you approach responsive design?",
    "Describe a challenging project you worked on.",
    "How do you handle API integrations?",
    "What is your experience with microservices architecture?",
  ];

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingStatus("recording");
      recordedChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Failed to access camera or microphone. Please check your permissions.");
      setIsRecording(false);
      setRecordingStatus("idle");
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setRecordingStatus("processing");

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();

      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      await processRecording();
    } else {
      setError("Recording was not properly initialized.");
      setRecordingStatus("idle");
    }
  };

  const processRecording = async () => {
    try {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });

      const formData = new FormData();
      formData.append("video", blob, "interview_recording.webm");

      const response = await axios.post("http://127.0.0.1:8000/api/interviews/video_analysis/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setReport(response.data.analysis);
      setRecordingStatus("complete");
    } catch (err) {
      console.error("Error processing recording:", err);
      setError("Failed to process video. Please try again.");
      setRecordingStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-6">AI Interview</h1>

            {/* Video Preview */}
            <div className="mb-6 relative">
              <video ref={videoRef} autoPlay muted className="w-full h-64 bg-black rounded-lg object-cover" />

              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center bg-black/50 px-3 py-1 rounded-full">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                  <span className="text-white text-sm font-medium">Recording...</span>
                </div>
              )}

              {recordingStatus === "processing" && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
                  <p className="text-white font-medium">Processing your response...</p>
                </div>
              )}
            </div>

            {/* Questions */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6">
              <h2 className="text-lg font-bold text-white mb-4">Interview Questions</h2>
              <ul className="list-disc list-inside text-white space-y-2">
                {questions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            </div>

            {/* Processing Updates */}
            {processingUpdates.length > 0 && (
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6">
                <h2 className="text-lg font-bold text-white mb-4">Processing Updates</h2>
                <ul className="list-disc list-inside text-white space-y-2">
                  {processingUpdates.map((update, index) => (
                    <li key={index}>{update}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Analysis Report */}
            {report && (
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-6">
                <h2 className="text-lg font-bold text-white mb-4">Analysis Report</h2>
                <div className="bg-gray-800 p-4 rounded-lg text-white">
                  <p className="mb-2">
                    <strong>Transcript:</strong> {report.transcript}
                  </p>
                  <p className="mb-2">
                    <strong>Emotion:</strong> {report.emotion_summary}
                  </p>
                  <p className="mb-2">
                    <strong>Sentiment:</strong> {report.sentiment}
                  </p>
                  <p>
                    <strong>Confidence:</strong> {report.sentiment_score * 100}%
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg mt-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-between items-center mt-8">
              {recordingStatus === "recording" ? (
                <motion.button
                  className="rounded-full bg-red-600 p-4 text-white shadow-lg hover:bg-red-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopRecording}
                >
                  <Square className="h-6 w-6" />
                </motion.button>
              ) : recordingStatus === "processing" ? (
                <div className="rounded-full bg-gray-600 p-4 text-white shadow-lg opacity-50 cursor-not-allowed">
                  <ChevronRight className="h-6 w-6 animate-pulse" />
                </div>
              ) : (
                <motion.button
                  className="rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startRecording}
                >
                  <Mic className="h-6 w-6" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewInterface;