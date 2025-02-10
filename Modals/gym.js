const mongoose = require('mongoose');

const gymSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    profilepic: {
        type: String,
        required: true
    },
    gymname: {
        type: String,
        required: true
    },
    resetpasswordToken: {
        type: String
    },
    resetpasswordExpires: {
        type: Date
    }
}, { timestamps: true });  // ✅ Fixed typo

module.exports = mongoose.model('gyms', gymSchema);  // ✅ Capitalized model name (optional best practice)
