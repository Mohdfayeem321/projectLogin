//===================== Import Packages =====================//
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


//===================== Create Order's Schema =====================//
const orderSchema = new mongoose.Schema({

    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: { type: ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        _id: false
    }],
    totalPrice: {
        type: Number,
        required: true,
    },
    totalItems: {
        type: Number,
        required: true,
    },
    totalQuantity: {
        type: Number,
        required: true,
    },
    
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


//===================== Module Export =====================//
module.exports = mongoose.model('Order', orderSchema)