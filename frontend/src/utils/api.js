export const fetchLikertQuestions = async () => {
    console.log("Fetching likert questions ...");
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/data/likert-questions`);
    const data = await response.json();
    console.log("Fetched likert questions");
    return data.questions;
};

export const fetchSUSQuestions = async () => {
    console.log("Fetching SUS questions ...");
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/data/sus-questions`);
    const data = await response.json();
    console.log("Fetched SUS questions");
    return data.questions;
};

export const fetchNASAQuestions = async () => {
    console.log("Fetching NASA questions ...");
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/data/nasa-questions`);
    const data = await response.json();
    console.log("Fetched NASA questions");
    return data.questions;
};

export const sendSurveyData = async (data) => {
    console.log("Sending survey data ...");

    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No authentication token found. Please log in.");
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/data/submit-survey`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to submit survey: ${errorDetails.message || response.statusText}`);
    }

    console.log("Sent survey data successfully");
    return response.json();
};