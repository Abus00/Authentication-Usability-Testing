import React, { useState, useEffect, useRef } from 'react';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import '../../styles/loginStyles/EmailPasswordLogin.css'; 

const EmailPasswordLogin = ({ preferredAgainst }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = performance.now();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/email-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailAddress: email,
          userPassword: password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error('Login failed: ' + errorMessage.message);
      }

      const data = await response.json();
      console.log('Login successful:', data);
      localStorage.setItem('token', data.token);

      const endTime = performance.now();
      const timeTakenSeconds = (endTime - startTimeRef.current) / 1000;
      console.log('Time taken to login within EmailPassword Component:', timeTakenSeconds);
      let auth_method = "emailPassword";

      navigate('/survey', { state: { email, timeData: timeTakenSeconds, chosen_authentication_method: auth_method, preferredAgainst } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = validator.isEmail(email);
  const isFormValid = isEmailValid && password;

  return (
    <div className="email-password-login-container">
      <h2>Email and Password Login</h2>
      <form onSubmit={handleSubmit} className="email-password-login-form">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="email-password-login-input"
          placeholder="example.email@gmail.com"
        />
        <label htmlFor="password">Password:</label>
        <div className="password-container">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="email-password-login-input password-input"
            placeholder="Enter your very strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-button"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="submit-button"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default EmailPasswordLogin;