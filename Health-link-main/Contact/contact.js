document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("contact-name").value;
        const email = document.getElementById("contact-email").value;
        const message = document.getElementById("contact-message").value;

        try {
            const response = await fetchFromAPI("/contact", {
                method: "POST",
                body: JSON.stringify({ name, email, message })
            });

            if (response.ok) {
                alert("Message sent successfully! We will get back to you soon.");
                contactForm.reset(); // Clear the form
            } else {
                alert("Failed to send message. Please try again later.");
            }
        } catch (error) {
            console.error("Contact form error:", error);
            alert("Could not connect to the server.");
        }
    });
});