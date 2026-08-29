import os
import json

from dotenv import load_dotenv
from groq import Groq, BadRequestError

from ai_parser import parse_resume


# Find the .env file inside the backend folder
env_path = os.path.join(
    os.path.dirname(__file__),
    ".env"
)

load_dotenv(env_path)

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    print("Groq API key NOT found!")
    exit()

client = Groq(api_key=api_key)


def analyze_resume(resume_data, client):

    resume_json = json.dumps(
        resume_data,
        indent=2
    )

    prompt = f"""
Analyze the following parsed resume.

Give a score from 0 to 100.

Identify:

- Strengths
- Weaknesses
- Practical suggestions

Base everything ONLY on the resume data.

Do not invent information.

Resume data:

{resume_json}
"""

    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            temperature=0,

            messages=[
                {
                    "role": "system",
                    "content": """
You are a professional resume reviewer.

Analyze ONLY the resume provided by the user.

Return ONLY valid JSON.

The JSON MUST contain exactly these four fields:

score
strengths
weaknesses
suggestions

Rules:

- score must be an integer between 0 and 100.
- strengths must be an array of strings.
- weaknesses must be an array of strings.
- suggestions must be an array of strings.
- Never invent information.
- Never assume information.
- Base the analysis only on the provided resume.
"""
                },

                {
                    "role": "user",
                    "content": prompt
                }
            ],

            response_format={
                "type": "json_object"
            }
        )

    except BadRequestError as e:

        print("AI analysis failed.")
        print(e)

        return {
            "score": 0,
            "strengths": [],
            "weaknesses": [],
            "suggestions": [
                "AI analysis could not be completed."
            ]
        }

    except Exception as e:

        print("Unexpected error during AI analysis.")
        print(e)

        return {
            "score": 0,
            "strengths": [],
            "weaknesses": [],
            "suggestions": [
                "AI analysis could not be completed."
            ]
        }


    # Convert AI response from JSON string to Python dictionary
    try:

        analysis_data = json.loads(
            response.choices[0].message.content
        )

    except (json.JSONDecodeError, AttributeError, TypeError):

        print("AI returned invalid JSON.")

        return {
            "score": 0,
            "strengths": [],
            "weaknesses": [],
            "suggestions": [
                "AI analysis returned an invalid response."
            ]
        }


    # Make sure all expected fields exist
    analysis_data.setdefault("score", 0)
    analysis_data.setdefault("strengths", [])
    analysis_data.setdefault("weaknesses", [])
    analysis_data.setdefault("suggestions", [])


    # Make sure score is valid
    if not isinstance(analysis_data["score"], int):
        analysis_data["score"] = 0

    if analysis_data["score"] < 0:
        analysis_data["score"] = 0

    if analysis_data["score"] > 100:
        analysis_data["score"] = 100


    # Make sure list fields are actually lists
    if not isinstance(analysis_data["strengths"], list):
        analysis_data["strengths"] = []

    if not isinstance(analysis_data["weaknesses"], list):
        analysis_data["weaknesses"] = []

    if not isinstance(analysis_data["suggestions"], list):
        analysis_data["suggestions"] = []


    return analysis_data


# Test the analyzer
if __name__ == "__main__":

    print("Groq API key loaded successfully!")

    pdf_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "sample_resumes",
        "resume2.pdf"
    )


    # Step 1: Parse the resume
    print("\n===== PARSING RESUME =====")

    resume_data = parse_resume(
        pdf_path
    )


    # Step 2: Analyze the parsed resume
    print("\n===== ANALYZING RESUME =====")

    analysis = analyze_resume(
        resume_data,
        client
    )


    # Step 3: Display the analysis
    print("\n===== RESUME ANALYSIS =====")

    print("Score:", analysis["score"])


    print("\nStrengths:")

    for strength in analysis["strengths"]:
        print("-", strength)


    print("\nWeaknesses:")

    for weakness in analysis["weaknesses"]:
        print("-", weakness)


    print("\nSuggestions:")

    for suggestion in analysis["suggestions"]:
        print("-", suggestion)