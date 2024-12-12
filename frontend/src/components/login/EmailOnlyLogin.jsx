import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import '../../styles/loginStyles/EmailOnlyLogin.css'; 

const EmailOnlyLogin = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = performance.now();
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/email-only`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailAddress: email}), 
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error('Failed to send verification code to email: ' + errorMessage.message);
      }

      setCodeSent(true);
      console.log('Verification code sent to email:', email);
    } catch (err) {
      setError(err.message);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode}),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error('Verification failed with error: ' + errorMessage.message);
      }

      const data = await response.json();
      console.log('Verification successful:', data);
      localStorage.setItem('token', data.token);

      const endTime = performance.now();
      const timeTakenSeconds = (endTime - startTimeRef.current) / 1000;
      let auth_method = "emailOnly";

      navigate('/survey', { state: { email, timeData: timeTakenSeconds, chosen_authentication_method: auth_method } });
    } catch (err) {
      setError(err.message);
      setVerificationCode('');
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = validator.isEmail(email);
  const isCodeValid = verificationCode.length === 6;

  return (
    <div className="email-only-login-container">
      <h2>Email Only Login</h2>
      {!codeSent ? (
        <form onSubmit={handleEmailSubmit} className="email-only-login-form">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-only-login-input"
            placeholder="Enter your email"
          />
          <button
            type="submit"
            disabled={!isEmailValid || loading}
            className="submit-button"
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} className="email-only-login-form">
          <label htmlFor="verificationCode">Verification Code:</label>
          <input
            id="verificationCode"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            className="email-only-login-input"
            placeholder="Enter the verification code"
          />
          <button
            type="submit"
            disabled={!isCodeValid || loading}
            className="submit-button"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default EmailOnlyLogin;