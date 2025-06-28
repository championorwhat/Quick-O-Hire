import re
import pdfplumber
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from huggingface_hub import login
import os

# Extract text from PDF resume
def extract_text_from_resume(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text.strip()

# Extract email from resume text
def extract_email(text):
    match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    return match.group(0) if match else None

# Extract phone number (Indian format) from resume text
def extract_phone_number(text):
    match = re.search(r"\b\d{10}\b", text)  # Matches 10-digit numbers
    return match.group(0) if match else None

# Extract GitHub link from resume text
def extract_github_link(text):
    match = re.search(r"(https?://)?(www\.)?github\.com/[\w-]+", text)
    return match.group(0) if match else None

# Extract professional summary from resume text
def extract_summary(text):
    match = re.search(r"Summary\s*\n([\s\S]+?)\n(?:Experience|Education|Skills)", text, re.IGNORECASE)
    return match.group(1).strip() if match else None

# Extract education section from resume text
def extract_education(text):
    education_keywords = ["BTech", "Bachelor", "Master", "PhD", "M.Tech", "B.E.", "M.Sc", "B.Sc"]
    lines = text.split("\n")

    education_section = []
    for line in lines:
        if any(keyword in line for keyword in education_keywords):
            education_section.append(line.strip())

    return "\n".join(education_section) if education_section else None

# Extract experience section from resume text
# Extract experience section from resume text
def extract_experience(text):
    """
    Extracts the experience section from the resume text.
    Dynamically parses job titles, companies, periods, and descriptions.
    """
    match = re.search(r"(Experience|Work Experience|Professional Experience)\s*\n([\s\S]+?)(\n(?:Education|Skills|Projects|Certifications|Summary))", text, re.IGNORECASE)
    
    if match:
        experience_section = match.group(2).strip()
        
        # Split the experience section into individual experiences
        experience_lines = experience_section.split("\n")
        experiences = []
        current_experience = {}

        for line in experience_lines:
            if re.match(r"^\s*[A-Za-z\s]+ at [A-Za-z\s]+", line):  # Match job title and company
                if current_experience:
                    experiences.append(current_experience)
                    current_experience = {}
                current_experience["title"] = line.strip()
            elif re.match(r"^\s*\d{4}\s*-\s*(Present|\d{4})", line):  # Match period
                current_experience["period"] = line.strip()
            else:
                current_experience["description"] = current_experience.get("description", "") + " " + line.strip()

        if current_experience:
            experiences.append(current_experience)

        return experiences
    return None

# Extract skills section from resume text dynamically
def extract_skills_section(text):
    """
    Extracts the skills section from the resume text.
    Dynamically parses skills that are comma-separated or line-separated.
    """
    match = re.search(r"(Skills|Technical Skills|Core Competencies|Technologies)\s*\n([\s\S]+?)(\n(?:Experience|Education|Projects|Certifications|Summary))", text, re.IGNORECASE)
    
    if match:
        skill_section = match.group(2).strip()
        
        # Extract individual skills (comma-separated or line-separated)
        skills = re.split(r"[,\n]", skill_section)
        clean_skills = [skill.strip() for skill in skills if skill.strip()]
        
        return clean_skills if clean_skills else None
    return None

# Extract projects section from resume text
def extract_projects(text):
    # Look for "Projects" or similar headers in the resume
    match = re.search(r"Projects\s*\n([\s\S]+?)\n(?:Experience|Skills)", text, re.IGNORECASE)
    if match:
        project_section = match.group(1).strip()

        # Extract individual project details (title, description, skills used)
        projects = []
        project_lines = project_section.split("\n")
        for line in project_lines:
            if line.strip():
                projects.append(line.strip())

        return projects
    return None
# # Load tokenizer and model for question generation
# def load_model():
#     tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
#     model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")
#     return tokenizer, model

# # Generate questions using flan-t5
# def generate_domain_questions(skills, num_questions=5):
#     if not skills:
#         return ["No skills were found to generate questions."]

#     skills_text = ", ".join(skills)
#     prompt = (
#         f"Generate {num_questions} technical interview questions with follow-up questions for these skills: {skills_text}.\n"
#         f"Format:\n1. Main question\n - Follow-up question"
#     )

#     tokenizer, model = load_model()
#     inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)
#     with torch.no_grad():
#         outputs = model.generate(**inputs, max_length=512, temperature=0.7, top_p=0.9)
#     response = tokenizer.decode(outputs[0], skip_special_tokens=True)

#     questions = []
#     for line in response.split("\n"):
#         if line.strip():
#             questions.append(line.strip())
#     return questions if questions else ["No relevant questions generated."]