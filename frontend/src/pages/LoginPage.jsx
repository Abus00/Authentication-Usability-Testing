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
        return "Email Only Login. This option requires you to enter your email address only. Afterwards you will receive an email with a code to login.";
      case "emailPassword":
        return "The classical Email and Password Login";
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
        <button onClick={() => handleLoginChoice(option1)} className="login-option-button">
          {choiceToDescriptionText(option1)}
        </button>
        <button onClick={() => handleLoginChoice(option2)} className="login-option-button">
          {choiceToDescriptionText(option2)}
        </button>
      </div>
    );
  };

  return (
    <div className="login-page-container">
      {choseLoginDisplay ? (
        <>
          <p className="login-title">Login Page</p>
          <p className="login-instruction">
            To continue, please select one of the authentication processes provided
          </p>
          {displayTwoLoginOptions()}
        </>
      ) : (
        chosenOption
      )}
    </div>
  );
}