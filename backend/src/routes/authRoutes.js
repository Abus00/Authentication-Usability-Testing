const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/email-password", authController.emailPasswordLogin);
router.post("/email-only", authController.emailOnlyLogin);
router.post("/verify-email", authController.verifyEmailCode);

module.exports = router;