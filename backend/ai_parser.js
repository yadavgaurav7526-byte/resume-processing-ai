const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const GROQ_MODEL = "openai/gpt-oss-20b";


// ======================================================
// CLEAN AI JSON RESPONSE
// ======================================================
function cleanAIResponse(responseText) {
    if (!responseText) {
        throw new Error("AI returned an empty response.");
    }

    let cleaned = responseText.trim();

    cleaned = cleaned
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    return cleaned;
}


// ======================================================
// PARSE JSON SAFELY
// ======================================================
function parseAIJson(responseText) {
    const cleaned = cleanAIResponse(responseText);

    try {
        return JSON.parse(cleaned);
    } catch (error) {
        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace > firstBrace) {
            const possibleJson = cleaned.slice(
                firstBrace,
                lastBrace + 1
            );

            try {
                return JSON.parse(possibleJson);
            } catch (_) {
                // Fall through to the useful error below.
            }
        }

        throw new Error(
            "AI returned invalid JSON."
        );
    }
}


// ======================================================
// AI RESUME PARSER
// ======================================================
async function parseResumeWithAI(resumeText) {
    if (!resumeText || !resumeText.trim()) {
        throw new Error(
            "No resume text was provided."
        );
    }

    if (!process.env.GROQ_API_KEY) {
        throw new Error(
            "GROQ_API_KEY is missing from the backend .env file."
        );
    }

    console.log("🤖 Sending resume to Groq...");

    const prompt = `
You are an expert resume parser.

Analyze the resume text below and extract information into the EXACT JSON structure provided.

IMPORTANT RULES:
1. Extract information based ONLY on the resume.
2. NEVER invent information.
3. If information is missing, use an empty string "".
4. If a section has multiple entries, return ALL entries.
5. Understand different resume formats and section names.
6. Do not depend on sections appearing in a specific order.
7. Correctly identify dates, durations and locations.
8. Keep descriptions meaningful but concise.
9. Extract URLs from the resume.
10. Separate skills individually.
11. Distinguish projects from work experience.
12. Distinguish achievements from certifications.
13. Do not confuse a job title with the person's name.
14. Return ONLY valid JSON.
15. Do not use markdown.
16. Do not add explanations.
17. Do not invent a professional introduction. If the resume has no summary/profile/about section, return "".
18. Keep all facts faithful to the resume.

JSON STRUCTURE:
{
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "introduction": "",
    "education": [
        {
            "degree": "",
            "institution": "",
            "duration": ""
        }
    ],
    "experience": [
        {
            "role": "",
            "company": "",
            "duration": "",
            "description": ""
        }
    ],
    "projects": [
        {
            "name": "",
            "description": "",
            "technologies": ""
        }
    ],
    "skills": [],
    "achievements": [],
    "certifications": [],
    "github": "",
    "linkedin": ""
}

RESUME TEXT:
${resumeText}
`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a highly accurate resume information extraction system. Return only valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: GROQ_MODEL,
            temperature: 0,
            max_tokens: 4000
        });

        const responseText =
            completion?.choices?.[0]?.message?.content?.trim();

        console.log("🤖 Groq raw response:");
        console.log(responseText);

        const parsedData = parseAIJson(responseText);

        console.log("✅ Resume successfully parsed by AI!");

        return parsedData;
    } catch (error) {
        console.error(
            "❌ AI resume parsing failed:",
            error.message || error
        );
        throw error;
    }
}


// ======================================================
// AI CAREER DATA IMPROVEMENT
// ======================================================
async function improveCareerDataWithAI(careerData) {
    if (!careerData) {
        throw new Error(
            "No career data was provided."
        );
    }

    if (!process.env.GROQ_API_KEY) {
        throw new Error(
            "GROQ_API_KEY is missing from the backend .env file."
        );
    }

    console.log(
        "✨ Sending career data to Groq for improvement..."
    );

    const prompt = `
You are an expert professional resume and portfolio writer.

Improve ONLY the user's professional introduction and project descriptions.

IMPORTANT RULES:
1. Use ONLY information already present in the provided data.
2. NEVER invent skills, companies, achievements, technologies, jobs, education, responsibilities or experience.
3. Do not change factual information.
4. Make the writing professional, clear and concise.
5. Make the introduction stronger while keeping it truthful.
6. Improve project descriptions so they clearly explain what was built and what problem it addresses, but only using facts already present.
7. Keep the original meaning.
8. If introduction is empty, return an empty string.
9. If projects are empty, return an empty array.
10. Do not modify project names.
11. Do not modify technologies.
12. Do not modify education.
13. Do not modify experience facts.
14. Do not invent metrics or results.
15. Return ONLY valid JSON.
16. No markdown.
17. No explanation.

Return EXACTLY this structure:
{
    "improvedIntroduction": "",
    "improvedProjects": [
        {
            "name": "",
            "originalDescription": "",
            "improvedDescription": ""
        }
    ]
}

CAREER DATA:
${JSON.stringify(careerData, null, 2)}
`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a professional portfolio improvement assistant. Return only valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: GROQ_MODEL,
            temperature: 0.2,
            max_tokens: 2500
        });

        const responseText =
            completion?.choices?.[0]?.message?.content?.trim();

        console.log("🤖 AI improvement response:");
        console.log(responseText);

        const improvedData = parseAIJson(responseText);

        console.log("✅ AI improvements generated.");

        return improvedData;
    } catch (error) {
        console.error(
            "❌ AI improvement failed:",
            error.message || error
        );
        throw error;
    }
}


// ======================================================
// EXPORT
// ======================================================
module.exports = {
    parseResumeWithAI,
    improveCareerDataWithAI
};
