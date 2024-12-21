import React, { useState, useEffect } from "react";
import EmailOnlyLogin from "../components/login/EmailOnlyLogin";
import EmailPasswordLogin from "../components/login/EmailPasswordLogin";
import "../styles/loginStyles/LoginPage.css";

export default function LoginPage({ isTrackingEye, setIsTrackingEye, setEyeTrackingData }) {
  const [choseLoginDisplay, setChoseLoginDisplay] = useState(true);
  const [chosenOption, setChosenOption] = useState(null);
  const [loginOptions, setLoginOptions] = useState(null);
  const [preferredAgainst, setPreferredAgainst] = useState(null);

  // This array contains the authentication methods that the user can choose from
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
              // Within this block, it is possible to add a event listener that tracks mouse movement
              // Through this, we can compare the mouse movement with the eye tracking data
              // Adding the data extraction within here ensures that the data is timely and accurate

              // Debug statement
              // console.log(`Gaze prediction: x=${data.x}, y=${data.y}`);
            })
            .showVideo(false)
            .showFaceOverlay(false)
            .showPredictionPoints(false)
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


  // This fucntion is used to set the authentication method the user chose as the chosen option, which will then be displayed on the screen
  // Thus the swtich case must be extended if a new authentication method is added to the options array
  const optionToChoice = (option, preferredAgainst) => {
    switch (option) {
      case "emailOnly":
        setChosenOption(<EmailOnlyLogin preferredAgainst={preferredAgainst} />);
        break;
      case "emailPassword":
        setChosenOption(<EmailPasswordLogin preferredAgainst={preferredAgainst} />);
        break;
      default:
        setChosenOption(null);
    }
  };


  // If a new authentication method is added to the options array, the choiceToDescriptionText function must be updated,
  // so that the user can see the description of the new authentication method easily. 
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
    const preferredAgainstOption = loginOptions.find((opt) => opt !== option);
    setPreferredAgainst(preferredAgainstOption);
    optionToChoice(option, preferredAgainstOption);
    setChoseLoginDisplay(false);
  };


  // This function is used to display the two authentication methods that the user can choose from
  // As there are currently only two options, the function is hardcoded to display two options
  // If more options are added, the function must be updated to display the new options
  // It is advisable to use a random number generator to select the options, as this will make sure that no bias is present in the selection
  // If there should be static comparisons between selected authentication methods, the function needs to be updated to reflect this
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