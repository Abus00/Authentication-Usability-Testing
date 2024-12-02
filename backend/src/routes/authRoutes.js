const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/email-password", authController.emailPasswordLogin);

module.exports = router;