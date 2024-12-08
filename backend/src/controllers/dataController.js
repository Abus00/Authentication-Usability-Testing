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
  const { personalInfo, likert, sus, nasa, feedback, hasFeedback, email } = req.body;
  console.log("The recieved data looks like this: ");
  console.log("Personal Info: ", personalInfo);
  console.log("Likert: ", likert);
  console.log("SUS: ", sus);
  console.log("NASA: ", nasa);
  console.log("Feedback: ", feedback);
  console.log("Has Feedback: ", hasFeedback);
  console.log("Email: ", email);

  db.serialize(() => {
    const insertFeedback = `
      INSERT INTO feedback (user_email, feedback_text)
      VALUES (?, ?)
    `;
    db.run(insertFeedback, [email, feedback], (err) => {
      if (err) {
        console.error("Error inserting feedback:", err.message);
        res.status(500).json({ error: err.message });
        return;
      }
    });

    const insertLikertResponse = `
      INSERT INTO likert_responses (user_email, question_id, response)
      VALUES (?, ?, ?)
    `;
    Object.keys(likert).forEach((questionId) => {
      db.run(insertLikertResponse, [email, questionId, likert[questionId]], (err) => {
        if (err) {
          console.error("Error inserting likert response:", err.message);
          res.status(500).json({ error: err.message });
          return;
        }
      });
    });

    const insertSUSResponse = `
      INSERT INTO sus_responses (user_email, question_id, response)
      VALUES (?, ?, ?)
    `;
    Object.keys(sus).forEach((questionId) => {
      db.run(insertSUSResponse, [email, questionId, sus[questionId]], (err) => {
        if (err) {
          console.error("Error inserting sus response:", err.message);
          res.status(500).json({ error: err.message });
          return;
        }
      });
    });

    const insertNASAResponse = `
      INSERT INTO nasa_responses (user_email, question_id, response)
      VALUES (?, ?, ?)
    `;
    Object.keys(nasa).forEach((questionId) => {
      db.run(insertNASAResponse, [email, questionId, nasa[questionId]], (err) => {
        if (err) {
          console.error("Error inserting nasa response:", err.message);
          res.status(500).json({ error: err.message });
          return;
        }
      });
    });

    res.status(200).json({ message: "Survey data submitted successfully" });
  });
};