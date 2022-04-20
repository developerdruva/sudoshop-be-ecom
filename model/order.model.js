const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    orderId : {
        type: String,
        required : true,
        unique : true
    },
    date : {
        type : String,
        required : true
    },
    userId : {
        type: String,
        required : true
    },
    paymentId : {
        type: String,
        required: true
    },
    emailId : {
        type: String,
        required: true
    },
    details : {
        customer : {
            type : String,
            required : true
        },
        mobile : {
            type : Number,
            required : true
        },
        address  : {
            type : String,
            required : true
        },
        amount : {
            type : Number,
            required: true
        },
        products : {
            type : Array
        }
    }
});

module.exports = mongoose.model('orders', orderSchema);