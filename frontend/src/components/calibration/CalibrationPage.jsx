import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalibrationSquare from "./CalibrationSquare";
import CalibrationPopUp from "./CalibrationPopUp";
import "../../styles/calibrationStyles/CalibrationPage.css";

export default function CalibrationPage({ setIsTrackingEye }) {
  const [showPopup, setShowPopup] = useState(true);
  const [webgazerEnded, setWebgazerEnded] = useState(false);
  const [calibrationCounts, setCalibrationCounts] = useState(Array(3).fill(0)); //change this later to 16
  const [allCalibrated, setAllCalibrated] = useState(false);
  const navigate = useNavigate();

  const calibrationPoints = [
    { x: "50%", y: "20%" }, 
    { x: "90%", y: "20%" }, 
    { x: "10%", y: "50%" }, 
/*     { x: "50%", y: "50%" }, 
    { x: "90%", y: "50%" }, 
    { x: "10%", y: "80%" },
    { x: "50%", y: "80%" }, 
    { x: "90%", y: "80%" }, 
    { x: "30%", y: "35%" }, 
    { x: "30%", y: "65%" }, 
    { x: "70%", y: "35%" }, 
    { x: "70%", y: "65%" }, 
    { x: "70%", y: "5%" },  
    { x: "30%", y: "5%" },  
    { x: "30%", y: "90%" }, 
    { x: "70%", y: "90%" },  */
  ];

  useEffect(() => {
    if (!showPopup) {
      try {
        window.webgazer
          .showPredictionPoints(true)
          .showVideo(true)
          .showFaceOverlay(true)
          .begin();
      } catch (error) {
        console.error("Error initializing WebGazer:", error);
      }
    }

    // This is being run when the website is reloaded or the page is closed
    const handleBeforeUnload = () => {
      console.log("USER RELOADED")
      if (window.webgazer && !webgazerEnded) {
        try {
          window.webgazer.end();
          setWebgazerEnded(true);
        } catch (error) {
          console.warn("Error cleaning up WebGazer:", error);
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // This is being run when the user navigates away from the page i.e. to the login page
    return () => {
      console.log("USER NAVIGATES AWAY")
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (window.webgazer && !webgazerEnded) {
        try {
          window.webgazer
          .showPredictionPoints(false)
          .showFaceOverlay(false)
          .showVideo(false)
          .pause(); // Use pause instead of end so that the login page only has to resume
          setWebgazerEnded(true);
        } catch (error) {
          console.warn("Error cleaning up WebGazer:", error);
        }
      }
    };
  }, [showPopup, webgazerEnded]);

  const handleSquareClick = (index) => {
    const newCounts = [...calibrationCounts];
    newCounts[index] += 1;
    setCalibrationCounts(newCounts);

    if (newCounts.every(count => count >= 3)) {
      setAllCalibrated(true);
    }
  };

  const handleProceedToLogin = () => {
    setIsTrackingEye(true);
    navigate("/login");
  };

  return (
    <div className="calibration-page">
      {showPopup && (
        <CalibrationPopUp
          message="Please click on each red box 3 times, until it goes from red to green and has a little check-symbol in it! Make sure to always look to where your mouse is pointing, so that the calibration is accurate."
          buttonText="Yes, Understood"
          onClose={() => setShowPopup(false)}
        />
      )}

      {!showPopup &&
        calibrationPoints.map((point, index) => (
          <CalibrationSquare
            key={index}
            x={point.x}
            y={point.y}
            size="20px"
            onClick={() => handleSquareClick(index)}
          />
        ))}

      {allCalibrated && (
        <CalibrationPopUp
          message="Calibration complete! You can now proceed to the login page."
          buttonText="Proceed to Login"
          onClose={handleProceedToLogin}
        />
      )}
    </div>
  );
}