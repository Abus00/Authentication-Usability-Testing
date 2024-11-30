import React, { useState } from 'react';

const EmailOnlyLogin = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email-only login logic here
    console.log('Email submitted:', email);
  };

  return (
    <div>
      <h2>Email Only Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default EmailOnlyLogin;