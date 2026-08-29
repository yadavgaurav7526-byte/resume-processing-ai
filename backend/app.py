import os
from flask import Flask, request, jsonify
from flask_cors import CORS

from ai_parser import parse_resume
from resume_analyzer import analyze_resume, client

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "Resume Analyzer API is running!"
    })


@app.route("/analyze", methods=["POST"])
def analyze():

    if "resume" not in request.files:
        return jsonify({
            "error": "No resume file uploaded"
        }), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({
            "error": "No file selected"
        }), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({
            "error": "Only PDF files are allowed"
        }), 400

    upload_folder = os.path.join(
        os.path.dirname(__file__),
        "uploads"
    )

    os.makedirs(upload_folder, exist_ok=True)

    pdf_path = os.path.join(
        upload_folder,
        file.filename
    )

    file.save(pdf_path)

    try:

        print("\n===== PARSING RESUME =====")

        resume_data = parse_resume(pdf_path)

        print("\n===== ANALYZING RESUME =====")

        analysis = analyze_resume(
            resume_data,
            client
        )

        return jsonify({
            "resume": resume_data,
            "analysis": analysis
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if os.path.exists(pdf_path):
            os.remove(pdf_path)


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )