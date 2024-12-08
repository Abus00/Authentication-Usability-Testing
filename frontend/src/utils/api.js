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
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/data/submit-survey`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    console.log("Sent survey data");
    return response;
};