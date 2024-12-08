import React, { useState, useEffect } from "react";
import { fetchNASAQuestions } from "../../utils/api";

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

  const handleChange = (dimension, value) => {
    setResponses({ ...responses, [dimension]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(responses);
  };

  return (
    <form className="nasa-scale-form" onSubmit={handleSubmit}>
      <h2>NASA Task Load Index (NASA-TLX)</h2>
      {questions.map((question, index) => (
        <div key={index} className="dimension">
          <p>{question.question_text}</p>
          {[1, 2, 3, 4, 5, 6, 7].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name={`dimension-${index}`}
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

export default NASAScale;