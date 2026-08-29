// ======================================================
// PORTFOLIOAI — GENERATED PORTFOLIO
// ======================================================

console.log(
    "🚀 Portfolio page loaded."
);


// ======================================================
// LOAD CAREER DNA
// ======================================================

const savedCareerDNA =
    localStorage.getItem(
        "careerDNA"
    );


if (!savedCareerDNA) {

    alert(
        "No Career DNA found."
    );

    window.location.href =
        "career-dna.html";

}


let data;


try {

    data =
        JSON.parse(
            savedCareerDNA
        );

}

catch (error) {

    console.error(
        "❌ Invalid Career DNA:",
        error
    );

    alert(
        "Could not load portfolio data."
    );

    window.location.href =
        "career-dna.html";

}


console.log(
    "🧬 Portfolio data:",
    data
);


// ======================================================
// SAFE VALUE
// ======================================================

function safe(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value);

}


// ======================================================
// SAFE HTML
// ======================================================

function escapeHTML(value) {

    return safe(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ======================================================
// TEXT
// ======================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            safe(value);

    }

}


// ======================================================
// LINKS
// ======================================================

function setLink(
    id,
    url
) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    if (!url) {

        element.style.display =
            "none";

        return;

    }


    element.href =
        url;

}


// ======================================================
// BASIC INFORMATION
// ======================================================

setText(
    "portfolioName",
    data.name
);


setText(
    "portfolioIntroduction",
    data.introduction
);


setText(
    "portfolioEmail",
    data.email
);


setText(
    "portfolioPhone",
    data.phone
);


setText(
    "portfolioLocation",
    data.location
);


setLink(
    "portfolioGithub",
    data.github
);


setLink(
    "portfolioLinkedin",
    data.linkedin
);


// ======================================================
// EDUCATION
// ======================================================

const educationContainer =
    document.getElementById(
        "portfolioEducation"
    );


if (educationContainer) {

    const education =
        Array.isArray(
            data.education
        )
            ? data.education
            : [];


    if (
        education.length === 0
    ) {

        educationContainer.innerHTML =
            "<p>No education information available.</p>";

    }

    else {

        educationContainer.innerHTML =
            education
                .map(
                    function (item) {

                        return `

                            <article
                                class="portfolio-item"
                            >

                                <h3>
                                    ${escapeHTML(
                                        item.degree
                                    )}
                                </h3>

                                <strong>
                                    ${escapeHTML(
                                        item.institution
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        item.duration
                                    )}
                                </span>

                            </article>

                        `;

                    }
                )
                .join("");

    }

}


// ======================================================
// EXPERIENCE
// ======================================================

const experienceContainer =
    document.getElementById(
        "portfolioExperience"
    );


if (experienceContainer) {

    const experience =
        Array.isArray(
            data.experience
        )
            ? data.experience
            : [];


    if (
        experience.length === 0
    ) {

        experienceContainer.innerHTML =
            "<p>No professional experience listed.</p>";

    }

    else {

        experienceContainer.innerHTML =
            experience
                .map(
                    function (item) {

                        return `

                            <article
                                class="portfolio-item"
                            >

                                <h3>
                                    ${escapeHTML(
                                        item.role
                                    )}
                                </h3>

                                <strong>
                                    ${escapeHTML(
                                        item.company
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        item.duration
                                    )}
                                </span>

                                <p>
                                    ${escapeHTML(
                                        item.description
                                    )}
                                </p>

                            </article>

                        `;

                    }
                )
                .join("");

    }

}


// ======================================================
// PROJECTS
// ======================================================

const projectsContainer =
    document.getElementById(
        "portfolioProjects"
    );


if (projectsContainer) {

    const projects =
        Array.isArray(
            data.projects
        )
            ? data.projects
            : [];


    if (
        projects.length === 0
    ) {

        projectsContainer.innerHTML =
            "<p>No projects listed.</p>";

    }

    else {

        projectsContainer.innerHTML =
            projects
                .map(
                    function (project) {

                        return `

                            <article
                                class="portfolio-project"
                            >

                                <h3>
                                    ${escapeHTML(
                                        project.name
                                    )}
                                </h3>

                                <p>
                                    ${escapeHTML(
                                        project.description
                                    )}
                                </p>

                                <span>
                                    ${escapeHTML(
                                        project.technologies
                                    )}
                                </span>

                            </article>

                        `;

                    }
                )
                .join("");

    }

}


// ======================================================
// SKILLS
// ======================================================

const skillsContainer =
    document.getElementById(
        "portfolioSkills"
    );


if (skillsContainer) {

    const skills =
        Array.isArray(
            data.skills
        )
            ? data.skills
            : [];


    skillsContainer.innerHTML =
        skills
            .map(
                function (skill) {

                    return `

                        <span
                            class="portfolio-skill"
                        >
                            ${escapeHTML(skill)}
                        </span>

                    `;

                }
            )
            .join("");

}


// ======================================================
// ACHIEVEMENTS
// ======================================================

const achievementsContainer =
    document.getElementById(
        "portfolioAchievements"
    );


if (achievementsContainer) {

    const achievements =
        Array.isArray(
            data.achievements
        )
            ? data.achievements
            : [];


    if (
        achievements.length === 0
    ) {

        achievementsContainer.innerHTML =
            "<p>No achievements listed.</p>";

    }

    else {

        achievementsContainer.innerHTML =
            achievements
                .map(
                    function (achievement) {

                        return `

                            <article
                                class="portfolio-item"
                            >

                                <p>
                                    ${escapeHTML(
                                        achievement
                                    )}
                                </p>

                            </article>

                        `;

                    }
                )
                .join("");

    }

}


// ======================================================
// SELECTED TEMPLATE
// ======================================================

const selectedTemplate =
    localStorage.getItem(
        "selectedTemplate"
    ) || "minimal";


document.body.dataset.template =
    selectedTemplate;


console.log(
    "🎨 Active template:",
    selectedTemplate
);


// ======================================================
// BACK TO TEMPLATES BUTTON
// ======================================================

const portfolioNav =
    document.querySelector(
        ".portfolio-nav"
    );


if (portfolioNav) {

    const backButton =
        document.createElement(
            "a"
        );


    backButton.href =
        "templates.html";


    backButton.textContent =
        "← Design";


    backButton.className =
        "portfolio-back-button";


    portfolioNav.appendChild(
        backButton
    );

}


// ======================================================
// EDIT PORTFOLIO BUTTON
// ======================================================

const editButton =
    document.createElement(
        "button"
    );


editButton.type =
    "button";


editButton.textContent =
    "Edit Career DNA";


editButton.className =
    "portfolio-edit-button";


editButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "career-dna.html";

    }
);


document.body.appendChild(
    editButton
);


console.log(
    "✅ Portfolio generated successfully."
);
