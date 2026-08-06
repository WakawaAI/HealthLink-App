document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault(); 

        // Extract values from the form inputs
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetchFromAPI("/api/register", {
                method: "POST",
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                alert("Registration successful! Please log in.");
                // Redirect to login page after successful registration
                window.location.href = "../Login/Login.html"; 
            } else {
                const errorData = await response.json();
                alert(`Registration failed: ${errorData.message || "Please try again."}`);
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("Could not connect to the server.");
        }
    });
});