const https = require("https");
const fs = require("fs");
const app = require("./app");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 3001;

// Load SSL/TLS certificates
const options = {
  key: fs.readFileSync(path.resolve(__dirname, "../key.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "../cert.pem")),
};

// Create HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});