// api-config.js
const API_BASE_URL = "https://healthlink-backend-n1hw.onrender.com"; // Your live backend URL later
// Helper function for making authenticated requests
async function fetchFromAPI(endpoint, options = {}) {
    const token = localStorage.getItem("authToken");
    
    const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    return response;
}