const { generateAuthToken } = require("../utils/jwtUtils");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const validator = require("validator"); // Correct import

exports.emailPasswordLogin = async (req, res) => {
    console.log("Received request to login with email and password");
    const { emailAddress: email, userPassword: password, firstName: userName, lastName: userLastname, gender: userSex, userAge: age } = req.body;

    try {
        const sanitizedEmail = validator.normalizeEmail(email); 
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

            console.log(`Before creating user with email ${sanitizedEmail, userName, userLastname, userSex, age}`);
            user = await userModel.create({
                email: sanitizedEmail,
                password: hashedPassword,
                name: userName,
                lastname: userLastname,
                sex: userSex,
                age: age,
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