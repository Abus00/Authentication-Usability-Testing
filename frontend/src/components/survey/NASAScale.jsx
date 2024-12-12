import React, { useState, useEffect } from "react";
import { fetchNASAQuestions } from "../../utils/api";
import '../../styles/surveyStyles/Questionnaire.css';

const NASAScale = ({ onNext, onBack }) => {
  const [responses, setResponses] = useState({});
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const getQuestions = async () => {
      const questions = await fetchNASAQuestions();
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

  return (
    <form className="survey-form" onSubmit={handleSubmit}>
      <h2>NASA Task Load Index (NASA-TLX)</h2>
      {questions.map((question) => (
        <div key={question.id} className="dimension">
          <p>{question.question_text}</p>
          {[1, 2, 3, 4, 5, 6, 7].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name={`dimension-${question.id}`}
                value={value}
                onChange={() => handleChange(question.id, value)}
                required
              />
              {value}
            </label>
          ))}
        </div>
      ))}
      <button type="button" className="back-button" onClick={onBack}>Back</button>
      <button type="submit">Next</button>
    </form>
  );
};

export default NASAScale;