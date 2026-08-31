// ======================================================
// PORTFOLIOAI — AUTHENTICATION
// ======================================================

const savedUser = localStorage.getItem("portfolioUser");

const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

const protectedPages = [
    "dashboard.html",
    "career-dna.html",
    "templates.html",
    "portfolio.html",
    "insights.html",
    "settings.html"
];

// ------------------------------------------------------
// PROTECT PAGES
// ------------------------------------------------------

if (protectedPages.includes(currentPage) && !savedUser) {
    window.location.href = "index.html";
}

// ------------------------------------------------------
// ALREADY LOGGED IN
// ------------------------------------------------------

if (currentPage === "index.html" && savedUser) {
    window.location.href = "dashboard.html";
}

// ------------------------------------------------------
// LOGOUT
// ------------------------------------------------------

function logoutUser() {

    // Only remove login.
    // Do NOT delete resume/Career DNA data.
    localStorage.removeItem("portfolioUser");

    window.location.href = "index.html";
}

window.logoutUser = logoutUser;
const logoutButton = document.getElementById("logoutBtn");

if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
}

// ------------------------------------------------------
// DISPLAY USER
// ------------------------------------------------------

if (savedUser) {

    try {

        const user = JSON.parse(savedUser);

        const userName = user.name || "User";
        const firstLetter =
            userName.charAt(0).toUpperCase();

        const nameElements = document.querySelectorAll(
            "#sidebarUserName, #headerUserName"
        );

        nameElements.forEach(element => {
            element.textContent = userName;
        });

        const avatarElements = document.querySelectorAll(
            "#sidebarAvatar, #headerAvatar"
        );

        avatarElements.forEach(element => {
            element.textContent = firstLetter;
        });

    } catch (error) {

        console.error(
            "Could not load saved user:",
            error
        );

    }
}