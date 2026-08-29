// ======================================================
// PORTFOLIOAI — CAREER DNA
// ======================================================

console.log("🧬 Career DNA page loaded ✦");

// ======================================================
// HELPERS
// ======================================================

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function asString(value) {
    return value == null ? "" : String(value).trim();
}

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

// ======================================================
// LOAD LOGGED-IN USER
// ======================================================

let savedUser = null;

try {
    const rawUser = localStorage.getItem("portfolioUser");

    if (rawUser) {
        savedUser = JSON.parse(rawUser);
    }
} catch (error) {
    console.error("❌ Could not load user:", error);
}

const userName = asString(savedUser?.name) || "User";
const userEmail = asString(savedUser?.email);
const firstLetter = userName.charAt(0).toUpperCase() || "U";

const sidebarName = document.getElementById("careerSidebarName");
const sidebarAvatar = document.getElementById("careerSidebarAvatar");

if (sidebarName) {
    sidebarName.textContent = userName;
}

if (sidebarAvatar) {
    sidebarAvatar.textContent = firstLetter;
}

// ======================================================
// LOAD SAVED RESUME
// ======================================================

let resumeData = null;
const savedResume = localStorage.getItem("portfolioResume");

if (savedResume) {
    try {
        resumeData = JSON.parse(savedResume);
        console.log("📄 Saved resume loaded:", resumeData);
    } catch (error) {
        console.error("❌ Could not read saved resume:", error);
    }
}

const resumeFileName = document.getElementById("resumeFileName");

if (resumeFileName) {
    resumeFileName.textContent =
        resumeData?.fileName || "Your resume";
}

const rawResumeText = asString(resumeData?.text);

console.log("📄 Extracted resume text:");
console.log(rawResumeText || "No extracted resume text found.");

// ======================================================
// DEFAULT CAREER DATA
// ======================================================

const defaultCareerData = {
    name: "",
    email: "",
    phone: "",
    location: "",
    introduction: "",
    education: [],
    experience: [],
    projects: [],
    skills: [],
    achievements: [],
    certifications: [],
    github: "",
    linkedin: ""
};

// ======================================================
// NORMALIZE CAREER DATA
// ======================================================

function normalizeCareerData(data = {}) {
    const normalized = {
        ...defaultCareerData,
        name: asString(data.name),
        email: asString(data.email),
        phone: asString(data.phone),
        location: asString(data.location),
        introduction: asString(data.introduction),
        github: asString(data.github),
        linkedin: asString(data.linkedin),
        education: [],
        experience: [],
        projects: [],
        skills: [],
        achievements: [],
        certifications: []
    };

    normalized.education = asArray(data.education)
        .map(item => ({
            degree: asString(item?.degree),
            institution: asString(item?.institution),
            duration: asString(item?.duration)
        }))
        .filter(item => item.degree || item.institution || item.duration);

    normalized.experience = asArray(data.experience)
        .map(item => ({
            role: asString(item?.role),
            company: asString(item?.company),
            duration: asString(item?.duration),
            description: asString(item?.description)
        }))
        .filter(item =>
            item.role || item.company || item.duration || item.description
        );

    normalized.projects = asArray(data.projects)
        .map(item => ({
            name: asString(item?.name),
            description: asString(item?.description),
            technologies: asString(item?.technologies)
        }))
        .filter(item =>
            item.name || item.description || item.technologies
        );

    normalized.skills = [
        ...new Set(
            asArray(data.skills)
                .map(asString)
                .filter(Boolean)
        )
    ];

    normalized.achievements = asArray(data.achievements)
        .map(asString)
        .filter(Boolean);

    normalized.certifications = asArray(data.certifications)
        .map(asString)
        .filter(Boolean);

    return normalized;
}

// ======================================================
// LOCAL FALLBACK PARSER
// Used only when backend AI data is unavailable.
// ======================================================

function parseResumeLocally(text) {
    const result = normalizeCareerData({});

    if (!text) {
        return result;
    }

    const lines = text
        .replace(/\r/g, "")
        .split("\n")
        .map(line => line.replace(/[ \t]+/g, " ").trim())
        .filter(Boolean);

    const cleanText = lines.join("\n");

    const emailMatch = cleanText.match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );

    if (emailMatch) {
        result.email = emailMatch[0];
    }

    const phonePatterns = [
        /(?:\+91[\s-]?)?[6-9]\d{9}/,
        /(?:\+91[\s-]?)?\d{3}[\s-]\d{3}[\s-]\d{4}/,
        /\(?\d{3}\)?[\s-]\d{3}[\s-]\d{4}/
    ];

    for (const pattern of phonePatterns) {
        const match = cleanText.match(pattern);
        if (match) {
            result.phone = match[0].trim();
            break;
        }
    }

    const githubMatch = cleanText.match(
        /https?:\/\/(?:www\.)?github\.com\/[A-Za-z0-9_.-]+/i
    );

    if (githubMatch) {
        result.github = githubMatch[0];
    }

    const linkedinMatch = cleanText.match(
        /https?:\/\/(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_.-]+/i
    );

    if (linkedinMatch) {
        result.linkedin = linkedinMatch[0];
    }

    const emailLineIndex = lines.findIndex(line =>
        result.email && line.includes(result.email)
    );

    if (emailLineIndex > 0) {
        const possibleName = lines[emailLineIndex - 1];

        if (
            possibleName &&
            possibleName.length <= 60 &&
            !possibleName.includes("@") &&
            !/\d{5,}/.test(possibleName)
        ) {
            result.name = possibleName;
        }
    }

    if (!result.name && lines.length) {
        result.name = lines[0];
    }

    const sectionAliases = {
        education: [
            "education",
            "academic background",
            "qualifications"
        ],
        experience: [
            "experience",
            "work experience",
            "professional experience",
            "employment",
            "internship",
            "internships"
        ],
        projects: [
            "projects",
            "project",
            "academic projects"
        ],
        skills: [
            "skills",
            "technical skills",
            "core skills",
            "technologies",
            "technical competencies"
        ],
        achievements: [
            "achievements",
            "awards",
            "honors",
            "honours"
        ],
        certifications: [
            "certifications",
            "certificates",
            "licenses"
        ],
        summary: [
            "summary",
            "professional summary",
            "profile",
            "objective",
            "about me"
        ]
    };

    const normalizedLine = line =>
        line
            .toLowerCase()
            .replace(/[^a-z ]/g, "")
            .replace(/\s+/g, " ")
            .trim();

    const allSectionNames = Object.values(sectionAliases).flat();

    function getSection(aliasList) {
        const start = lines.findIndex(line =>
            aliasList.includes(normalizedLine(line))
        );

        if (start === -1) {
            return [];
        }

        const section = [];

        for (let i = start + 1; i < lines.length; i++) {
            if (allSectionNames.includes(normalizedLine(lines[i]))) {
                break;
            }
            section.push(lines[i]);
        }

        return section;
    }

    const summaryLines = getSection(sectionAliases.summary);

    if (summaryLines.length) {
        result.introduction = summaryLines.join(" ");
    }

    const educationLines = getSection(sectionAliases.education);

    for (let i = 0; i < educationLines.length; i += 3) {
        const entry = {
            degree: educationLines[i] || "",
            institution: educationLines[i + 1] || "",
            duration: educationLines[i + 2] || ""
        };

        if (entry.degree || entry.institution || entry.duration) {
            result.education.push(entry);
        }
    }

    const experienceLines = getSection(sectionAliases.experience);

    if (experienceLines.length) {
        result.experience.push({
            role: experienceLines[0] || "",
            company: experienceLines[1] || "",
            duration: experienceLines[2] || "",
            description: experienceLines.slice(3).join(" ")
        });
    }

    const projectLines = getSection(sectionAliases.projects);

    if (projectLines.length) {
        const project = {
            name: projectLines[0] || "",
            description: projectLines[1] || "",
            technologies: projectLines.slice(2).join(", ")
        };

        if (project.name || project.description || project.technologies) {
            result.projects.push(project);
        }
    }

    const skillLines = getSection(sectionAliases.skills);

    result.skills = [
        ...new Set(
            skillLines
                .join(",")
                .split(/[,|•·;]/)
                .map(asString)
                .filter(Boolean)
                .filter(skill => skill.length < 60)
        )
    ];

    result.achievements = getSection(sectionAliases.achievements)
        .map(asString)
        .filter(Boolean);

    result.certifications = getSection(sectionAliases.certifications)
        .map(asString)
        .filter(Boolean);

    return normalizeCareerData(result);
}

// ======================================================
// CAREER DATA SOURCE
// Prefer backend AI parsedData over local fallback.
// ======================================================

let careerData;

if (resumeData?.parsedData) {
    careerData = normalizeCareerData(resumeData.parsedData);
    console.log("🤖 Using AI-parsed Career DNA.");
} else {
    careerData = parseResumeLocally(rawResumeText);
    console.log("🧩 Using local fallback parser.");
}

// ======================================================
// USER DATA FALLBACKS
// ======================================================

if (!careerData.name && userName !== "User") {
    careerData.name = userName;
}

if (!careerData.email && userEmail) {
    careerData.email = userEmail;
}

// ======================================================
// PERSONAL INFORMATION
// ======================================================

function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value || "";
    }
}

setInputValue("dnaName", careerData.name);
setInputValue("dnaEmail", careerData.email);
setInputValue("dnaPhone", careerData.phone);
setInputValue("dnaLocation", careerData.location);
setInputValue("dnaIntroduction", careerData.introduction);
setInputValue("dnaGithub", careerData.github);
setInputValue("dnaLinkedin", careerData.linkedin);

// ======================================================
// EDUCATION
// ======================================================

function addEducationEntry(degree = "", institution = "", duration = "") {
    const container = document.getElementById("educationContainer");

    if (!container) return;

    const entry = document.createElement("div");
    entry.className = "dna-entry";

    entry.innerHTML = `
        <div class="entry-content">
            <input
                type="text"
                class="education-degree"
                placeholder="Degree / qualification"
                value="${escapeHTML(degree)}"
            >
            <input
                type="text"
                class="education-institution"
                placeholder="College / institution"
                value="${escapeHTML(institution)}"
            >
            <input
                type="text"
                class="education-duration"
                placeholder="Year / duration"
                value="${escapeHTML(duration)}"
            >
        </div>
        <button class="delete-entry" type="button">×</button>
    `;

    container.appendChild(entry);
}

function renderEducation() {
    const container = document.getElementById("educationContainer");
    if (!container) return;

    container.innerHTML = "";

    if (!careerData.education.length) {
        addEducationEntry();
        return;
    }

    careerData.education.forEach(item => {
        addEducationEntry(
            item.degree,
            item.institution,
            item.duration
        );
    });
}

// ======================================================
// EXPERIENCE
// ======================================================

function addExperienceEntry(
    role = "",
    company = "",
    duration = "",
    description = ""
) {
    const container = document.getElementById("experienceContainer");
    if (!container) return;

    const entry = document.createElement("div");
    entry.className = "dna-entry";

    entry.innerHTML = `
        <div class="entry-content">
            <input
                type="text"
                class="experience-role"
                placeholder="Role / position"
                value="${escapeHTML(role)}"
            >
            <input
                type="text"
                class="experience-company"
                placeholder="Company / organization"
                value="${escapeHTML(company)}"
            >
            <input
                type="text"
                class="experience-duration"
                placeholder="Year / duration"
                value="${escapeHTML(duration)}"
            >
            <textarea
                rows="4"
                class="experience-description"
                placeholder="What did you do?"
            >${escapeHTML(description)}</textarea>
        </div>
        <button class="delete-entry" type="button">×</button>
    `;

    container.appendChild(entry);
}

function renderExperience() {
    const container = document.getElementById("experienceContainer");
    if (!container) return;

    container.innerHTML = "";

    if (!careerData.experience.length) {
        container.innerHTML = `
            <div class="empty-dna">
                <span>＋</span>
                <p>No experience added yet.</p>
                <small>You can add internships, jobs or other professional experience.</small>
            </div>
        `;
        return;
    }

    careerData.experience.forEach(item => {
        addExperienceEntry(
            item.role,
            item.company,
            item.duration,
            item.description
        );
    });
}

// ======================================================
// PROJECTS
// ======================================================

function addProjectEntry(name = "", description = "", technologies = "") {
    const container = document.getElementById("projectsContainer");
    if (!container) return;

    const entry = document.createElement("div");
    entry.className = "dna-entry project-entry";

    entry.innerHTML = `
        <div class="entry-content">
            <input
                type="text"
                class="project-name"
                placeholder="Project name"
                value="${escapeHTML(name)}"
            >
            <textarea
                rows="4"
                class="project-description"
                placeholder="What did you build? What problem did it solve?"
            >${escapeHTML(description)}</textarea>
            <input
                type="text"
                class="project-technologies"
                placeholder="Technologies used"
                value="${escapeHTML(technologies)}"
            >
        </div>
        <button class="delete-entry" type="button">×</button>
    `;

    container.appendChild(entry);
}

function renderProjects() {
    const container = document.getElementById("projectsContainer");
    if (!container) return;

    container.innerHTML = "";

    if (!careerData.projects.length) {
        addProjectEntry();
        return;
    }

    careerData.projects.forEach(item => {
        addProjectEntry(
            item.name,
            item.description,
            item.technologies
        );
    });
}

// ======================================================
// SKILLS
// ======================================================

function createSkillTag(skill) {
    const container = document.getElementById("skillTags");
    const cleanSkill = asString(skill);

    if (!container || !cleanSkill) return;

    const tag = document.createElement("span");
    tag.className = "skill-tag";

    tag.innerHTML = `
        ${escapeHTML(cleanSkill)}
        <button type="button" class="remove-skill">×</button>
    `;

    container.appendChild(tag);
}

function renderSkills() {
    const container = document.getElementById("skillTags");
    if (!container) return;

    container.innerHTML = "";

    careerData.skills.forEach(createSkillTag);
}

// ======================================================
// ACHIEVEMENTS
// ======================================================

function addAchievementEntry(text = "") {
    const container = document.getElementById("achievementsContainer");
    if (!container) return;

    const entry = document.createElement("div");
    entry.className = "dna-entry";

    entry.innerHTML = `
        <div class="entry-content">
            <input
                type="text"
                class="achievement-text"
                placeholder="Achievement / award"
                value="${escapeHTML(text)}"
            >
        </div>
        <button class="delete-entry" type="button">×</button>
    `;

    container.appendChild(entry);
}

function renderAchievements() {
    const container = document.getElementById("achievementsContainer");
    if (!container) return;

    container.innerHTML = "";

    if (!careerData.achievements.length) {
        container.innerHTML = `
            <div class="empty-dna">
                <span>✦</span>
                <p>No achievements added yet.</p>
                <small>Hackathons, awards and more.</small>
            </div>
        `;
        return;
    }

    careerData.achievements.forEach(addAchievementEntry);
}

// ======================================================
// CERTIFICATIONS
// ======================================================

function addCertificationEntry(text = "") {
    const container = document.getElementById("certificationsContainer");
    if (!container) return;

    const entry = document.createElement("div");
    entry.className = "dna-entry";

    entry.innerHTML = `
        <div class="entry-content">
            <input
                type="text"
                class="certification-text"
                placeholder="Certification name"
                value="${escapeHTML(text)}"
            >
        </div>
        <button class="delete-entry" type="button">×</button>
    `;

    container.appendChild(entry);
}

function renderCertifications() {
    const container = document.getElementById("certificationsContainer");
    if (!container) return;

    container.innerHTML = "";

    if (!careerData.certifications.length) {
        container.innerHTML = `
            <div class="empty-dna">
                <span>✦</span>
                <p>No certifications added yet.</p>
            </div>
        `;
        return;
    }

    careerData.certifications.forEach(addCertificationEntry);
}

// ======================================================
// ADD BUTTONS
// ======================================================

document.getElementById("addEducation")?.addEventListener("click", () => {
    addEducationEntry();
});

document.getElementById("addExperience")?.addEventListener("click", () => {
    document.querySelector("#experienceContainer .empty-dna")?.remove();
    addExperienceEntry();
});

document.getElementById("addProject")?.addEventListener("click", () => {
    addProjectEntry();
});

document.getElementById("addAchievement")?.addEventListener("click", () => {
    document.querySelector("#achievementsContainer .empty-dna")?.remove();
    addAchievementEntry();
});

document.getElementById("addCertification")?.addEventListener("click", () => {
    document.querySelector("#certificationsContainer .empty-dna")?.remove();
    addCertificationEntry();
});

// ======================================================
// DELETE ENTRIES / SKILLS
// ======================================================

document.addEventListener("click", event => {
    const target = event.target;

    if (target.classList.contains("delete-entry")) {
        target.closest(".dna-entry")?.remove();
    }

    if (target.classList.contains("remove-skill")) {
        target.closest(".skill-tag")?.remove();
    }
});

// ======================================================
// ADD NEW SKILL
// ======================================================

document.getElementById("newSkill")?.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const input = event.currentTarget;
    const skill = input.value.trim();

    if (!skill) return;

    createSkillTag(skill);
    input.value = "";
});

// ======================================================
// CHANGE RESUME
// ======================================================

document.getElementById("changeResume")?.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

// ======================================================
// COLLECT CURRENT CAREER DATA
// ======================================================

function collectCareerData() {
    const data = {
        name: document.getElementById("dnaName")?.value.trim() || "",
        email: document.getElementById("dnaEmail")?.value.trim() || "",
        phone: document.getElementById("dnaPhone")?.value.trim() || "",
        location: document.getElementById("dnaLocation")?.value.trim() || "",
        introduction: document.getElementById("dnaIntroduction")?.value.trim() || "",
        github: document.getElementById("dnaGithub")?.value.trim() || "",
        linkedin: document.getElementById("dnaLinkedin")?.value.trim() || "",
        education: [],
        experience: [],
        projects: [],
        skills: [],
        achievements: [],
        certifications: []
    };

    document.querySelectorAll("#educationContainer .dna-entry").forEach(entry => {
        const item = {
            degree: entry.querySelector(".education-degree")?.value.trim() || "",
            institution: entry.querySelector(".education-institution")?.value.trim() || "",
            duration: entry.querySelector(".education-duration")?.value.trim() || ""
        };

        if (item.degree || item.institution || item.duration) {
            data.education.push(item);
        }
    });

    document.querySelectorAll("#experienceContainer .dna-entry").forEach(entry => {
        const item = {
            role: entry.querySelector(".experience-role")?.value.trim() || "",
            company: entry.querySelector(".experience-company")?.value.trim() || "",
            duration: entry.querySelector(".experience-duration")?.value.trim() || "",
            description: entry.querySelector(".experience-description")?.value.trim() || ""
        };

        if (item.role || item.company || item.duration || item.description) {
            data.experience.push(item);
        }
    });

    document.querySelectorAll("#projectsContainer .dna-entry").forEach(entry => {
        const item = {
            name: entry.querySelector(".project-name")?.value.trim() || "",
            description: entry.querySelector(".project-description")?.value.trim() || "",
            technologies: entry.querySelector(".project-technologies")?.value.trim() || ""
        };

        if (item.name || item.description || item.technologies) {
            data.projects.push(item);
        }
    });

    document.querySelectorAll("#skillTags .skill-tag").forEach(tag => {
        const clone = tag.cloneNode(true);
        clone.querySelector(".remove-skill")?.remove();

        const skill = clone.textContent.trim();

        if (skill) {
            data.skills.push(skill);
        }
    });

    document.querySelectorAll("#achievementsContainer .achievement-text").forEach(input => {
        const value = input.value.trim();
        if (value) data.achievements.push(value);
    });

    document.querySelectorAll("#certificationsContainer .certification-text").forEach(input => {
        const value = input.value.trim();
        if (value) data.certifications.push(value);
    });

    return normalizeCareerData(data);
}

// ======================================================
// CONTINUE TO DESIGN
// ======================================================

document.getElementById("continueToTemplates")?.addEventListener("click", () => {
    const finalCareerData = collectCareerData();

    localStorage.setItem(
        "careerDNA",
        JSON.stringify(finalCareerData)
    );

    console.log("💾 Career DNA saved:", finalCareerData);

    window.location.href = "templates.html";
});

// ======================================================
// AI IMPROVEMENT
// ======================================================

const improveCareerButton = document.getElementById("improveCareerBtn");

if (improveCareerButton) {
    improveCareerButton.addEventListener("click", async () => {
        const currentData = collectCareerData();
        const originalText = improveCareerButton.innerHTML;

        improveCareerButton.disabled = true;
        improveCareerButton.innerHTML = "✦ AI is improving...";

        const suggestionText = document.getElementById("aiSuggestionText");

        if (suggestionText) {
            suggestionText.textContent =
                "Analyzing your introduction and project descriptions...";
        }

        try {
            const response = await fetch(
                "http://localhost:3000/api/improve-career",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(currentData)
                }
            );

            let result = {};

            try {
                result = await response.json();
            } catch {
                throw new Error("Server returned an invalid response.");
            }

            if (!response.ok) {
                throw new Error(
                    result.message || "AI improvement failed."
                );
            }

            const improved = result.improvedData || result;

            if (improved.improvedIntroduction) {
                const introduction = document.getElementById("dnaIntroduction");
                if (introduction) {
                    introduction.value = improved.improvedIntroduction;
                }
            }

            if (Array.isArray(improved.improvedProjects)) {
                const entries = document.querySelectorAll(
                    "#projectsContainer .dna-entry"
                );

                improved.improvedProjects.forEach((project, index) => {
                    const entry = entries[index];
                    if (!entry) return;

                    const description = entry.querySelector(
                        ".project-description"
                    );

                    if (description && project.improvedDescription) {
                        description.value = project.improvedDescription;
                    }
                });
            }

            const updatedData = collectCareerData();

            localStorage.setItem(
                "careerDNA",
                JSON.stringify(updatedData)
            );

            if (suggestionText) {
                suggestionText.textContent =
                    "✓ AI improvements applied. Review them before continuing.";
            }

            improveCareerButton.innerHTML = "✓ AI Improvements Applied";
        } catch (error) {
            console.error("❌ AI improvement error:", error);

            if (suggestionText) {
                suggestionText.textContent =
                    "Could not connect to AI. Please make sure the backend is running and try again.";
            }

            improveCareerButton.disabled = false;
            improveCareerButton.innerHTML = originalText;
        }
    });
}

// ======================================================
// INITIAL RENDER
// ======================================================

renderEducation();
renderExperience();
renderProjects();
renderSkills();
renderAchievements();
renderCertifications();

console.log("🧬 Parsed Career DNA:", careerData);
console.log("✅ Career DNA ready.");
