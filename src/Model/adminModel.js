//===================== Importing Packages =====================//
const mongoose = require('mongoose')


//===================== Creating User's Schema =====================//
const adminSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLen: 8,
        maxLen: 15,
        trim: true
    }

}, { timestamps: true })


//===================== Module Export =====================//
module.exports = mongoose.model('Admin', adminSchema)