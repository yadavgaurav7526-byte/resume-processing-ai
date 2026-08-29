// ======================================================
// PORTFOLIOAI — TEMPLATE SELECTION
// ======================================================

console.log(
    "🎨 Templates page loaded."
);


// ======================================================
// LOAD USER
// ======================================================

const savedUser =
    localStorage.getItem(
        "portfolioUser"
    );


if (savedUser) {

    try {

        const user =
            JSON.parse(
                savedUser
            );


        const name =
            user.name || "User";


        const avatar =
            document.getElementById(
                "templateAvatar"
            );


        const userName =
            document.getElementById(
                "templateUserName"
            );


        if (avatar) {

            avatar.textContent =
                name
                    .charAt(0)
                    .toUpperCase();

        }


        if (userName) {

            userName.textContent =
                name;

        }

    }

    catch (error) {

        console.error(
            "Could not load user:",
            error
        );

    }

}


// ======================================================
// LOAD CAREER DNA
// ======================================================

const savedCareerDNA =
    localStorage.getItem(
        "careerDNA"
    );


if (!savedCareerDNA) {

    alert(
        "Please complete your Career DNA first."
    );

    window.location.href =
        "career-dna.html";

}


let careerDNA = null;


try {

    careerDNA =
        JSON.parse(
            savedCareerDNA
        );


    console.log(
        "🧬 Career DNA loaded:",
        careerDNA
    );

}

catch (error) {

    console.error(
        "❌ Could not read Career DNA:",
        error
    );


    alert(
        "Career data could not be loaded."
    );


    window.location.href =
        "career-dna.html";

}


// ======================================================
// TEMPLATE CARDS
// ======================================================

const templateCards =
    document.querySelectorAll(
        ".template-card"
    );


let selectedTemplate =
    localStorage.getItem(
        "selectedTemplate"
    ) || "minimal";


function updateSelectedTemplate() {

    templateCards.forEach(
        function (card) {

            if (
                card.dataset.template ===
                selectedTemplate
            ) {

                card.classList.add(
                    "selected"
                );

            }

            else {

                card.classList.remove(
                    "selected"
                );

            }

        }
    );

}


updateSelectedTemplate();


templateCards.forEach(
    function (card) {

        card.addEventListener(
            "click",
            function () {

                selectedTemplate =
                    card.dataset.template;


                localStorage.setItem(
                    "selectedTemplate",
                    selectedTemplate
                );


                updateSelectedTemplate();


                console.log(
                    "🎨 Selected template:",
                    selectedTemplate
                );

            }
        );

    }
);


// ======================================================
// CREATE PORTFOLIO
// ======================================================

const generateButton =
    document.getElementById(
        "generatePortfolio"
    );


if (generateButton) {

    generateButton.addEventListener(
        "click",
        function () {

            if (!careerDNA) {

                alert(
                    "Career data is missing."
                );

                return;

            }


            // ------------------------------------------
            // SAVE TEMPLATE
            // ------------------------------------------

            localStorage.setItem(
                "selectedTemplate",
                selectedTemplate
            );


            localStorage.setItem(
                "portfolioReady",
                "true"
            );


            console.log(
                "🚀 Portfolio generation started."
            );


            // ------------------------------------------
            // BUTTON LOADING STATE
            // ------------------------------------------

            generateButton.disabled =
                true;


            generateButton.innerHTML =
                "Creating portfolio...";


            // ------------------------------------------
            // GO TO PORTFOLIO
            // ------------------------------------------

            setTimeout(
                function () {

                    window.location.href =
                        "portfolio.html";

                },
                500
            );

        }
    );

}


// ======================================================
// RESET BUTTON STATE
// ======================================================
//
// This is important when the browser comes back
// to templates.html using back navigation.
//

window.addEventListener(
    "pageshow",
    function () {

        if (generateButton) {

            generateButton.disabled =
                false;


            generateButton.innerHTML = `
                Create my portfolio
                <span>→</span>
            `;

        }


        console.log(
            "🔄 Template page state restored."
        );

    }
);


// ======================================================
// DONE
// ======================================================

console.log(
    "✅ Template selection ready."
);
