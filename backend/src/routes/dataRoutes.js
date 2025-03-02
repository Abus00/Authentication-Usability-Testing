const express = require("express");
const dataController = require("../controllers/dataController");
const router = express.Router();

router.get("/likert-questions", dataController.getLikertQuestions);
router.get("/sus-questions", dataController.getSUSQuestions);
router.get("/nasa-questions", dataController.getNASAQuestions);
router.post("/submit-survey", dataController.submitSurveyData);

module.exports = router;