from django.db import models

class Resume(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    github_link = models.URLField(null=True, blank=True)
    summary = models.TextField(null=True, blank=True)
    education = models.TextField(null=True, blank=True)
    experience = models.TextField(null=True, blank=True)
    skills = models.TextField(null=True, blank=True)
    projects = models.JSONField(null=True, blank=True)  # Storing projects as a JSON field
    
    def __str__(self):
        return self.name
class InterviewReport(models.Model):
    candidate_name = models.CharField(max_length=255)
    transcript = models.TextField()
    emotion_summary = models.CharField(max_length=50)
    body_language = models.CharField(max_length=50)
    sentiment = models.CharField(max_length=50)
    sentiment_score = models.FloatField()
    grammar = models.CharField(max_length=50)
    clarity = models.CharField(max_length=50)
    vocabulary_richness = models.FloatField()
    relevance = models.CharField(max_length=50)
    candidate_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
