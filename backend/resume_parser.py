from pypdf import PdfReader


def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text


def clean_text(text):
    lines = text.splitlines()

    cleaned_lines = []

    for line in lines:
        line = line.strip()

        if line:
            cleaned_lines.append(line)

    return "\n".join(cleaned_lines)


if __name__ == "__main__":
    pdf_path = "../sample_resumes/test_resume.pdf"

    extracted_text = extract_text_from_pdf(pdf_path)

    cleaned_text = clean_text(extracted_text)

    print("===== CLEANED RESUME TEXT =====")
    print(cleaned_text)