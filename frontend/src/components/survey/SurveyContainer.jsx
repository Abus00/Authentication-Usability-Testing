import React, {useState, useEffect } from "react";
import PersonalInfoForm from "./PersonalInfoForm";
import LikertScale from "./LikertScale";
import SUSScale from "./SystemUsabilityScale";
import NASAScale from "./NASAScale";


export default function SurveyContainer({isTrackingEye, email}) {
    const [step, setStep] = useState(0);
    const [surveyData, setSurveyData] = useState({
        personalInfo: {},
        likert: {},
        sus: {},
        nasa: {},
        eyeTrackingData: {},   
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

      const handleSubmit = () => {
        console.log("DEBUG: Survey Data to Send:", surveyData);
        // Send data to the server (use API function from utils/api.js)
        // api.sendSurveyData(surveyData).then(() => alert("Survey submitted!"));
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