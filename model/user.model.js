const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true
        },
        userName: {
            type: String,
            required : true
        },
        password: {
            type: String,
            required : true
        },
        emailId: {
            type: String,
            required : true,
            unique: true
        },
        mobileNumber: {
            type: Number,
            required : true
        },
        role: {
            type:String,
            default: "CUSTOMER"
        }
    }
)
module.exports = mongoose.model('user', userSchema);