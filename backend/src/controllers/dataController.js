const db = require("../utils/db");

exports.getLikertQuestions = (req, res) => {
  console.log("Recieved request to get likert questions");
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
  console.log("Recieved request to get sus questions");
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
  console.log("Recieved request to get nasa questions");
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