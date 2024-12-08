import React, { useState, useEffect } from "react";
import PersonalInfoForm from "../components/survey/PersonalInfoForm";
import LikertScale from "../components/survey/LikertScale";
import SUSScale from "../components/survey/SystemUsabilityScale";
import NASAScale from "../components/survey/NASAScale";
import { sendSurveyData } from "../utils/api";

export default function SurveyContainer({ isTrackingEye, email }) {
  const [step, setStep] = useState(0);
  const [surveyData, setSurveyData] = useState({
    personalInfo: {},
    likert: {},
    sus: {},
    nasa: {},
    isTrackingEye: isTrackingEye,
    eyeTrackingData: {},
    feedback: "",
    hasFeedback: false,
  });
  const [feedback, setFeedback] = useState("");

  const handleNext = (formData) => {
    const updatedData = { ...surveyData };
    if (step === 0) updatedData.personalInfo = formData;
    else if (step === 1) updatedData.likert = formData;
    else if (step === 2) updatedData.sus = formData;
    else if (step === 3) updatedData.nasa = formData;

    setSurveyData(updatedData);
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    const updatedData = { ...surveyData, feedback, hasFeedback: feedback.length > 0 };
    console.log("DEBUG: Survey Data to Send:", updatedData);
    try {
      await sendSurveyData(updatedData);
      alert("Survey submitted!");
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Failed to submit survey.");
    }
  };

  return (
    <div className="survey-container">
      {step === 0 && (
        <div className="form-wrapper">
          <PersonalInfoForm onNext={handleNext} email={email} />
        </div>
      )}
      {step === 1 && (
        <div className="form-wrapper">
          <LikertScale onNext={handleNext} onBack={handleBack} />
        </div>
      )}
      {step === 2 && (
        <div className="form-wrapper">
          <SUSScale onNext={handleNext} onBack={handleBack} />
        </div>
      )}
      {step === 3 && (
        <div className="form-wrapper">
          <NASAScale onNext={handleNext} onBack={handleBack} />
        </div>
      )}
      {step === 4 && (
        <div className="form-wrapper">
          <label>
            Additional Feedback (max 255 characters):
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={255}
              placeholder="Enter your feedback here..."
            />
          </label>
          <button className="submit-button" onClick={handleSubmit}>
            Submit Survey
          </button>
          <button className="back-button" onClick={handleBack}>
            Back
          </button>
        </div>
      )}
    </div>
  );
}