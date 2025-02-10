
const gym = require('../Modals/gym');
const gymmodel=require('../Modals/gym')
 const bcrypt = require("bcrypt");
 const crypto=require('crypto');
 const nodemailer=require('nodemailer')
 const { google } = require('googleapis');
 const jwt =require('jsonwebtoken')
 exports.register = async (req, res) => {
    try {
        const { username, password, email, gymname, profilepic } = req.body;

        // ✅ Validate required fields
        if (!username || !password || !email || !gymname) {
            return res.status(400).json({ error: "Username, password, email, and gym name are required" });
        }

        // ✅ Check if the gym already exists
        const isExist = await gym.findOne({ username });
        if (isExist) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // ✅ Hash password safely
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create new gym entry
        const newGym = new gym({
            username,
            password: hashedPassword,
            email,
            gymname,
            profilepic
        });

        await newGym.save(); // Save to the database

        res.status(201).json({ message: "Gym registered successfully!" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const cookieoptions = {
    httpOnly: true,
    secure: false, // Change to true in production with HTTPS
    sameSite: 'Lax'
};



exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // ✅ Ensure username and password are received
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // ✅ Find user by username
        const gymUser = await gym.findOne({ username });

        if (!gymUser) {
            return res.status(404).json({ error: "No gym found with this username" });

        }
       

        // ✅ Log entered & stored password before comparison
        console.log("Entered Password:", password);
        console.log("Stored Hashed Password:", gymUser.password);

        // ✅ Compare hashed password
        const isMatch = await bcrypt.compare(password, gymUser.password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign({ id: gymUser._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie("cookie_token", token, { httpOnly: true });

        return res.json({ message: "Login successful", success: true, token });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.SENDER_EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
});




exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(req.body);

        const gymUser = await gym.findOne({ email });
        if (!gymUser) {
            return res.status(400).json({ message: "No gym found with this email", success: false });
        }

        // Generate 6-digit OTP
        const token = Math.floor(100000 + Math.random() * 900000);

        gymUser.resetpasswordToken = token;
        gymUser.resetpasswordExpires = Date.now() + 3600000; // OTP valid for 1 hour
        await gymUser.save();

        // Send email
        const mailOptions = {
            from: 'shamlirazak57@gmail.com',
            to: email,
            subject: 'Reset Password OTP',
            text: `Your OTP is ${token}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: 'Server error', errorMsg: error });
            } 
            res.status(200).json({ message: "OTP sent to your email" });
        });

    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.checkotp = async (req, res) => {
    try {
        console.log("Request received:", req.body);
        const { email, otp } = req.body;
        const gymUser = await gym.findOne({ email });
        
        if (!gymUser) {
            console.log("No user found with email:", email);
            return res.status(400).json({ message: "No gym found with this email", success: false });
        }

        if (gymUser.resetpasswordToken !== otp || gymUser.resetpasswordExpires < Date.now()) {
            console.log("Invalid OTP or expired token for user:", email);
            return res.status(401).json({ message: "Invalid OTP or token expired", success: false });
        }

        res.status(200).json({ message: "OTP verified successfully", success: true });
    } catch (error) {
        console.error("Error checking OTP:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.resetpassword = async (req, res) => {
    try {
        const { email, newpassword } = req.body;
        console.log("Received Email:", email, "New Password:", newpassword);

        // ✅ Validate Inputs
        if (!email || !newpassword) {
            return res.status(400).json({ message: "Email and new password are required", success: false });
        }

        // ✅ Find the Gym User
        const gymUser = await gym.findOne({ email });
        console.log("Found Gym User:", gymUser);

        if (!gymUser) {
            return res.status(404).json({ message: "No gym found with this email", success: false });
        }

        // ✅ Hash New Password
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        gymUser.password = hashedPassword;
        gymUser.resetpasswordToken = undefined;
        gymUser.resetpasswordExpires = undefined;

        // ✅ Save Updated User
        await gymUser.save();
        console.log("Password Updated Successfully for:", gymUser.email);

        res.status(200).json({ message: "Password reset successfully", success: true });

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};


exports.logout=async()=>{
    try {
         res.clearCookie("cookie_token");
        return res.status(200).json({ message: "Logged out successfully", success: true });
    } catch (error) {
        console.error("Error logging out:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" }); 
    }
}