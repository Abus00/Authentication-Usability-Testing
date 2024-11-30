import React from 'react';

const PasskeyLogin = () => {
  const handleScan = () => {
    // Handle passkey login logic here
    console.log('Passkey scanned');
  };

  return (
    <div>
      <h2>Passkey Login</h2>
      <p>Scan the QR code with your phone to login.</p>
      <button onClick={handleScan}>Scan QR Code</button>
    </div>
  );
};

export default PasskeyLogin;