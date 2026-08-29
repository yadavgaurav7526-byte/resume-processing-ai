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
                            "http://localhost:3000/api/signup",
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
                            "http://localhost:3000/api/login",
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
                        "http://localhost:3000/api/upload-resume",
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
