import React, { useState, useEffect } from "react";
import { fetchLikertQuestions } from "../../utils/api";

const LikertScale = ({ onNext, onBack }) => {
  const [responses, setResponses] = useState({});
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const getQuestions = async () => {
      const questions = await fetchLikertQuestions();
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
    <form className="likert-scale-form" onSubmit={handleSubmit}>
      <h2>Likert Scale</h2>
      {questions.map((question) => (
        <div key={question.id} className="question">
          <p>{question.question_text}</p>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={value}
                onChange={() => handleChange(question.id, value)}
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

export default LikertScale;