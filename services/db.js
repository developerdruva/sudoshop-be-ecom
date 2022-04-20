const mongoose = require('mongoose');
exports.connectToDB = () => {
    mongoose.connect(process.env.MONGO_URL, (error) => {
        if(error){
            console.log(error.message);
        }
        else{
            console.log("connected to DB");
        }
    })
}