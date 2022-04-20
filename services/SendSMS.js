const fast2sms = require('fast-two-sms')
const dotenv = require("dotenv");

dotenv.config();

exports.orderSms = async (data) => {
    let items = data.details.products.map(i=>i.val).reduce((pre, cur)=> pre+cur);    
    let options = {
        authorization : process.env.FAST2SMS_API, 
        message : `your order with ID: ${data.orderId} placed successfully. Amount: ${data.details.amount}/-, products: ${items}, for more check email: ${data.emailId}`,
        numbers : [data.details.mobile]
    } 
    const response = await fast2sms.sendMessage(options)
    return response.return
}

exports.sendOtp = async (data) => {
    const otp = genOtp();
    let options = {
        authorization : process.env.FAST2SMS_API,
        message : `OTP: ${otp}. for ${data.isfor}.`,
        numbers : [data.mobile]
    }
    const response = await fast2sms.sendMessage(options);
    console.log(response, '------------otp response');
    if(response.return){
        return { isSent : true, otp : otp}
    }else{
        return { isSent : false, otp : null}
    }
}

let genOtp = () => {
    let randomNum = ()=> Math.floor(Math.random()*10)
    let x = '';
    for(i=0;i<6;i++){
        x = x + randomNum();
    }
    return x
}
