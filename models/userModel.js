const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    cart:[{
        product : {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Products"
        } ,
        soluongmua : Number
    }],
    resetToken : {
        default : "",
        type : String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)