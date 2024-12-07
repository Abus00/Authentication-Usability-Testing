import React, { useState } from "react";

const NASAScale = ({ onNext, onBack }) => {
  const [responses, setResponses] = useState({});

  const dimensions = [
    "Mental Demand",
    "Physical Demand",
    "Temporal Demand",
    "Performance",
    "Effort",
    "Frustration",
  ];

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
      {dimensions.map((dimension, index) => (
        <div key={index} className="dimension">
          <p>{dimension}</p>
          {[1, 2, 3, 4, 5, 6, 7].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name={`dimension-${index}`}
                value={value}
                onChange={() => handleChange(dimension, value)}
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

export default NASAScale;