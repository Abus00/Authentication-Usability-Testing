import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pageStyles/HelloPage.css';

export default function HelloPage({ setIsTrackingEye }) {
  const navigate = useNavigate();

  const handleClick = (choice) => {
    setIsTrackingEye(choice);
    if (choice) {
      navigate("/calibration");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="hello-page-container">
      <h1>Welcome!</h1>
      <h2>Todays topic? Usability Testing of Authentication Methods</h2>
      <p>
        Before we proceed, do you want to enable eye-tracking? <br />
        We use WebGazer, which is a fully client side eye-tracking feature - you are in full control of your data. <br />
      </p>
      <button onClick={() => handleClick(true)}>Let's track!</button>
      <button onClick={() => handleClick(false)}>Not today :(</button>
    </div>
  );
}