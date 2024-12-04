const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config(); // This needs to be loaded here again, as there seems to be a bug with dotenv when using it in multiple files
// more specifically, when hardcoding the mailtrap credentials, the code below will work perfectly, but otherwise, whitout the dotenv.config() it will not work
// i couldnt figure out why. I spent hours trying to understand what is even going on.

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendVerificationEmail = async (email, token) => {
    const mailOptions = {
        from: '"Mock Authentication" <no-reply@mockauth.com>',
        to: email,
        subject: 'Verify your email address',
        text: `Your verification code is: ${token}`,
        html: `<p>Your verification code is: <b>${token}</b></p>`,
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to ' + email);
    } catch (err) {
        console.error('Error sending verification email:', err);
    }
};

module.exports = { sendVerificationEmail };