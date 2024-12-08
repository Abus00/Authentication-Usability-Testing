import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';

import HelloPage from "./pages/HelloPage";
import CalibrationPage from "./pages/CalibrationPage";
import LoginPage from "./pages/LoginPage";
import SurveyContainer from "./pages/SurveyContainer";


import './App.css'

function App() {
  
  const [isTrackingEye, setIsTrackingEye] = useState(false);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HelloPage setIsTrackingEye={setIsTrackingEye} />} />
          <Route path="/calibration" element={<CalibrationPage setIsTrackingEye={setIsTrackingEye} />} />
          <Route path="/login" element={<LoginPage isTrackingEye={isTrackingEye} setIsTrackingEye={setIsTrackingEye}/>} />
          <Route path="/survey" element={<SurveyContainer isTrackingEye={isTrackingEye} />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
