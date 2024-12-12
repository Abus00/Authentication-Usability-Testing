import React, { useState, useEffect } from "react";
import EmailOnlyLogin from "../components/login/EmailOnlyLogin";
import EmailPasswordLogin from "../components/login/EmailPasswordLogin";
import "../styles/loginStyles/LoginPage.css";

export default function LoginPage({ isTrackingEye, setIsTrackingEye, setEyeTrackingData }) {
  const [choseLoginDisplay, setChoseLoginDisplay] = useState(true);
  const [chosenOption, setChosenOption] = useState(null);
  const [loginOptions, setLoginOptions] = useState(null); 
  const options = ["emailOnly", "emailPassword"];

  useEffect(() => {
    const initializeWebGazer = async () => {
      if (window.webgazer) {
        try {
          await window.webgazer
            .setGazeListener((data) => {
              if (!data) return;
              setEyeTrackingData((prevData) => [
                ...prevData,
                { x: data.x, y: data.y },
              ]);
              console.log(`Gaze prediction: x=${data.x}, y=${data.y}`);
            })
            .showVideo(false)
            .showFaceOverlay(false)
            .showPredictionPoints(true)
            .begin();
        } catch (error) {
          console.error("Error initializing WebGazer:", error);
        }
      }
    };

    if (isTrackingEye) {
      console.log("Starting eye tracking");
      initializeWebGazer();
    }

    return () => {
      console.log("Cleaning up WebGazer...");
      setIsTrackingEye(false);

      if (window.webgazer) {
        try {
          window.webgazer.end();
          const webgazerVideoContainer = document.getElementById("webgazerVideoContainer");
          const webgazerGazeDot = document.getElementById("webgazerGazeDot");
          if (webgazerVideoContainer) webgazerVideoContainer.remove();
          if (webgazerGazeDot) webgazerGazeDot.remove();
        } catch (error) {
          console.error("Error during WebGazer cleanup:", error);
        }
      }
    };
  }, []);

  useEffect(() => {
    const chooseTwoLoginOptions = () => {
      const randomOption1 = Math.floor(Math.random() * options.length);
      let randomOption2;
      do {
        randomOption2 = Math.floor(Math.random() * options.length);
      } while (randomOption1 === randomOption2);

      return [options[randomOption1], options[randomOption2]];
    };

    setLoginOptions(chooseTwoLoginOptions());
  }, []); 

  const optionToChoice = (option) => {
    switch (option) {
      case "emailOnly":
        setChosenOption(<EmailOnlyLogin />);
        break;
      case "emailPassword":
        setChosenOption(<EmailPasswordLogin />);
        break;
      default:
        setChosenOption(null);
    }
  };

  const choiceToDescriptionText = (option) => {
    switch (option) {
      case "emailOnly":
        return "Login with Email Only. You will receive a verification code via email.";
      case "emailPassword":
        return "Login with Email and Password.";
      default:
        return "No option selected";
    }
  };

  const handleLoginChoice = (option) => {
    optionToChoice(option);
    setChoseLoginDisplay(false);
  };

  const displayTwoLoginOptions = () => {
    if (!loginOptions) return null; 

    const [option1, option2] = loginOptions;

    return (
      <div className="login-options-container">
        <div className="login-option-box" onClick={() => handleLoginChoice(option1)}>
          <h3>{choiceToDescriptionText(option1)}</h3>
        </div>
        <div className="login-option-box" onClick={() => handleLoginChoice(option2)}>
          <h3>{choiceToDescriptionText(option2)}</h3>
        </div>
      </div>
    );
  };

  return (
    <div className="login-page-container">
      {choseLoginDisplay ? (
        <>
          <p className="login-title">Sign in</p>
          <p className="login-instruction">
            To continue, please select one of the authentication processes provided:
          </p>
          {displayTwoLoginOptions()}
        </>
      ) : (
        chosenOption
      )}
    </div>
  );
}