import React, { useState, useEffect } from "react";
import { fetchSUSQuestions } from "../../utils/api";
import '../../styles/surveyStyles/Questionnaire.css';

const SystemUsabilityScale = ({ onNext, onBack }) => {
  const [responses, setResponses] = useState({});
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const getQuestions = async () => {
      const questions = await fetchSUSQuestions();
      console.log(questions);
      setQuestions(questions);
    };
    getQuestions();
  }, []);

  const handleChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(responses);
  };

  const descriptions = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

  return (
    <form className="survey-form" onSubmit={handleSubmit}>
      <h2>System Usability Scale (SUS)</h2>
      {questions.map((question) => (
        <div key={question.id} className="question">
          <p>{question.question_text}</p>
          {[1, 2, 3, 4, 5].map((value, index) => (
            <label key={value}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={value}
                onChange={() => handleChange(question.id, value)}
                required
              />
              {value} - {descriptions[index]}
            </label>
          ))}
        </div>
      ))}
      <button type="button" className="back-button" onClick={onBack}>Back</button>
      <button type="submit">Next</button>
    </form>
  );
};

export default SystemUsabilityScale;