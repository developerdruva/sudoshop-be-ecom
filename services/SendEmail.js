const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async function(options){
    let opts = {
        to: options.to,
        from: process.env.SENDER_EMAIL,
        subject: options.subject,
        text: options.text,
        html: options.html
    };
    let resMail = await sgMail.send(opts);
    if(resMail[0].statusCode === 200 || 202){
        return true
    }else{
        return false
    }
}

