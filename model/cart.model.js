const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema(
    {
        userId : {
            type : String,
            required : true,
            unique : true
        },
        cart : {
            type : Array
        }

    }
);

module.exports = mongoose.model('cartofusers', cartSchema);