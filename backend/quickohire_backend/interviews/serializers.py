from rest_framework import serializers
from .models import Resume,InterviewReport

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'
# from .models import InterviewReport

class InterviewReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewReport
        fields = '__all__'
