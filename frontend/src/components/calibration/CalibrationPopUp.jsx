import React from "react";
import "../../styles/calibrationStyles/CalibrationPopUp.css"; 

const CalibrationPopUp = ({ topmessage, message, buttonText, onClose }) => {
  return (
    <div className="calibration-popup">
      <h2>{topmessage}</h2>
      <p>{message}</p>
      <button onClick={onClose} className="popup-button">
        {buttonText}
      </button>
    </div>
  );
};

export default CalibrationPopUp;