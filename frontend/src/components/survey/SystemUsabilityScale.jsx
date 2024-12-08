import React, { useState, useEffect } from "react";
import { fetchSUSQuestions } from "../../utils/api";

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

  const handleChange = (question, value) => {
    setResponses({ ...responses, [question]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(responses);
  };

  return (
    <form className="sus-scale-form" onSubmit={handleSubmit}>
      <h2>System Usability Scale (SUS)</h2>
      {questions.map((question, index) => (
        <div key={index} className="question">
          <p>{question.question_text}</p>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name={`question-${index}`}
                value={value}
                onChange={() => handleChange(question.question_text, value)}
                required
              />
              {value}
            </label>
          ))}
        </div>
      ))}
      <button type="button" onClick={onBack}>Back</button>
      <button type="submit">Next</button>
    </form>
  );
};

export default SystemUsabilityScale;