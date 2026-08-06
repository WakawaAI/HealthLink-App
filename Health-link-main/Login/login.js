// login.js
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form"); // Ensure your <form> has this ID

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); 

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetchFromAPI("/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                // Store the token securely in the browser
                localStorage.setItem("authToken", data.token);
                
                // Redirect the user to the dashboard
                window.location.href = "../Dashboard/Dashboard.html";
            } else {
                alert("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
            alert("Could not connect to the server.");
        }
    });
});