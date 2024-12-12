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
    db.run("BEGIN TRANSACTION");

    const insertSurvey = `
      INSERT INTO survey (user_email, chosen_authentication_method)
      VALUES (?, ?)
    `;
    db.run(insertSurvey, [email, chosen_authentication_method], function(err) {
      if (err) {
        console.error("Error inserting survey:", err.message);
        db.run("ROLLBACK");
        return res.status(500).json({ error: "Failed to insert survey data" });
      }

      const surveyId = this.lastID;

      if (hasFeedback) {
        const insertFeedback = `
          INSERT INTO feedback (survey_id, feedback_text)
          VALUES (?, ?)
        `;
        db.run(insertFeedback, [surveyId, feedback], function(err) {
          if (err) {
            console.error("Error inserting feedback:", err.message);
            db.run("ROLLBACK");
            return res.status(500).json({ error: "Failed to insert feedback" });
          }
        });
      }

      const insertLikertResponse = `
        INSERT INTO likert_responses (survey_id, question_id, response)
        VALUES (?, ?, ?)
      `;
      Object.keys(likert).forEach((questionId) => {
        db.run(insertLikertResponse, [surveyId, questionId, likert[questionId]], function(err) {
          if (err) {
            console.error("Error inserting likert response:", err.message);
            db.run("ROLLBACK");
            return res.status(500).json({ error: "Failed to insert likert response" });
          }
        });
      });

      const insertSUSResponse = `
        INSERT INTO sus_responses (survey_id, question_id, response)
        VALUES (?, ?, ?)
      `;
      Object.keys(sus).forEach((questionId) => {
        db.run(insertSUSResponse, [surveyId, questionId, sus[questionId]], function(err) {
          if (err) {
            console.error("Error inserting sus response:", err.message);
            db.run("ROLLBACK");
            return res.status(500).json({ error: "Failed to insert sus response" });
          }
        });
      });

      const insertNASAResponse = `
        INSERT INTO nasa_responses (survey_id, question_id, response)
        VALUES (?, ?, ?)
      `;
      Object.keys(nasa).forEach((questionId) => {
        db.run(insertNASAResponse, [surveyId, questionId, nasa[questionId]], function(err) {
          if (err) {
            console.error("Error inserting nasa response:", err.message);
            db.run("ROLLBACK");
            return res.status(500).json({ error: "Failed to insert nasa response" });
          }
        });
      });

      if (isTrackingEye) {
        const insertEyeTrackingData = `
          INSERT INTO eye_tracking_data (survey_id, data)
          VALUES (?, ?)
        `;
        db.run(insertEyeTrackingData, [surveyId, eyeTrackingData], function(err) {
          if (err) {
            console.error("Error inserting eye tracking data:", err.message);
            db.run("ROLLBACK");
            return res.status(500).json({ error: "Failed to insert eye tracking data" });
          }
        });
      }

      const insertEyeTrackingData = `
        INSERT INTO eye_tracking_data (survey_id, data)
        VALUES (?, ?)
      `;
        db.run(insertEyeTrackingData, [surveyId, JSON.stringify(eyeTrackingData)], function(err) {
        if (err) {
          console.error("Error inserting eye tracking data:", err.message);
          if (err.message.includes("too large")) {
            db.run("ROLLBACK");
            return res.status(413).json({ error: "Eye tracking data is too large to insert" });
          }
          db.run("ROLLBACK");
          return res.status(500).json({ error: "Failed to insert eye tracking data" });
        }
      });

      db.run("COMMIT", function(err) {
        if (err) {
          console.error("Error committing transaction:", err.message);
          return res.status(500).json({ error: "Failed to commit transaction" });
        }
        console.log("Survey data stored successfully");
        res.status(200).json({ message: "Survey data submitted successfully" });
      });
    });
  });
};