document.addEventListener("DOMContentLoaded", async () => {
    const doctorDropdown = document.getElementById("doctor-select");
    const appointmentForm = document.getElementById("appointment-form");

    // 1. GET Request: Fetch available doctors for the dropdown
    try {
        const response = await fetchFromAPI("/doctors", { method: "GET" });
        
        if (response.ok) {
            const doctors = await response.json();
            
            // Clear default loading text
            doctorDropdown.innerHTML = '<option value="">Select a Doctor</option>';
            
            // Populate the dropdown menu
            doctors.forEach(doctor => {
                const option = document.createElement("option");
                option.value = doctor.id; // The database ID goes to the backend
                option.textContent = `Dr. ${doctor.last_name} - ${doctor.specialty}`; // What the user sees
                doctorDropdown.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Failed to load doctors:", error);
        doctorDropdown.innerHTML = '<option value="">Error loading doctors</option>';
    }

    // 2. POST Request: Submit the appointment scheduling form
    appointmentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const doctorId = doctorDropdown.value;
        const date = document.getElementById("appointment-date").value;
        const reason = document.getElementById("reason").value;

        try {
            const response = await fetchFromAPI("/appointments", {
                method: "POST",
                body: JSON.stringify({ doctorId, date, reason })
            });

            if (response.ok) {
                alert("Appointment scheduled successfully!");
                appointmentForm.reset(); // Clear the form
            } else {
                alert("Failed to schedule appointment. Please try again.");
            }
        } catch (error) {
            console.error("Appointment error:", error);
            alert("Could not connect to the server.");
        }
    });
});