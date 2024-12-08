const db = require("../utils/db");

exports.getLikertQuestions = (req, res) => {
  db.all("SELECT * FROM likert_questions", [], (err, rows) => {
    if (err) {
      console.error("Error while querying likert questions: ", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ questions: rows });
  });
};

exports.getSUSQuestions = (req, res) => {
  db.all("SELECT * FROM sus_questions", [], (err, rows) => {
    if (err) {
      console.error("Error while querying sus questions: ", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ questions: rows });
  });
};

exports.getNASAQuestions = (req, res) => {
  db.all("SELECT * FROM nasa_questions", [], (err, rows) => {
    if (err) {
      console.error("Error while querying nasa questions: ", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ questions: rows });
  });
};