const db = require("../utils/db");

exports.getLikertQuestions = (req, res) => {
  console.log("Received request to get likert questions");
  db.all("SELECT * FROM likert_questions", [], (err, rows) => {
    if (err) {
      console.error("Error while querying likert questions: ", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ questions: rows });
  });
  console.log("Sent likert questions");
};

exports.getSUSQuestions = (req, res) => {
  console.log("Received request to get sus questions");
  db.all("SELECT * FROM sus_questions", [], (err, rows) => {
    if (err) {
      console.error("Error while querying sus questions: ", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ questions: rows });
  });
  console.log("Sent sus questions");
};

exports.getNASAQuestions = (req, res) => {
  console.log("Received request to get nasa questions");
  db.all("SELECT * FROM nasa_questions", [], (err, rows) => {
    if (err) {
      console.error("Error while querying nasa questions: ", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ questions: rows });
  });
  console.log("Sent nasa questions");
};

exports.submitSurveyData = (req, res) => {
  const { personalInfo, likert, sus, nasa, hasFeedback, feedback, isTrackingEye, eyeTrackingData, timeData, chosen_authentication_method } = req.body;
  const email = personalInfo.email;
  console.log("\n-----------------------------");
  console.log("The received data looks like this: ");
  console.log("Chosen Authentication Method: ", chosen_authentication_method);
  console.log("Personal Info: ", personalInfo);
  console.log("Email: ", email);
  console.log("Likert: ", likert);
  console.log("SUS: ", sus);
  console.log("NASA: ", nasa);
  console.log("Has Feedback: ", hasFeedback);
  console.log("Feedback: ", feedback);
  console.log("Is Tracking Eye: ", isTrackingEye);
  console.log("Eye Tracking Data: ", eyeTrackingData);
  console.log("Time Data: ", timeData);
  console.log("-----------------------------\n");

  db.serialize(() => {
    const insertSurvey = `
      INSERT INTO survey (user_email, chosen_authentication_method)
      VALUES (?, ?)
    `;
    db.run(insertSurvey, [email, chosen_authentication_method], function(err) {
      if (err) {
        console.error("Error inserting survey:", err.message);
        res.status(500).json({ error: err.message });
        return;
      }

      const surveyId = this.lastID;

      if (hasFeedback) {
        const insertFeedback = `
          INSERT INTO feedback (survey_id, feedback_text)
          VALUES (?, ?)
        `;
        db.run(insertFeedback, [surveyId, feedback], (err) => {
          if (err) {
            console.error("Error inserting feedback:", err.message);
            res.status(500).json({ error: err.message });
            return;
          }
        });
      }

      const insertLikertResponse = `
        INSERT INTO likert_responses (survey_id, question_id, response)
        VALUES (?, ?, ?)
      `;
      Object.keys(likert).forEach((questionId) => {
        db.run(insertLikertResponse, [surveyId, questionId, likert[questionId]], (err) => {
          if (err) {
            console.error("Error inserting likert response:", err.message);
            res.status(500).json({ error: err.message });
            return;
          }
        });
      });

      const insertSUSResponse = `
        INSERT INTO sus_responses (survey_id, question_id, response)
        VALUES (?, ?, ?)
      `;
      Object.keys(sus).forEach((questionId) => {
        db.run(insertSUSResponse, [surveyId, questionId, sus[questionId]], (err) => {
          if (err) {
            console.error("Error inserting sus response:", err.message);
            res.status(500).json({ error: err.message });
            return;
          }
        });
      });

      const insertNASAResponse = `
        INSERT INTO nasa_responses (survey_id, question_id, response)
        VALUES (?, ?, ?)
      `;
      Object.keys(nasa).forEach((questionId) => {
        db.run(insertNASAResponse, [surveyId, questionId, nasa[questionId]], (err) => {
          if (err) {
            console.error("Error inserting nasa response:", err.message);
            res.status(500).json({ error: err.message });
            return;
          }
        });
      });

      if (isTrackingEye) {
        const insertEyeTrackingData = `
          INSERT INTO eye_tracking_data (survey_id, data)
          VALUES (?, ?)
        `;
        db.run(insertEyeTrackingData, [surveyId, eyeTrackingData], (err) => {
          if (err) {
            console.error("Error inserting eye tracking data:", err.message);
            res.status(500).json({ error: err.message });
            return;
          }
        });
      }

      const insertTimeTrackingData = `
        INSERT INTO time_tracking_data (survey_id, time_spent)
        VALUES (?, ?)
      `;
      db.run(insertTimeTrackingData, [surveyId, timeData], (err) => {
        if (err) {
          console.error("Error inserting time tracking data:", err.message);
          res.status(500).json({ error: err.message });
          return;
        }
      });

      console.log("Survey data stored successfully");
      res.status(200).json({ message: "Survey data submitted successfully" });
    });
  });
};