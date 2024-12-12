import React, { useState, useEffect } from "react";
import PersonalInfoForm from "../components/survey/PersonalInfoForm";
import LikertScale from "../components/survey/LikertScale";
import SUSScale from "../components/survey/SystemUsabilityScale";
import NASAScale from "../components/survey/NASAScale";
import { sendSurveyData } from "../utils/api";
import { useLocation } from "react-router-dom";
import '../styles/surveyStyles/SurveyContainer.css';
import '../styles/surveyStyles/OpenEnded.css';

export default function SurveyContainer({ isTrackingEye, eyeTrackingData }) {
  const location = useLocation();
  const { email, timeData, chosen_authentication_method } = location.state;

  console.log("The amount of seconds it took to complete the authentication is: ", timeData);
  console.log("The chosen authentication method is: ", chosen_authentication_method);

  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [surveyData, setSurveyData] = useState({
    personalInfo: {},
    likert: {},
    sus: {},
    nasa: {},
    hasFeedback: false,
    feedback: "",
    isTrackingEye: isTrackingEye,
    eyeTrackingData: eyeTrackingData || [],
    timeData: timeData,
    chosen_authentication_method: chosen_authentication_method,
  });

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
        <div className="personalform-wrapper">
          <PersonalInfoForm onNext={handleNext} email={email} />
        </div>
      )}
      {step === 1 && (
        <div className="questionnaire-wrapper">
          <LikertScale onNext={handleNext} onBack={handleBack} />
        </div>
      )}
      {step === 2 && (
        <div className="questionnaire-wrapper">
          <SUSScale onNext={handleNext} onBack={handleBack} />
        </div>
      )}
      {step === 3 && (
        <div className="questionnaire-wrapper">
          <NASAScale onNext={handleNext} onBack={handleBack} />
        </div>
      )}
      {step === 4 && (
        <div className="open-ended-form">
          <label>
            Additional Feedback (max 255 characters):
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={255}
              placeholder="Enter your feedback here..."
            />
          </label>
          <div className="button-container">
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
            <button className="submit-button" onClick={handleSubmit}>
              Submit Survey
            </button>
          </div>
        </div>
      )}
    </div>
  );
}