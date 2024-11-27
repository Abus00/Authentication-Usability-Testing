import React from "react";

const CalibrationPopUp = ({ message, buttonText, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "300px",
        padding: "20px",
        backgroundColor: "white",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        textAlign: "center",
        zIndex: 1000,
        color: "black", // Set text color to black
      }}
    >
      <h2>Welcome!</h2>
      <p>{message}</p>
      <button
        onClick={onClose}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default CalibrationPopUp;