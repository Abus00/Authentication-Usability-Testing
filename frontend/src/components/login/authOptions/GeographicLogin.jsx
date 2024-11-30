import React, { useState } from 'react';

const GeographicLogin = () => {
  const [location, setLocation] = useState('');
  const [phrase, setPhrase] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle geographic login logic here
    console.log('Location and phrase submitted:', location, phrase);
  };

  return (
    <div>
      <h2>Geographic Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        <label>
          Phrase:
          <input
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default GeographicLogin;