from django.urls import path
from .views import ResumeParseView,ResumeListView,VideoCaptureAndNLPView, FetchReportsView

urlpatterns = [
    path('parse_resume/', ResumeParseView.as_view(), name='parse_resume'),
    path('resumes/', ResumeListView.as_view(), name='resume_list'),
    path('video_analysis/', VideoCaptureAndNLPView.as_view(), name='video_analysis'),
    path('fetch_reports/', FetchReportsView.as_view(), name='fetch_reports'),
]
