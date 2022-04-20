const dotenv = require("dotenv");
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken);

let generateOtp = ()=>{
    let num = Math.random();
    let getRandomNumber = (min, max) => Math.floor(num * (max - min + 1)) + min;
    return getRandomNumber(1, 9);
}

exports.sendOtp = (mobile) => {
    console.log('function called');
    let mobileNumber = mobile;
    let number = '';
    for(let i=0;i<6;i++){
        number = number + generateOtp();
    }
    console.log(number);
    
    client.messages.create({
        body : `Hi this is your OTP: ${number}`,
        to : `+91${mobileNumber}`,
        from : '+18124583377'
    }).then((message, error) =>{
        if(error){
            res.send({status : 'error'});
            console.log(error);
        }
        else{
            console.log(message);
            res.send({sent : true, otpNumber : number});
        }
    })
    return {otp : number, isSent : true, mobileNumber : mobile};
}