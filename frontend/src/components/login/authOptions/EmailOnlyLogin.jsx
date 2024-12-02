import React, { useState } from 'react';
import validator from 'validator';
import '../../../styles/loginStyles/EmailOnlyLogin.css'; // Import the CSS file

const EmailOnlyLogin = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const sanitizedEmail = validator.normalizeEmail(email);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/email-only`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: sanitizedEmail }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Store JWT token in local storage
      localStorage.setItem('token', data.token);

      // Handle successful login (e.g., redirect to dashboard)
    } catch (err) {
      setError(err.message);
      // Reset email field on login failure
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = validator.isEmail(email);

  return (
    <div className="email-only-login-container">
      <h2>Email Only Login</h2>
      <form onSubmit={handleSubmit} className="email-only-login-form">
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default EmailOnlyLogin;