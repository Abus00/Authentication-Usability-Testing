import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalibrationSquare from "./CalibrationSquare";
import CalibrationPopUp from "./CalibrationPopUp";
import "../../styles/CalibrationPage.css";

export default function CalibrationPage({ setIsTrackingEye }) {
  const [showPopup, setShowPopup] = useState(true);
  const [webgazerEnded, setWebgazerEnded] = useState(false);
  const [calibrationCounts, setCalibrationCounts] = useState(Array(16).fill(0));
  const [allCalibrated, setAllCalibrated] = useState(false);
  const navigate = useNavigate();

  const calibrationPoints = [
    { x: "50%", y: "20%" }, // Top-middle-left
    { x: "90%", y: "20%" }, // Top-right
    { x: "10%", y: "50%" }, // Middle-left
    { x: "50%", y: "50%" }, // Center (unchanged)
    { x: "90%", y: "50%" }, // Middle-right
    { x: "10%", y: "80%" }, // Bottom-left
    { x: "50%", y: "80%" }, // Bottom-middle
    { x: "90%", y: "80%" }, // Bottom-right
    { x: "30%", y: "35%" }, // New column 1, row 1.5
    { x: "30%", y: "65%" }, // New column 1, row 2.5
    { x: "70%", y: "35%" }, // New column 2, row 1.5
    { x: "70%", y: "65%" }, // New column 2, row 2.5
    { x: "70%", y: "5%" },  // New column 1, row 2
    { x: "30%", y: "5%" },  // New column 2, row 2
    { x: "30%", y: "90%" }, // New column 3, row 1
    { x: "70%", y: "90%" }, // New column 4, row 1
  ];

  useEffect(() => {
    // Initialize WebGazer when the popup is closed
    if (!showPopup) {
      try {
        window.webgazer
          .showPredictionPoints(true)
          .showVideo(true)
          .showFaceOverlay(true)
          .begin();

        // Configure WebGazer video styles
        const video = document.querySelector("#webgazerVideoFeed");
        if (video) {
          video.style.userSelect = "none";
          video.style.pointerEvents = "none";
          video.style.position = "absolute";
          video.style.top = "10px";
          video.style.left = "10px";
          video.style.zIndex = "10";
        }
      } catch (error) {
        console.error("Error initializing WebGazer:", error);
      }
    }

    // Cleanup WebGazer on unmount
    const handleBeforeUnload = () => {
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

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (window.webgazer && !webgazerEnded) {
        try {
          window.webgazer.pause(); // Use pause instead of end for routing to login page
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
          message="Please click on each red box 4 times, until it goes from red to green! Make sure to always look to where your mouse is pointing, so that the calibration is accurate."
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