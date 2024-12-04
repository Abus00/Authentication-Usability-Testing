# Authentication Usability Testing Application

This application is a mock implementation for testing various authentication methods, including:
- Email and Password login
- Email-only login
- Passkeys (WebAuthn)

The application is built with a React frontend and an Express.js backend using SQLite for local storage.

---

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: [Download here](https://nodejs.org/)
- **npm**: Comes bundled with Node.js
- **OpenSSL**: Pre-installed on most Linux and macOS systems. For Windows, you can install it using [these instructions](https://wiki.openssl.org/index.php/Binaries).

---

## Backend Setup

### Step 1: Generate a Self-Signed Certificate
The backend requires HTTPS to run properly. To set up a local HTTPS server, generate a self-signed certificate using OpenSSL:

#### Commands:
Run the following commands in the terminal while inside the `backend/` directory:

```bash
# Navigate to the backend directory
cd backend

# Generate a private key
openssl genrsa -out key.pem 2048

# Generate a certificate signing request (CSR)
openssl req -new -key key.pem -out csr.pem

# Generate a self-signed certificate
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```
You need to add the vite-cert.pem to your systems trusted certificates.

### Step 2: Configure Environment Variables

A sample .env.example file is provided in the backend/ directory. Rename this file to .env:

```bash
#While in the backend directory
mv .env.example .env
```

After renaming, update the .env file with the required values.
Make sure to replace the JWT secret.

### Step 3: Install Dependencies
Navigate to the backend/ directory and install all required dependencies:

```bash
cd backend
npm install
```

### Step 4: Run the Backend
To start the backend server, navigate to the src/ directory inside backend and run:

```bash
cd src
node index.js
```

## Frontend Setup 

### Step 1: Configure Environment Variables

A sample .env.example file is provided in the frontend/ directory. Rename this file to .env:

```bash
#While in the frontend directory
mv .env.example .env
```

After renaming, update the backend url.

### Step 2: Generate a Self-Signed Certificate for Frontend
To set up HTTPS for the frontend, generate a self-signed certificate using OpenSSL. 

#### Commands
```bash
# Navigate to the frontend directory
cd frontend

# Generate a private key
openssl genrsa -out vite-key.pem 2048

# Generate a certificate signing request (CSR)
openssl req -new -key vite-key.pem -out vite-csr.pem

# Generate a self-signed certificate
openssl x509 -req -days 365 -in vite-csr.pem -signkey vite-key.pem -out vite-cert.pem
```

You need to add the vite-cert.pem to your systems trusted certificates.

### Step 3: Install Dependencies
Navigate to the frontend/ directory and install all required dependencies:
```bash
cd frontend
npm install
```

### Step 4: Run the Frontend
Start the React development server:

```bash 
npm run dev
```

