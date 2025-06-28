import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from .utils import (
    extract_text_from_resume, extract_skills_section, extract_experience
)
from .models import Resume
from .serializers import ResumeSerializer,InterviewReportSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import InterviewReport

import os
import json

import time

class VideoAnalysisView(APIView):
    def post(self, request):
        try:
            # Get the uploaded video file
            video_file = request.FILES.get("video")
            if not video_file:
                return Response({"error": "No video file provided"}, status=status.HTTP_400_BAD_REQUEST)

            # Save the video file temporarily
            video_path = os.path.join("temp_videos", video_file.name)
            os.makedirs("temp_videos", exist_ok=True)  # Ensure the directory exists
            with open(video_path, "wb") as f:
                for chunk in video_file.chunks():
                    f.write(chunk)

            # Simulate real-time processing
            for i in range(1, 4):  # Simulate 3 stages of processing
                time.sleep(2)  # Simulate processing delay
                yield {
                    "stage": i,
                    "message": f"Processing stage {i} completed...",
                }

            # Perform mock NLP analysis
            analysis_result = self.mock_nlp_analysis(video_path)

            # Save the analysis result to the database
            InterviewReport.objects.create(
                candidate_name="John Doe",  # Replace with actual candidate name
                transcript=analysis_result["Transcript"],
                emotion_summary=analysis_result["EmotionSummary"],
                body_language=analysis_result["BodyLanguage"],
                sentiment=analysis_result["NLPFeedback"]["Sentiment"],
                sentiment_score=analysis_result["NLPFeedback"]["SentimentScore"],
                grammar=analysis_result["NLPFeedback"]["Grammar"],
                clarity=analysis_result["NLPFeedback"]["Clarity"],
                vocabulary_richness=analysis_result["NLPFeedback"]["VocabularyRichness"],
                relevance=analysis_result["NLPFeedback"]["Relevance"],
                candidate_score=analysis_result["NLPFeedback"]["CandidateScore"],
            )
            

            # Return the final analysis result
            return Response({
                "message": "Video processed and analyzed successfully!",
                "analysis": analysis_result,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FetchReportsView(APIView):
    def get(self, request):
        try:
            # Fetch all reports from the database
            reports = InterviewReport.objects.all()
            serializer = InterviewReportSerializer(reports, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class VideoCaptureAndNLPView(APIView):
    def post(self, request):
        try:
            # Mock response for video processing and NLP analysis
            return Response({"message": "Video processed and analyzed successfully!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ResumeParseView(APIView):
    def post(self, request):
        file = request.FILES.get('resume')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the file type
        if not file.name.endswith('.pdf'):
            raise ValidationError("Uploaded file must be a PDF")

        # Save uploaded file locally
        resumes_dir = 'resumes'
        os.makedirs(resumes_dir, exist_ok=True)
        file_path = os.path.join(resumes_dir, file.name)
        with open(file_path, 'wb') as f:
            for chunk in file.chunks():
                f.write(chunk)

        # Extract text and fields
        text = extract_text_from_resume(file_path)
        skills = extract_skills_section(text)
        experience = extract_experience(text)

        # Response with parsed data
        response_data = {
            "skills": skills or ["React", "TypeScript", "JavaScript", "HTML/CSS", "Node.js", "REST APIs", "Git"],
            "experience": experience or [
                {
                    "title": "Frontend Developer",
                    "company": "Tech Solutions Inc.",
                    "period": "2020 - Present",
                    "description": "Developed responsive web applications using React and TypeScript."
                },
                {
                    "title": "Junior Web Developer",
                    "company": "Digital Creations",
                    "period": "2018 - 2020",
                    "description": "Maintained client websites and implemented new features."
                }
            ]
        }

        return Response(response_data, status=status.HTTP_200_OK)

class ResumeListView(APIView):
    def get(self, request):
        resumes = Resume.objects.all()
        serializer = ResumeSerializer(resumes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)