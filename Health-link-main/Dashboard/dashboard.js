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
        // Fetch the logged-in user's profile from your backend route with the bearer token
        const response = await fetchFromAPI("/api/user/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            
            // Dynamically update the username display with data from the backend
            const usernameDisplay = document.getElementById("username-display");
            if (usernameDisplay && userData.username) {
                usernameDisplay.textContent = userData.username;
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