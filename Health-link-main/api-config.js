// api-config.js
const API_BASE_URL = "http://127.0.0.1:5000/api"; // Change this to your live backend URL later

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