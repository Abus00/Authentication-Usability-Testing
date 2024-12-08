const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");

const app = express();

app.use(cors({
  origin: 'https://localhost:3000', //frontend url um cors für diese url zu erlauben
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/data", dataRoutes);

module.exports = app;