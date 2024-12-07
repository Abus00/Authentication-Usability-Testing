import React, { useState } from "react";

const LikertScale = ({ onNext, onBack }) => {
  const [responses, setResponses] = useState({});

  const questions = [
    "I found the interface easy to use.",
    "The system was reliable.",
    "I would recommend this system to others.",
  ];

  const handleChange = (question, value) => {
    setResponses({ ...responses, [question]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(responses);
  };

  return (
    <form className="likert-scale-form" onSubmit={handleSubmit}>
      <h2>Likert Scale</h2>
      {questions.map((question, index) => (
        <div key={index} className="question">
          <p>{question}</p>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name={`question-${index}`}
                value={value}
                onChange={() => handleChange(question, value)}
                required
              />
              {value}
            </label>
          ))}
        </div>
      ))}
      <button type="submit">Next</button>
      <button type="button" onClick={onBack}>Back</button>
    </form>
  );
};

export default LikertScale;