export const fetchLikertQuestions = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/likert-questions`);
    const data = await response.json();
    return data.questions;
};

export const fetchSUSQuestions = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sus-questions`);
    const data = await response.json();
    return data.questions;
};

export const fetchNASAQuestions = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/nasa-questions`);
    const data = await response.json();
    return data.questions;
};