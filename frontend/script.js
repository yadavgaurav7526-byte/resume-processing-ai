// ======================================================
// PORTFOLIOAI — MAIN SCRIPT
// ======================================================


// ======================================================
// AUTH MODAL
// ======================================================

const authOverlay =
    document.getElementById("authOverlay");

const closeAuth =
    document.getElementById("closeAuth");

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const showSignup =
    document.getElementById("showSignup");

const showLogin =
    document.getElementById("showLogin");


// ======================================================
// OPEN LOGIN
// ======================================================

const loginButton =
    document.querySelector(".login-btn");

if (
    loginButton &&
    authOverlay &&
    loginForm &&
    signupForm
) {

    loginButton.addEventListener(
        "click",
        function () {

            authOverlay.classList.add("active");

            loginForm.classList.remove("hidden");

            signupForm.classList.add("hidden");

        }
    );

}


// ======================================================
// OPEN SIGNUP
// ======================================================

const primaryButton =
    document.querySelector(".primary-btn");

if (
    primaryButton &&
    authOverlay &&
    loginForm &&
    signupForm
) {

    primaryButton.addEventListener(
        "click",
        function () {

            authOverlay.classList.add("active");

            signupForm.classList.remove("hidden");

            loginForm.classList.add("hidden");

        }
    );

}


// ======================================================
// HERO GET STARTED
// ======================================================

const heroButton =
    document.querySelector(".hero-btn");

if (
    heroButton &&
    authOverlay &&
    loginForm &&
    signupForm
) {

    heroButton.addEventListener(
        "click",
        function () {

            authOverlay.classList.add("active");

            signupForm.classList.remove("hidden");

            loginForm.classList.add("hidden");

        }
    );

}


// ======================================================
// CLOSE AUTH MODAL
// ======================================================

if (closeAuth && authOverlay) {

    closeAuth.addEventListener(
        "click",
        function () {

            authOverlay.classList.remove("active");

        }
    );

}


// ======================================================
// CLICK OUTSIDE MODAL
// ======================================================

if (authOverlay) {

    authOverlay.addEventListener(
        "click",
        function (event) {

            if (event.target === authOverlay) {

                authOverlay.classList.remove("active");

            }

        }
    );

}


// ======================================================
// SWITCH TO SIGNUP
// ======================================================

if (
    showSignup &&
    loginForm &&
    signupForm
) {

    showSignup.addEventListener(
        "click",
        function () {

            loginForm.classList.add("hidden");

            signupForm.classList.remove("hidden");

        }
    );

}


// ======================================================
// SWITCH TO LOGIN
// ======================================================

if (
    showLogin &&
    loginForm &&
    signupForm
) {

    showLogin.addEventListener(
        "click",
        function () {

            signupForm.classList.add("hidden");

            loginForm.classList.remove("hidden");

        }
    );

}


// ======================================================
// SIGNUP
// ======================================================

if (signupForm) {

    const signupHTMLForm =
        signupForm.querySelector("form");


    if (signupHTMLForm) {

        signupHTMLForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const nameInput =
                    document.getElementById(
                        "signupName"
                    );

                const emailInput =
                    document.getElementById(
                        "signupEmail"
                    );

                const passwordInput =
                    document.getElementById(
                        "signupPassword"
                    );


                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "";


                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";


                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                try {

                    console.log(
                        "📤 Sending signup request..."
                    );


                    const response =
                        await fetch(
                            "https://resume-processing-ai.vercel.app/api/signup",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        name,
                                        email,
                                        password
                                    })
                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "📥 Signup response:",
                        data
                    );


                    if (response.ok) {

                        alert(
                            "Account created successfully! ✦"
                        );


                        signupHTMLForm.reset();


                        signupForm.classList.add(
                            "hidden"
                        );

                        loginForm.classList.remove(
                            "hidden"
                        );

                    }

                    else {

                        alert(
                            data.message ||
                            "Could not create account."
                        );

                    }

                }

                catch (error) {

                    console.error(
                        "❌ Signup error:",
                        error
                    );


                    alert(
                        "Could not connect to the server."
                    );

                }

            }
        );

    }

}


// ======================================================
// LOGIN
// ======================================================

if (loginForm) {

    const loginHTMLForm =
        loginForm.querySelector("form");


    if (loginHTMLForm) {

        loginHTMLForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const emailInput =
                    document.getElementById(
                        "loginEmail"
                    );

                const passwordInput =
                    document.getElementById(
                        "loginPassword"
                    );


                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";


                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                try {

                    console.log(
                        "📤 Sending login request..."
                    );


                    const response =
                        await fetch(
                            "https://resume-processing-ai.vercel.app/api/login",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        email,
                                        password
                                    })
                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "📥 Login response:",
                        data
                    );


                    if (response.ok) {

                        alert(
                            "Welcome back, " +
                            data.user.name +
                            "! ✦"
                        );


                        localStorage.setItem(
                            "portfolioUser",
                            JSON.stringify(
                                data.user
                            )
                        );


                        window.location.href =
                            "dashboard.html";

                    }

                    else {

                        alert(
                            data.message ||
                            "Login failed."
                        );

                    }

                }

                catch (error) {

                    console.error(
                        "❌ Login error:",
                        error
                    );


                    alert(
                        "Could not connect to the server."
                    );

                }

            }
        );

    }

}


// ======================================================
// DASHBOARD PERSONALIZATION
// ======================================================

const savedUser =
    localStorage.getItem(
        "portfolioUser"
    );


if (savedUser) {

    try {

        const user =
            JSON.parse(savedUser);


        const userName =
            user.name || "User";


        const firstLetter =
            userName
                .charAt(0)
                .toUpperCase();


        const sidebarUserName =
            document.getElementById(
                "sidebarUserName"
            );


        const headerUserName =
            document.getElementById(
                "headerUserName"
            );


        const sidebarAvatar =
            document.getElementById(
                "sidebarAvatar"
            );


        const headerAvatar =
            document.getElementById(
                "headerAvatar"
            );


        if (sidebarUserName) {

            sidebarUserName.textContent =
                userName;

        }


        if (headerUserName) {

            headerUserName.textContent =
                userName;

        }


        if (sidebarAvatar) {

            sidebarAvatar.textContent =
                firstLetter;

        }


        if (headerAvatar) {

            headerAvatar.textContent =
                firstLetter;

        }


        const currentHour =
            new Date().getHours();


        let greeting;


        if (currentHour < 12) {

            greeting =
                "Good morning";

        }

        else if (currentHour < 17) {

            greeting =
                "Good afternoon";

        }

        else if (currentHour < 22) {

            greeting =
                "Good evening";

        }

        else {

            greeting =
                "Good night";

        }


        const dashboardGreeting =
            document.getElementById(
                "dashboardGreeting"
            );


        if (dashboardGreeting) {

            dashboardGreeting.textContent =
                `${greeting}, ${userName}.`;

        }

    }

    catch (error) {

        console.error(
            "Could not load saved user:",
            error
        );

    }

}

// ======================================================
// PORTFOLIO READINESS
// ======================================================

function updatePortfolioReadiness() {

    const savedResume =
        localStorage.getItem("portfolioResume");


    const score =
        document.getElementById("portfolioScore");

    const progressFill =
        document.getElementById("progressFill");

    const readinessTitle =
        document.getElementById("readinessTitle");

    const readinessDescription =
        document.getElementById(
            "readinessDescription"
        );

    const resumeStep =
        document.getElementById("stepResume");

    const dnaStep =
        document.getElementById("stepDNA");

    const customizeStep =
        document.getElementById("stepCustomize");

    const publishStep =
        document.getElementById("stepPublish");

    const resumeStepText =
        document.getElementById("resumeStepText");

    const dnaStepText =
        document.getElementById("dnaStepText");

    const actionTitle =
        document.getElementById("actionTitle");

    const actionDescription =
        document.getElementById(
            "actionDescription"
        );

    const actionButton =
        document.getElementById(
            "readinessActionBtn"
        );


    // ==================================================
    // NO RESUME
    // ==================================================

    if (!savedResume) {

        if (score)
            score.textContent = "0%";


        if (progressFill)
            progressFill.style.width = "0%";


        if (readinessTitle)
            readinessTitle.textContent =
                "Your portfolio starts here.";


        if (readinessDescription)
            readinessDescription.textContent =
                "Complete each step to turn your resume into a polished professional portfolio.";


        if (resumeStep)
            resumeStep.classList.add("active");


        if (dnaStep)
            dnaStep.classList.remove("active");


        if (customizeStep)
            customizeStep.classList.remove("active");


        if (publishStep)
            publishStep.classList.remove("active");


        if (resumeStepText)
            resumeStepText.textContent =
                "Upload your resume";


        if (dnaStepText)
            dnaStepText.textContent =
                "Discover your professional profile";


        if (actionTitle)
            actionTitle.textContent =
                "Ready to get started?";


        if (actionDescription)
            actionDescription.textContent =
                "Upload your resume and we'll take it from there.";


        if (actionButton) {

            actionButton.innerHTML =
                'Upload resume <span>→</span>';

            actionButton.onclick =
                function () {

                    const fileInput =
                        document.getElementById(
                            "resumeFile"
                        );

                    if (fileInput) {
                        fileInput.click();
                    }

                };

        }

        return;
    }


    // ==================================================
    // RESUME EXISTS
    // ==================================================

    if (score)
        score.textContent = "85%";


    if (progressFill)
        progressFill.style.width = "85%";


    if (readinessTitle)
        readinessTitle.textContent =
            "Your foundation is ready.";


    if (readinessDescription)
        readinessDescription.textContent =
            "Your resume has been processed. Now refine your professional identity and bring your portfolio to life.";


    // Resume completed

    if (resumeStep)
        resumeStep.classList.add("active");


    if (resumeStepText)
        resumeStepText.textContent =
            "Resume processed ✓";


    // Career DNA active

    if (dnaStep)
        dnaStep.classList.add("active");


    if (dnaStepText)
        dnaStepText.textContent =
            "Review your Career DNA";


    // Future steps

    if (customizeStep)
        customizeStep.classList.remove("active");


    if (publishStep)
        publishStep.classList.remove("active");


    if (actionTitle)
        actionTitle.textContent =
            "Your next step is ready.";


    if (actionDescription)
        actionDescription.textContent =
            "Review your Career DNA before customizing your portfolio.";


    if (actionButton) {

        actionButton.innerHTML =
            'Continue to Career DNA <span>→</span>';

        actionButton.onclick =
            function () {

                window.location.href =
                    "career-dna.html";

            };

    }

}


// Run dashboard status

updatePortfolioReadiness();

    

// ======================================================
// RESUME ELEMENTS
// ======================================================

const resumeFile =
    document.getElementById(
        "resumeFile"
    );

const selectedFile =
    document.getElementById(
        "selectedFile"
    );

const selectedFileName =
    document.getElementById(
        "selectedFileName"
    );

const selectedFileSize =
    document.getElementById(
        "selectedFileSize"
    );

const chooseFileText =
    document.getElementById(
        "chooseFileText"
    );

const analyzeResumeBtn =
    document.getElementById(
        "analyzeResumeBtn"
    );

const uploadStatus =
    document.getElementById(
        "uploadStatus"
    );


let selectedResume = null;


// ======================================================
// SELECT PDF
// ======================================================

if (resumeFile) {

    resumeFile.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            if (!file) {
                return;
            }


            if (
                file.type !==
                "application/pdf"
            ) {

                alert(
                    "Please choose a PDF file."
                );

                this.value = "";

                return;

            }


            if (
                file.size >
                10 * 1024 * 1024
            ) {

                alert(
                    "PDF must be smaller than 10 MB."
                );

                this.value = "";

                return;

            }


            selectedResume =
                file;


            const fileSizeMB =
                (
                    file.size /
                    (1024 * 1024)
                ).toFixed(2);


            if (selectedFileName) {

                selectedFileName.textContent =
                    file.name;

            }


            if (selectedFileSize) {

                selectedFileSize.textContent =
                    `${fileSizeMB} MB • PDF`;

            }


            if (selectedFile) {

                selectedFile.classList.add(
                    "show"
                );

            }


            if (chooseFileText) {

                chooseFileText.textContent =
                    "Change file";

            }


            if (analyzeResumeBtn) {

                analyzeResumeBtn.classList.add(
                    "show"
                );

                analyzeResumeBtn.disabled =
                    false;

                analyzeResumeBtn.innerHTML =
                    "Upload & Analyze →";

            }


            if (uploadStatus) {

                uploadStatus.textContent =
                    "";

                uploadStatus.classList.remove(
                    "active"
                );

                uploadStatus.classList.remove(
                    "success"
                );

            }


            console.log(
                "📄 PDF selected:",
                file.name
            );

        }
    );

}


// ======================================================
// UPLOAD + AI ANALYZE
// ======================================================

if (analyzeResumeBtn) {

    analyzeResumeBtn.addEventListener(
        "click",
        async function () {

            if (!selectedResume) {

                alert(
                    "Please choose a resume first."
                );

                return;

            }


            analyzeResumeBtn.disabled =
                true;

            analyzeResumeBtn.innerHTML =
                "Analyzing with AI...";


            if (uploadStatus) {

                uploadStatus.textContent =
                    "AI is reading your resume...";

                uploadStatus.classList.add(
                    "active"
                );

                uploadStatus.classList.remove(
                    "success"
                );

            }


            const formData =
                new FormData();


            formData.append(
                "resume",
                selectedResume
            );


            try {

                console.log(
                    "📤 Sending resume to backend..."
                );


                const response =
                    await fetch(
                        "https://resume-processing-ai.vercel.app/api/upload-resume",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "📥 Backend response:",
                    data
                );


                if (response.ok) {

                    if (!data.text) {

                        throw new Error(
                            "Backend did not return extracted text."
                        );

                    }


                    const resumeData = {

                        fileName:
                            data.fileName ||
                            selectedResume.name,

                        text:
                            data.text,

                        parsedData:
                            data.parsedData ||
                            null

                    };


                    localStorage.setItem(
                        "portfolioResume",
                        JSON.stringify(
                            resumeData
                        )
                    );


                    console.log(
                        "💾 Resume saved:"
                    );

                    console.log(
                        resumeData
                    );


                    if (uploadStatus) {

                        uploadStatus.textContent =
                            "✓ Resume analyzed successfully!";

                        uploadStatus.classList.add(
                            "success"
                        );

                    }


                    analyzeResumeBtn.innerHTML =
                        "Resume analyzed ✓";


                    setTimeout(
                        function () {

                            window.location.href =
                                "career-dna.html";

                        },
                        800
                    );

                }

                else {

                    console.error(
                        "❌ Upload failed:",
                        data
                    );


                    if (uploadStatus) {

                        uploadStatus.textContent =
                            data.message ||
                            "Upload failed.";

                    }


                    analyzeResumeBtn.disabled =
                        false;

                    analyzeResumeBtn.innerHTML =
                        "Upload & Analyze →";

                }

            }

            catch (error) {

                console.error(
                    "❌ Resume upload error:",
                    error
                );


                if (uploadStatus) {

                    uploadStatus.textContent =
                        error.message ||
                        "Could not connect to the server.";

                }


                analyzeResumeBtn.disabled =
                    false;

                analyzeResumeBtn.innerHTML =
                    "Upload & Analyze →";

            }

        }
    );

}

// ======================================================
// DASHBOARD — PORTFOLIO STRENGTH
// ======================================================

const portfolioScore =
    document.getElementById("portfolioScore");

const portfolioScoreCircle =
    document.getElementById("portfolioScoreCircle");

const portfolioStrengthDescription =
    document.getElementById(
        "portfolioStrengthDescription"
    );

const buildPortfolioBtn =
    document.getElementById(
        "buildPortfolioBtn"
    );

const buildPortfolioTitle =
    document.getElementById(
        "buildPortfolioTitle"
    );

const buildPortfolioDescription =
    document.getElementById(
        "buildPortfolioDescription"
    );


// ======================================================
// CALCULATE PORTFOLIO STRENGTH
// ======================================================

function calculatePortfolioStrength() {

    const savedResume =
        localStorage.getItem("portfolioResume");


    // No resume uploaded
    if (!savedResume) {

        return 0;

    }


    try {

        const resumeData =
            JSON.parse(savedResume);


        const data =
            resumeData.parsedData || {};


        let score = 0;


        // ----------------------------------------------
        // PERSONAL INFORMATION
        // ----------------------------------------------

        if (data.name) {

            score += 10;

        }


        if (data.email) {

            score += 5;

        }


        if (
            data.phone ||
            data.location
        ) {

            score += 5;

        }


        // ----------------------------------------------
        // PROFESSIONAL INTRODUCTION
        // ----------------------------------------------

        if (
            data.introduction &&
            String(data.introduction).trim().length > 20
        ) {

            score += 15;

        }


        // ----------------------------------------------
        // EDUCATION
        // ----------------------------------------------

        if (
            Array.isArray(data.education) &&
            data.education.length > 0
        ) {

            score += 15;

        }


        // ----------------------------------------------
        // EXPERIENCE
        // ----------------------------------------------

        if (
            Array.isArray(data.experience) &&
            data.experience.length > 0
        ) {

            score += 15;

        }


        // ----------------------------------------------
        // PROJECTS
        // ----------------------------------------------

        if (
            Array.isArray(data.projects) &&
            data.projects.length > 0
        ) {

            score += 15;

        }


        // ----------------------------------------------
        // SKILLS
        // ----------------------------------------------

        if (
            Array.isArray(data.skills) &&
            data.skills.length > 0
        ) {

            score += 10;

        }


        // ----------------------------------------------
        // ACHIEVEMENTS
        // ----------------------------------------------

        if (
            Array.isArray(data.achievements) &&
            data.achievements.length > 0
        ) {

            score += 5;

        }


        // ----------------------------------------------
        // LINKS
        // ----------------------------------------------

        if (
            data.github ||
            data.linkedin
        ) {

            score += 5;

        }


        return Math.min(score, 100);

    }

    catch (error) {

        console.error(
            "Could not calculate portfolio strength:",
            error
        );

        return 0;

    }

}


// ======================================================
// UPDATE PORTFOLIO STRENGTH UI
// ======================================================

function updatePortfolioStrength() {

    const score =
        calculatePortfolioStrength();


    if (portfolioScore) {

        portfolioScore.textContent =
            score + "%";

    }


    if (portfolioScoreCircle) {

        portfolioScoreCircle.style.setProperty(
            "--score",
            score
        );

    }


    // ----------------------------------------------
    // NO RESUME
    // ----------------------------------------------

    if (score === 0) {

        if (portfolioStrengthDescription) {

            portfolioStrengthDescription.textContent =
                "Upload your resume to start building your portfolio.";

        }

        return;

    }


    // ----------------------------------------------
    // EARLY STAGE
    // ----------------------------------------------

    if (score < 30) {

        if (portfolioStrengthDescription) {

            portfolioStrengthDescription.textContent =
                "Your profile has started. Add more career information to strengthen it.";

        }

        return;

    }


    // ----------------------------------------------
    // DEVELOPING
    // ----------------------------------------------

    if (score < 60) {

        if (portfolioStrengthDescription) {

            portfolioStrengthDescription.textContent =
                "Your portfolio is taking shape. Add projects, skills and experience to improve it.";

        }

        return;

    }


    // ----------------------------------------------
    // STRONG
    // ----------------------------------------------

    if (score < 85) {

        if (portfolioStrengthDescription) {

            portfolioStrengthDescription.textContent =
                "Great progress. A few more details can make your professional profile stand out.";

        }

        return;

    }


    // ----------------------------------------------
    // COMPLETE
    // ----------------------------------------------

    if (portfolioStrengthDescription) {

        portfolioStrengthDescription.textContent =
            "Your profile is looking strong. You're ready to create a polished portfolio.";

    }

}


// ======================================================
// BUILD PORTFOLIO CARD
// ======================================================

function updateBuildPortfolioCard() {

    const savedResume =
        localStorage.getItem("portfolioResume");


    // ----------------------------------------------
    // RESUME DOES NOT EXIST
    // ----------------------------------------------

    if (!savedResume) {

        if (buildPortfolioTitle) {

            buildPortfolioTitle.textContent =
                "Build your portfolio";

        }


        if (buildPortfolioDescription) {

            buildPortfolioDescription.textContent =
                "Start with your existing resume and let PortfolioAI turn it into your professional identity.";

        }


        if (buildPortfolioBtn) {

            buildPortfolioBtn.innerHTML =
                'Upload resume <span>→</span>';

        }


        return;

    }


    // ----------------------------------------------
    // RESUME ALREADY EXISTS
    // ----------------------------------------------

    if (buildPortfolioTitle) {

        buildPortfolioTitle.textContent =
            "Continue building";

    }


    if (buildPortfolioDescription) {

        buildPortfolioDescription.textContent =
            "Your resume is already processed. Review your Career DNA and continue building your portfolio.";

    }


    if (buildPortfolioBtn) {

        buildPortfolioBtn.innerHTML =
            'Continue to Career DNA <span>→</span>';

    }

}


// ======================================================
// BUILD PORTFOLIO BUTTON
// ======================================================

if (buildPortfolioBtn) {

    buildPortfolioBtn.addEventListener(
        "click",
        function () {

            const savedResume =
                localStorage.getItem(
                    "portfolioResume"
                );


            // ------------------------------------------
            // NO RESUME → GO TO UPLOAD
            // ------------------------------------------

            if (!savedResume) {

                const uploadSection =
                    document.querySelector(
                        ".upload-section"
                    );


                if (uploadSection) {

                    uploadSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

                return;

            }


            // ------------------------------------------
            // RESUME EXISTS → CAREER DNA
            // ------------------------------------------

            window.location.href =
                "career-dna.html";

        }
    );

}


// ======================================================
// RUN DASHBOARD FUNCTIONS
// ======================================================

if (
    portfolioScore ||
    buildPortfolioBtn
) {

    updatePortfolioStrength();

    updateBuildPortfolioCard();

}