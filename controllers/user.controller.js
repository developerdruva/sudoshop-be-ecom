const userModel = require('../model/user.model');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require('bcryptjs/dist/bcrypt');
const smsService = require("../services/SendSMS");
const emailService = require("../services/SendEmail");

dotenv.config();

exports.login = async (req, res) => {
    var userDetails = req.body;
    let userCheck = await userModel.find({emailId: userDetails.emailId});
    if(userCheck.length > 0){
        if(userDetails.emailId == userCheck[0].emailId && bcrypt.compareSync(userDetails.password, userCheck[0].password)){
            var payload = {
                "subject": userCheck[0]._id,
                "role" : userCheck[0].role,
            };
            let token = jwt.sign(payload, process.env.SECRET_KEY);
            res.send({"token": token});
        }
        else{
            res.send({error: 'authentication failed'});
        }
    }
    else{
        res.send({error: "user doesn't existed."});
    }
}


exports.register = async (req, res) => {
    var userDetails = req.body;
    var salt = bcrypt.genSaltSync(10);
    let user = {
        userId : userDetails.userId,
        userName : userDetails.userName,
        password : bcrypt.hashSync(userDetails.password,salt),
        emailId : userDetails.emailId,
        mobileNumber : userDetails.mobileNumber
    }
    var newUser = new userModel(user);

    try{
        let userIds = await userModel.distinct("userId");
        let mobileNumbers = await userModel.distinct("mobileNumber");
        let emailIds = await userModel.distinct("emailId");
        
        if(userIds.includes(user.userId) || emailIds.includes(user.emailId) || mobileNumbers.includes(user.mobileNumber)){
            res.send({isRegistered: false, message: "user is already existed."});
        }
        else{
            let response = await newUser.save();
            if(response._id){
                var payload = {"subject": response._id};
                let token = jwt.sign(payload, process.env.SECRET_KEY);
                res.send({isRegistered : true, message : "successfully registered.", token: token});
            }
        }
    }
    catch(error){
        res.send({isRegistered : false, message: error.message});
    }
}

exports.usersIn = async (req, res) => {
    userModel.find(function(err, doc){
        if(err){
            res.send("there is an error", err.message);
        }if(doc){
            res.status(200).send(doc);
        }
    })
}

exports.passwordChange = async (req, res) => {
    var userDetails = req.body;
    let emailId = userDetails.emailId;
    let password = userDetails.currentPass;
    var salt = bcrypt.genSaltSync(10);
    let newPassword = bcrypt.hashSync(userDetails.newPass, salt);

    userModel.findOne({emailId:emailId}, function(err, data){
        if(err){
            res.send(err.message);
        }
        else if(data){
            if(bcrypt.compareSync(password, data.password)){
                userModel.updateOne({emailId: emailId}, {password: newPassword}, function(err, data){
                    if(err){
                        res.send(err.message);
                    }
                    else{
                        res.send({isChanged : true});
                    }
                })
            }
            else{
                res.send("enter valid current password");
            }
        }
    })

}

exports.forgotPasswordDataCheck = async (req, res)=>{
    let emailId = req.body.emailId;
    let mobile = req.body.mobileNumber;
    const findData = await userModel.findOne({$and : [{emailId : emailId}, {mobileNumber : mobile}]});
    if(findData === null){
        res.send({userCheck : false, status : 'No user found'});
    }else{
        const otpRes = await smsService.sendOtp({mobile : findData.mobileNumber, isfor : 'fotgot password'});
        console.log(otpRes, '------------')
        if(otpRes.isSent){
            res.send({userCheck : true, isSent : true, otp : otpRes.otp});
        }else{
            res.send({userCheck : false, isSent : false, otp : null});
        }
    }
}
exports.forgotPasswordWithOtp = async (req, res)=>{
    let emailId = req.body.emailId;
    let newPass = req.body.newPass;
    var salt = bcrypt.genSaltSync(10);
    let newPassword = bcrypt.hashSync(newPass, salt);
    const passChange = await userModel.updateOne({emailId : emailId}, {password : newPassword});
    if(passChange.modifiedCount > 0){
        res.send({isChanged : true, status : 'password changes successfully'});
    }else{
        res.send({isChanged : false, status : "error"});
    }    
}

exports.forgotPassword = async (req, res) => {
    console.log("forgot password api hitted.");
    let emailId = req.body.emailId;
    let resp = await userModel.find({emailId: emailId});
    if(resp.length > 0){
        let options = {
            to : emailId,
            subject : "Password Reset",
            text : "Password Reset",
            html: `
                   Hi how are you?
            `
        }
        emailService.sendEmail(options);
    }
    console.log(resp);
    res.send("null");
}

exports.removeUser = (req,res) => {
    var uid = req.params.uid;
      userModel.deleteOne({userId:uid}, function(err){
          if(err){
              res.send(err.message);
          }
          else{
              res.send({isUserDeleted : true});
          }
      })
}

exports.updateUserRole = (req,res) => {
    console.log('api hitted updateuserrole')
    var body = req.body;
    console.log(body);
    if(body.role === 'CUSTOMER'){
        userModel.updateOne({userId:body.uid},{$set : {"role":"ADMIN"}}, function(err){
            if(err){
                res.send(err.message);
            }
            else{
                res.send({isUserUpdated : true});
            }
        })
    }else if(body.role === 'ADMIN'){
        userModel.updateOne({userId:body.uid},{$set : {"role":"CUSTOMER"}}, function(err){
            if(err){
                res.send(err.message);
            }
            else{
                res.send({isUserUpdated : true});
            }
        })
    }
}


exports.sendOtp = async (req, res) => {
    let mobileNumber = req.params.mobile;
    let resSms = await smsService.sendOtp({mobile: mobileNumber, isfor : 'registration'});
    if(resSms.isSent){
        res.send({sent : true, otp : resSms.otp});
    }else{
        res.send({sent : false, otp : null});
    }
}

exports.checkUser = async (req, res) => {
    let form = req.body;
    let response = await userModel.find();
    let listDetils = [];
    
    let result = response.map((item)=>{
        item = item.toObject();
        delete item._id;
        delete item.__v;
        return item; 
    });
    result.map((item) => {
        listDetils = listDetils.concat(Object.values(item));
    });
    if(listDetils.includes(form.userId)){
        res.send({result : {entity : 'User ID', val : form.userId}, isIn : true})
    }else if(listDetils.includes(parseInt(form.mobileNumber))){
        res.send({result : {entity : 'Mobile Number', val : form.mobileNumber}, isIn : true})
    }else if(listDetils.includes(form.emailId)){
        res.send({result : {entity : 'Email ID', val : form.emailId}, isIn : true})
    }else{
        res.send({result : 'success', isIn : false});
    }
}

exports.getUserDet = async (req, res) => {
    let id = req.params.id;
    userModel.findOne({_id : id}, function(err, doc){
        if(err){
            res.send({status : false});
        }if(doc){
            res.send({status : true, body : doc});
        }
    });
}