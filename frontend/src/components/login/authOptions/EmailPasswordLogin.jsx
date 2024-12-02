import React, { useState } from 'react';
import '../../../styles/loginStyles/EmailPasswordLogin.css'; // Import the CSS file

const EmailPasswordLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
          firstName: name,
          lastName: lastname,
          gender: sex,
          userAge: age,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      localStorage.setItem('token', data.token);

    } catch (err) {
      setError(err.message);
      setEmail('');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = email.includes('@') && email.includes('.');
  const isFormValid = isEmailValid && password && name && lastname && sex && age;

  return (
    <div className="email-password-login-container">
      <h2>Email and Password Login</h2>
      <form onSubmit={handleSubmit} className="email-password-login-form">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="email-password-login-input"
          placeholder="Enter your name"
        />
        <label htmlFor="lastname">Lastname:</label>
        <input
          id="lastname"
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
          className="email-password-login-input"
          placeholder="Enter your lastname"
        />
        <label htmlFor="sex">Sex:</label>
        <select
          id="sex"
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          required
          className="email-password-login-input"
        >
          <option value="">Select your sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <label htmlFor="age">Age:</label>
        <input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          className="email-password-login-input"
          placeholder="Enter your age"
        />
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="email-password-login-input"
          placeholder="Enter your email"
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
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-button"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          <div className="tooltip">
            <span className="tooltip-icon">i</span>
            <span className="tooltip-text">
              Password must be 10 characters long, contain a number, special character, and uppercase letter
            </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="submit-button"
        >
          {loading ? 'Logging in...' : (isFormValid ? 'Login' : 'Enter Email and Password')}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default EmailPasswordLogin;