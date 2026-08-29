import os
import json

from dotenv import load_dotenv
from groq import Groq

from resume_parser import extract_text_from_pdf, clean_text


# Find the .env file inside the backend folder
env_path = os.path.join(os.path.dirname(__file__), ".env")

load_dotenv(env_path)

api_key = os.getenv("GROQ_API_KEY")


if not api_key:
    print("Groq API key NOT found!")
    exit()

client = Groq(api_key=api_key)


def parse_resume(pdf_path):

    # Extract text from PDF
    resume_text = extract_text_from_pdf(pdf_path)

    # Clean extracted text
    resume_text = clean_text(resume_text)

    # Send resume text to Groq
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        temperature=0,

        messages=[
            {
                "role": "system",
                "content": """
You are a professional resume parser.

Extract ONLY information that is explicitly present in the resume.

Rules:
1. Never invent or assume information.
2. Return ONLY valid JSON.
3. Every required field must be included.
4. Missing single-value fields must be null.
5. Missing list fields must be [].
6. Do not add extra fields.
7. Preserve information exactly where possible.
"""
            },
            {
                "role": "user",
                "content": f"Parse this resume:\n\n{resume_text}"
            }
        ],

        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "resume",
                "strict": True,

                "schema": {
                    "type": "object",

                    "properties": {

                        "name": {
                            "type": ["string", "null"]
                        },

                        "email": {
                            "type": ["string", "null"]
                        },

                        "phone": {
                            "type": ["string", "null"]
                        },

                        "location": {
                            "type": ["string", "null"]
                        },

                        "summary": {
                            "type": ["string", "null"]
                        },

                        "skills": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },

                        "education": {
                            "type": "array",
                            "items": {
                                "type": "object",

                                "properties": {

                                    "degree": {
                                        "type": ["string", "null"]
                                    },

                                    "institution": {
                                        "type": ["string", "null"]
                                    },

                                    "location": {
                                        "type": ["string", "null"]
                                    },

                                    "start_year": {
                                        "type": ["string", "null"]
                                    },

                                    "end_year": {
                                        "type": ["string", "null"]
                                    }
                                },

                                "required": [
                                    "degree",
                                    "institution",
                                    "location",
                                    "start_year",
                                    "end_year"
                                ],

                                "additionalProperties": False
                            }
                        },

                        "projects": {
                            "type": "array",
                            "items": {
                                "type": "object",

                                "properties": {

                                    "title": {
                                        "type": "string"
                                    },

                                    "description": {
                                        "type": "string"
                                    },

                                    "technologies": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                },

                                "required": [
                                    "title",
                                    "description",
                                    "technologies"
                                ],

                                "additionalProperties": False
                            }
                        },

                        "experience": {
                            "type": "array",
                            "items": {
                                "type": "object",

                                "properties": {

                                    "job_title": {
                                        "type": "string"
                                    },

                                    "company": {
                                        "type": "string"
                                    },

                                    "location": {
                                        "type": ["string", "null"]
                                    },

                                    "start_date": {
                                        "type": ["string", "null"]
                                    },

                                    "end_date": {
                                        "type": ["string", "null"]
                                    },

                                    "description": {
                                        "type": "string"
                                    }
                                },

                                "required": [
                                    "job_title",
                                    "company",
                                    "location",
                                    "start_date",
                                    "end_date",
                                    "description"
                                ],

                                "additionalProperties": False
                            }
                        },

                        "certifications": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },

                        "achievements": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },

                        "links": {
                            "type": "array",
                            "items": {
                                "type": "object",

                                "properties": {

                                    "name": {
                                        "type": "string"
                                    },

                                    "url": {
                                        "type": "string"
                                    }
                                },

                                "required": [
                                    "name",
                                    "url"
                                ],

                                "additionalProperties": False
                            }
                        }
                    },

                    "required": [
                        "name",
                        "email",
                        "phone",
                        "location",
                        "summary",
                        "skills",
                        "education",
                        "projects",
                        "experience",
                        "certifications",
                        "achievements",
                        "links"
                    ],

                    "additionalProperties": False
                }
            }
        }
    )

    # Convert JSON string into Python dictionary
    resume_data = json.loads(
        response.choices[0].message.content
    )

    return resume_data


# Test the parser
if __name__ == "__main__":

    print("Groq API key loaded successfully!")

    pdf_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "sample_resumes",
        "resume2.pdf"
    )

    resume_data = parse_resume(pdf_path)

    print("\n===== PARSED RESUME =====")

    print("Name:", resume_data["name"])
    print("Email:", resume_data["email"])
    print("Phone:", resume_data["phone"])
    print("Location:", resume_data["location"])
    print("Summary:", resume_data["summary"])

    print("Skills:", resume_data["skills"])
    print("Education:", resume_data["education"])
    print("Projects:", resume_data["projects"])
    print("Experience:", resume_data["experience"])
    print("Certifications:", resume_data["certifications"])
    print("Achievements:", resume_data["achievements"])
    print("Links:", resume_data["links"])