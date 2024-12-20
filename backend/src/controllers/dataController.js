const { getLikertQuestions, getSUSQuestions, getNASAQuestions, insertSurveyData } = require("../models/dataModel");
const { verifyAuthToken } = require("../utils/jwtUtils");
const { update } = require("../models/userModel");

exports.getLikertQuestions = async (req, res) => {
  console.log("Received request to get likert questions");
  try {
    const questions = await getLikertQuestions();
    res.json({ questions });
    console.log("Sent likert questions");
  } catch (err) {
    console.error("Error while querying likert questions: ", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getSUSQuestions = async (req, res) => {
  console.log("Received request to get sus questions");
  try {
    const questions = await getSUSQuestions();
    res.json({ questions });
    console.log("Sent sus questions");
  } catch (err) {
    console.error("Error while querying sus questions: ", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getNASAQuestions = async (req, res) => {
  console.log("Received request to get nasa questions");
  try {
    const questions = await getNASAQuestions();
    res.json({ questions });
    console.log("Sent nasa questions");
  } catch (err) {
    console.error("Error while querying nasa questions: ", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.submitSurveyData = async (req, res) => {
  console.log("-----------------------------");
  console.log("Received request to submit survey data");
  console.log("Request headers: ", req.headers);

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  console.log("Received token:", token);

  let decoded;
  try {
    decoded = verifyAuthToken(token);
  } catch (err) {
    console.error("Error verifying token:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }

  const tokenEmail = decoded.email;

  const { personalInfo, likert, sus, nasa, hasFeedback, feedback, isTrackingEye, eyeTrackingData, timeData, chosen_authentication_method, preferredAgainst, helpClicked } = req.body;
  const email = personalInfo.email;
  const user = {
    "email": email,
    "name": personalInfo.name,
    "lastname": personalInfo.lastname,
    "sex": personalInfo.gender,
    "age": personalInfo.age,
  }

  console.log("Token email:", tokenEmail);
  console.log("Request email:", email);

  if (tokenEmail !== email) {
    return res.status(403).json({ error: "Forbidden: Email mismatch" });
  }

  console.log("\n-----------------------------");
  console.log("Request data: \n");
  console.log(req.body);
  console.log("-----------------------------\n");

  try {

    console.log("Updating user data...");
    await update(user);
    console.log("User data updated successfully");

    console.log("Inserting survey data...");
    await insertSurveyData({
      email,
      chosen_authentication_method,
      preferredAgainst,
      hasFeedback,
      feedback,
      timeData,
      likert,
      sus,
      nasa,
      isTrackingEye,
      eyeTrackingData,
      helpClicked: helpClicked === true 
    });
    console.log("Survey data stored successfully");
    res.status(200).json({ message: "Survey data submitted successfully" });
  } catch (err) {
    console.error("Error inserting survey data:", err.message);
    res.status(500).json({ error: "Failed to insert survey data" });
  }
};