// dashboard.js
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("authToken");

    // Protect the route: If no token exists, send them back to login
    if (!token) {
        window.location.href = "../Login/Login.html";
        return;
    }

    // Toggle the Navbar Buttons safely
    const loginBtn = document.getElementById("nav-login");
    const registerBtn = document.getElementById("nav-register");
    const logoutBtn = document.getElementById("nav-logout");

    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";
    if (logoutBtn) {
        logoutBtn.style.display = "inline-block";
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("authToken");
            window.location.href = "../Login/Login.html";
        });
    }

    try {
        // Fetch user data from the backend
        const response = await fetchFromAPI("/user/profile", { method: "GET" });

        if (response.ok) {
            const userData = await response.json();
            
            // Inject dynamic data into the HTML
            const usernameDisplay = document.getElementById("username-display");
            if (usernameDisplay) {
                usernameDisplay.innerText = userData.username;
            }
        } else {
            console.error("Failed to fetch user profile, status:", response.status);
            localStorage.removeItem("authToken");
            window.location.href = "../Login/Login.html";
        }
    } catch (error) {
        console.error("Dashboard failed to load data:", error);
    }
});