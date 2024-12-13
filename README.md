# Authentication Usability Testing Application

This application was developed as part of the "Seminar: Cyber-Resilient Systems" course at the Technical University of Munich. It serves as a mock implementation based on the concepts discussed in my seminar paper on usability and authentication.

The application showcases the fundamental principles of usability testing within an authentication context. The primary goal is to enable the comparative evaluation of 
different authentication methods to gather empirical data on user preferences.

## Purpose and Scope

This mock application aims to study the usability and user experience of authentication systems. As of now, the application can only be run on local development. It does not include any data analytics or evaluation.

### Features

- **Comparative Usability Testing**: The application focuses on evaluating and comparing two authentication methods:
  - **Email and Password Login**
  - **Email-Only Login**
- **Usability Metrics**: It integrates both quantitative and qualitative usability measures:
  - Quantitative: Eye-tracking and time-tracking.
  - Qualitative: Likert scales,the System Usability Scale (SUS), and NASATLX.
- **Extensibility**: The application is designed to be easily extended, allowing for the addition of:
  - New authentication methods.
  - Additional usability measures.

### Technical Overview

- **Frontend**: Built using React for its modularity and extensibility.
- **Backend**: Developed with Express.js for server-side logic.
- **Database**: Utilizes SQLite for lightweight local storage.
- **Environment**: Designed for local development using Vite for a streamlined development experience.

---

## Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: [Download here](https://nodejs.org/)
- **npm**: Comes bundled with Node.js
- **OpenSSL**: Pre-installed on most Linux and macOS systems. For Windows, you can install it using [these instructions](https://wiki.openssl.org/index.php/Binaries).

For the Email-Only login, an account for MailTrap, which you can [create here](https://mailtrap.io).

The project is configured for local use only, and thus has specified ports for both backend and frontend.
A change in any of the configurational files therefore requires updates in other files as well.

---

## Backend Setup

### Step 1: Generate a Self-Signed Certificate

The backend requires HTTPS to run properly. To set up a local HTTPS server, generate a self-signed certificate using OpenSSL:

#### Commands

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

After renaming, update the .env file with the required values. The values for MailTrap can be found after clicking on your account under Email Testing --> Inboxes.
**IMPORTANT**: create a _database.db_ file under the backend/src directory.

### Step 3: Install Dependencies

Navigate to the backend/ directory and install all required dependencies:

```bash
cd backend
npm install
```

### Step 4: Run the Backend and seed the database

To start the backend server, navigate to the src/ directory inside backend and run:

```bash
npm start
```

After the backend server has been launched, start a new terminal session and navigate to the backend directory and run:

```bash
node src/seedDatabase.js
```

---

## Frontend Setup

### Step 1: Configure Environment Variables

A sample .env.example file is provided in the frontend/ directory. Rename this file to .env:

```bash
#While in the frontend directory
mv .env.example .env
```

After renaming, update the backend url accordingly.

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
