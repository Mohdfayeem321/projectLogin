//===================== Importing Packages =====================//
const mongoose = require('mongoose')


//===================== Creating Product's Schema =====================//
const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
    },

    deletedAt: {
        type: Date
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })



//===================== Module Export =====================//
module.exports = mongoose.model('Product', productSchema)