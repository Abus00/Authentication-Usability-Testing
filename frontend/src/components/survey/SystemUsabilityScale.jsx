import React, { useState } from "react";

const SystemUsabilityScale = ({ onNext, onBack }) => {
  const [responses, setResponses] = useState({});

  const questions = [
    "I think that I would like to use this system frequently.",
    "I found the system unnecessarily complex.",
    "I thought the system was easy to use.",
    "I think that I would need the support of a technical person to be able to use this system.",
    "I found the various functions in this system were well integrated.",
    "I thought there was too much inconsistency in this system.",
    "I would imagine that most people would learn to use this system very quickly.",
    "I found the system very cumbersome to use.",
    "I felt very confident using the system.",
    "I needed to learn a lot of things before I could get going with this system.",
  ];

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

export default SystemUsabilityScale;