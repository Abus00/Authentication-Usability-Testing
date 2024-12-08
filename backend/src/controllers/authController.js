const { generateAuthToken } = require("../utils/jwtUtils");
const { sendVerificationEmail } = require("../utils/emailService");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const validator = require("validator");

exports.emailPasswordLogin = async (req, res) => {
    console.log("Received request to login with email and password");
    const { emailAddress: email, userPassword: password } = req.body;

    try {
        const sanitizedEmail = validator.normalizeEmail(email, {gmail_remove_dots: false});
        if (!validator.isEmail(sanitizedEmail)) {
            return res.status(400).json({ message: "Invalid email!" });
        }

        if (
            !validator.isStrongPassword(password, {
                minLength: 10,
                minNumbers: 1,
                minUppercase: 1,
                minSymbols: 1,
            })
        ) {
            return res.status(400).json({
                message:
                    "Password must be at least 10 characters long and include numbers, uppercase letters, and special characters",
            });
        }

        let user = await userModel.findByEmail(sanitizedEmail);

        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            console.log(`Creating user with email ${sanitizedEmail}`);
            user = await userModel.create({
                email: sanitizedEmail,
                password: hashedPassword,
            });

            console.log(`User with email ${sanitizedEmail} created successfully`);
        } else {
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            console.log(`User with email ${sanitizedEmail} logged in successfully`);
        }

        const token = generateAuthToken({ email: user.email });
        return res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.emailOnlyLogin = async (req, res) => {
    console.log("Received request to login with email only");
    const { emailAddress: email } = req.body;

    try {

        const sanitizedEmail = validator.normalizeEmail(email, {gmail_remove_dots: false});
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        const user = await userModel.findByEmail(sanitizedEmail);
        if (!user) {
            await userModel.createEmailOnly(sanitizedEmail);
        }

        await userModel.updateVerificationCode(sanitizedEmail, verificationCode);

        await sendVerificationEmail(sanitizedEmail, verificationCode);

        res.status(200).json({ message: "Verification code sent to your email" });
    } catch (error) {
        console.error("Error in email login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.verifyEmailCode = async (req, res) => {
    console.log("Received request to verify email code");
    const { email, code } = req.body;
    console.log("Email: ", email, "\nCode: ", code);

    try {
        const sanitizedEmail = validator.normalizeEmail(email, {gmail_remove_dots: false});
        const isValid = await userModel.verifyCode(sanitizedEmail, code);
        console.log("The local time is: ", new Date(Date.now()).toISOString());
        console.log("Verification result: ", isValid);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired verification code" });
        }

        const token = generateAuthToken({ email });
        return res.status(200).json({ token, message: "Verification successful" });
    } catch (error) {
        console.error("Error verifying email code:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};