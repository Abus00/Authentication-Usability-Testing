import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalibrationSquare from "../components/calibration/CalibrationSquare";
import CalibrationPopUp from "../components/calibration/CalibrationPopUp";
import "../styles/calibrationStyles/CalibrationPage.css";

export default function CalibrationPage({ setIsTrackingEye }) {
  const [showPopup, setShowPopup] = useState(true);
  const [numberOfCalibrationPoints, setNumberOfCalibrationPoints] = useState(4);
  const [calibrationCounts, setCalibrationCounts] = useState(Array(numberOfCalibrationPoints).fill(0));
  const [allCalibrated, setAllCalibrated] = useState(false);
  const navigate = useNavigate();

  const calibrationPoints = [
    { x: "50%", y: "20%" },
    { x: "90%", y: "20%" },
    { x: "10%", y: "50%" },
    { x: "30%", y: "65%" },
    { x: "70%", y: "35%" },
    { x: "70%", y: "65%" },
    { x: "70%", y: "5%" },
    { x: "30%", y: "5%" },
    { x: "30%", y: "90%" },
    { x: "70%", y: "90%" },
  ].slice(0, numberOfCalibrationPoints);

  const initializeWebGazer = async () => {
    if (window.webgazer) {
      await window.webgazer.setGazeListener((data, elapsedTime) => {
        if (data == null) return;
        console.log(`Gaze prediction: x=${data.x}, y=${data.y}`);
      }).begin();

      window.webgazer
        .showPredictionPoints(true)
        .showVideo(true)
        .showFaceOverlay(true);

      console.log("WebGazer initialized.");
    }
  };

  const cleanUpWebGazer = () => {
    console.log("Cleaning up WebGazer...");
    if (window.webgazer) {
      try {
        window.webgazer.end();

        const webgazerVideoContainer = document.getElementById("webgazerVideoContainer");
        if (webgazerVideoContainer) {
          webgazerVideoContainer.parentNode?.removeChild(webgazerVideoContainer);
        }

        const webgazerGazeDot = document.getElementById("webgazerGazeDot");
        if (webgazerGazeDot) {
          webgazerGazeDot.parentNode?.removeChild(webgazerGazeDot);
        }

        console.log("WebGazer elements cleaned up successfully.");
      } catch (error) {
        console.error("Error during WebGazer cleanup:", error);
      }
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("USER RELOADED");
      cleanUpWebGazer();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      console.log("USER NAVIGATES AWAY");
      window.removeEventListener("beforeunload", handleBeforeUnload);
      cleanUpWebGazer();
    };
  }, []);

  useEffect(() => {
    if (!showPopup) {
      console.log("Popup closed, initializing WebGazer...");
      initializeWebGazer();
    }
  }, [showPopup]);

  useEffect(() => {
    setCalibrationCounts(Array(numberOfCalibrationPoints).fill(0));
  }, [numberOfCalibrationPoints]);

  const handleSquareClick = (index) => {
    const newCounts = [...calibrationCounts];
    newCounts[index] += 1;
    setCalibrationCounts(newCounts);

    if (newCounts.every((count) => count >= 3)) {
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
          topmessage={"What to do?"}
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
          topmessage="Calibration complete! 🎉"
          message="You can now proceed to the login page."
          buttonText="Proceed to Login"
          onClose={handleProceedToLogin}
        />
      )}
    </div>
  );
}