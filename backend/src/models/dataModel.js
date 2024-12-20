const db = require("../utils/db");

const getLikertQuestions = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM likert_questions", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getSUSQuestions = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM sus_questions", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getNASAQuestions = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM nasa_questions", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const insertSurveyData = (surveyData) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {

      console.log("Recieved helpClicked as : ", surveyData.helpClicked);

      db.run("BEGIN TRANSACTION");

      const insertSurvey = `
        INSERT INTO survey (user_email, chosen_authentication_method, preferred_against, help_clicked)
        VALUES (?, ?, ?, ?)
      `;
      db.run(insertSurvey, [surveyData.email, surveyData.chosen_authentication_method, surveyData.preferredAgainst, surveyData.helpClicked ? 1 : 0], function (err) {
        if (err) {
          db.run("ROLLBACK");
          return reject(err);
        }

        const surveyId = this.lastID;

        if (surveyData.hasFeedback) {
          const insertFeedback = `
            INSERT INTO feedback (survey_id, feedback_text)
            VALUES (?, ?)
          `;
          db.run(insertFeedback, [surveyId, surveyData.feedback], function (err) {
            if (err) {
              db.run("ROLLBACK");
              return reject(err);
            }
          });
        }

        const insertLikertResponse = `
          INSERT INTO likert_responses (survey_id, question_id, response)
          VALUES (?, ?, ?)
        `;
        Object.keys(surveyData.likert).forEach((questionId) => {
          db.run(insertLikertResponse, [surveyId, questionId, surveyData.likert[questionId]], function (err) {
            if (err) {
              db.run("ROLLBACK");
              return reject(err);
            }
          });
        });

        const insertSUSResponse = `
          INSERT INTO sus_responses (survey_id, question_id, response)
          VALUES (?, ?, ?)
        `;
        Object.keys(surveyData.sus).forEach((questionId) => {
          db.run(insertSUSResponse, [surveyId, questionId, surveyData.sus[questionId]], function (err) {
            if (err) {
              db.run("ROLLBACK");
              return reject(err);
            }
          });
        });

        const insertNASAResponse = `
          INSERT INTO nasa_responses (survey_id, question_id, response)
          VALUES (?, ?, ?)
        `;
        Object.keys(surveyData.nasa).forEach((questionId) => {
          db.run(insertNASAResponse, [surveyId, questionId, surveyData.nasa[questionId]], function (err) {
            if (err) {
              db.run("ROLLBACK");
              return reject(err);
            }
          });
        });

        const insertTimeTrackingData = `
          INSERT INTO time_tracking_data (survey_id, time_spent)
          VALUES (?, ?)
        `;
        db.run(insertTimeTrackingData, [surveyId, surveyData.timeData], function (err) {
          if (err) {
            db.run("ROLLBACK");
            return reject(err);
          }
        });

        if (surveyData.isTrackingEye) {
          const insertEyeTrackingData = `
            INSERT INTO eye_tracking_data (survey_id, data)
            VALUES (?, ?)
          `;
          db.run(insertEyeTrackingData, [surveyId, JSON.stringify(surveyData.eyeTrackingData)], function (err) {
            if (err) {
              if (err.message.includes("too large")) {
                db.run("ROLLBACK");
                return reject(new Error("Eye tracking data is too large to insert"));
              }
              db.run("ROLLBACK");
              return reject(err);
            }
          });
        }

        db.run("COMMIT", function (err) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  });
};

module.exports = {
  getLikertQuestions,
  getSUSQuestions,
  getNASAQuestions,
  insertSurveyData,
};