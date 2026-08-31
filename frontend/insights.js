// ======================================================
// PORTFOLIOAI — RESUME INSIGHTS
// ======================================================


document.addEventListener("DOMContentLoaded", function () {


    // ==================================================
    // GET ELEMENTS
    // ==================================================

    const noResume =
        document.getElementById("noResume");

    const insightsContent =
        document.getElementById("insightsContent");

    const resumeName =
        document.getElementById("resumeName");

    const skillsInsight =
        document.getElementById("skillsInsight");

    const experienceInsight =
        document.getElementById("experienceInsight");

    const careerInsight =
        document.getElementById("careerInsight");

    const qualityInsight =
        document.getElementById("qualityInsight");

    const resumeSummary =
        document.getElementById("resumeSummary");

    const sourceFileName =
        document.getElementById("sourceFileName");


    // ==================================================
    // GET THE CURRENTLY UPLOADED RESUME
    // ==================================================

    const savedResume =
        localStorage.getItem("portfolioResume");


    // No resume found
    if (!savedResume) {

        if (noResume) {
            noResume.style.display = "block";
        }

        if (insightsContent) {
            insightsContent.style.display = "none";
        }

        return;
    }


    // ==================================================
    // READ RESUME DATA
    // ==================================================

    let resumeData;

    try {

        resumeData =
            JSON.parse(savedResume);

    }

    catch (error) {

        console.error(
            "Could not read saved resume:",
            error
        );

        if (noResume) {
            noResume.style.display = "block";
        }

        if (insightsContent) {
            insightsContent.style.display = "none";
        }

        return;
    }


    // Make sure actual resume data exists
    if (!resumeData || !resumeData.text) {

        if (noResume) {
            noResume.style.display = "block";
        }

        if (insightsContent) {
            insightsContent.style.display = "none";
        }

        return;
    }


    // ==================================================
    // SHOW INSIGHTS
    // ==================================================

    if (noResume) {
        noResume.style.display = "none";
    }

    if (insightsContent) {
        insightsContent.style.display = "block";
    }


    // ==================================================
    // FILE NAME
    // ==================================================

    const fileName =
        resumeData.fileName || "Uploaded Resume";


    if (resumeName) {

        resumeName.textContent =
            "Based on " + fileName;

    }


    if (sourceFileName) {

        sourceFileName.textContent =
            fileName;

    }


    // ==================================================
    // PARSED AI DATA
    // ==================================================

    const parsed =
        resumeData.parsedData || {};


    // ==================================================
    // HELPER FUNCTION
    // ==================================================

    function getValue(object, keys) {

        for (let i = 0; i < keys.length; i++) {

            const key =
                keys[i];

            if (
                object &&
                object[key] !== undefined &&
                object[key] !== null &&
                object[key] !== ""
            ) {

                return object[key];

            }

        }

        return null;

    }


    // ==================================================
    // SKILLS
    // ==================================================

    let skills =
        getValue(
            parsed,
            [
                "skills",
                "technicalSkills",
                "technical_skills",
                "keySkills"
            ]
        );


    if (Array.isArray(skills)) {

        skills =
            skills
                .slice(0, 6)
                .join(" • ");

    }


    if (!skills) {

        skills =
            extractSkills(
                resumeData.text
            );

    }


    if (skillsInsight) {

        skillsInsight.textContent =
            skills || "Skills not detected";

    }


    // ==================================================
    // EXPERIENCE
    // ==================================================

    let experience =
        getValue(
            parsed,
            [
                "experience",
                "experienceLevel",
                "experience_level",
                "workExperience"
            ]
        );


    if (Array.isArray(experience)) {

        experience =
            experience.length +
            " experience entries";

    }


    if (typeof experience === "object") {

        experience =
            "Professional experience";

    }


    if (!experience) {

        experience =
            detectExperience(
                resumeData.text
            );

    }


    if (experienceInsight) {

        experienceInsight.textContent =
            experience;

    }


    // ==================================================
    // CAREER DIRECTION
    // ==================================================

    let career =
        getValue(
            parsed,
            [
                "careerDirection",
                "career_direction",
                "careerPath",
                "career_path",
                "role",
                "jobTitle"
            ]
        );


    if (Array.isArray(career)) {

        career =
            career
                .slice(0, 3)
                .join(" • ");

    }


    if (!career) {

        career =
            detectCareerDirection(
                resumeData.text
            );

    }


    if (careerInsight) {

        careerInsight.textContent =
            career;

    }


    // ==================================================
    // RESUME QUALITY
    // ==================================================

    const quality =
        calculateResumeQuality(
            resumeData.text,
            parsed
        );


    if (qualityInsight) {

        qualityInsight.textContent =
            quality;

    }


    // ==================================================
    // RESUME SUMMARY
    // ==================================================

    let summary =
        getValue(
            parsed,
            [
                "summary",
                "profile",
                "professionalSummary",
                "professional_summary",
                "about"
            ]
        );


    if (!summary) {

        summary =
            generateSummary(
                resumeData.text,
                skills,
                career
            );

    }


    if (resumeSummary) {

        resumeSummary.textContent =
            summary;

    }

});


// ======================================================
// EXTRACT SKILLS FROM RESUME TEXT
// ======================================================

function extractSkills(text) {

    const commonSkills = [

        "Python",
        "Java",
        "C++",
        "JavaScript",
        "HTML",
        "CSS",
        "React",
        "Node.js",
        "SQL",
        "MySQL",
        "MongoDB",
        "Git",
        "GitHub",
        "Machine Learning",
        "Data Science",
        "Artificial Intelligence",
        "Figma",
        "Canva",
        "Excel",
        "Communication",
        "Leadership"

    ];


    const found = [];

    const lowerText =
        text.toLowerCase();


    commonSkills.forEach(function (skill) {

        if (
            lowerText.includes(
                skill.toLowerCase()
            )
        ) {

            found.push(skill);

        }

    });


    return found
        .slice(0, 6)
        .join(" • ");
}


// ======================================================
// DETECT EXPERIENCE
// ======================================================

function detectExperience(text) {

    const lowerText =
        text.toLowerCase();


    if (
        lowerText.includes("internship") ||
        lowerText.includes("intern")
    ) {

        return "Early professional experience";

    }


    if (
        lowerText.includes("work experience") ||
        lowerText.includes("professional experience")
    ) {

        return "Professional experience";

    }


    if (
        lowerText.includes("student") ||
        lowerText.includes("university") ||
        lowerText.includes("college")
    ) {

        return "Student / Early career";

    }


    return "Experience level not clearly specified";
}


// ======================================================
// DETECT CAREER DIRECTION
// ======================================================

function detectCareerDirection(text) {

    const lowerText =
        text.toLowerCase();


    if (
        lowerText.includes("machine learning") ||
        lowerText.includes("artificial intelligence") ||
        lowerText.includes("data science")
    ) {

        return "AI / Data";

    }


    if (
        lowerText.includes("react") ||
        lowerText.includes("javascript") ||
        lowerText.includes("frontend") ||
        lowerText.includes("html") ||
        lowerText.includes("css")
    ) {

        return "Web Development";

    }


    if (
        lowerText.includes("python") ||
        lowerText.includes("django") ||
        lowerText.includes("flask") ||
        lowerText.includes("backend")
    ) {

        return "Software Development";

    }


    if (
        lowerText.includes("ui/ux") ||
        lowerText.includes("figma") ||
        lowerText.includes("user experience")
    ) {

        return "UI / UX Design";

    }


    return "Technology & Software";
}


// ======================================================
// RESUME QUALITY
// ======================================================

function calculateResumeQuality(text, parsed) {

    let score = 0;

    const lowerText =
        text.toLowerCase();


    if (text.length > 500) {
        score += 20;
    }

    if (text.length > 1200) {
        score += 10;
    }

    if (
        lowerText.includes("education")
    ) {
        score += 15;
    }

    if (
        lowerText.includes("skills")
    ) {
        score += 15;
    }

    if (
        lowerText.includes("project") ||
        lowerText.includes("projects")
    ) {
        score += 15;
    }

    if (
        lowerText.includes("experience") ||
        lowerText.includes("internship")
    ) {
        score += 10;
    }

    if (
        lowerText.includes("email") ||
        lowerText.includes("@")
    ) {
        score += 5;
    }

    if (parsed && Object.keys(parsed).length > 3) {
        score += 10;
    }


    if (score >= 80) {
        return "Strong profile";
    }

    if (score >= 60) {
        return "Good profile";
    }

    if (score >= 40) {
        return "Needs improvement";
    }

    return "Basic profile";
}


// ======================================================
// GENERATE SUMMARY
// ======================================================

function generateSummary(
    text,
    skills,
    career
) {

    const cleanSkills =
        skills || "multiple skills";


    const cleanCareer =
        career || "technology-related roles";


    return (
        "Your resume highlights " +
        cleanSkills +
        ". Based on the information provided, " +
        "your profile shows potential for " +
        cleanCareer +
        ". Strengthening your projects, experience " +
        "and measurable achievements can make your " +
        "professional profile stronger."
    );
}