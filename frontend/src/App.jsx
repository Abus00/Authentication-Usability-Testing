import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import localforage from 'localforage';

import HelloPage from "./pages/HelloPage";
import CalibrationPage from "./pages/CalibrationPage";
import LoginPage from "./pages/LoginPage";
import SurveyContainer from "./pages/SurveyContainer";

import './App.css';

function App() {
  const [isTrackingEye, setIsTrackingEye] = useState(false);
  const [eyeTrackingData, setEyeTrackingData] = useState([]);

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    localforage.clear().then(() => {
      console.log('LocalForage data has been cleared.');
    }).catch((err) => {
      console.error('Error clearing LocalForage data:', err);
    });
    
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name] = cookie.split("=");
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HelloPage setIsTrackingEye={setIsTrackingEye} />} />
          <Route path="/calibration" element={<CalibrationPage setIsTrackingEye={setIsTrackingEye} />} />
          <Route path="/login" element={<LoginPage isTrackingEye={isTrackingEye} setIsTrackingEye={setIsTrackingEye} setEyeTrackingData={setEyeTrackingData} />} />
          <Route path="/survey" element={<SurveyContainer isTrackingEye={isTrackingEye} eyeTrackingData={eyeTrackingData} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;