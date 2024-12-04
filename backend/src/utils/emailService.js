const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,    
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    },
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