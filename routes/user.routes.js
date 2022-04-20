var express  = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
const userModel = require('../model/user.model');


var userController = require("../controllers/user.controller");

var authMiddleware =(req,res,next) =>{
    console.log("I'm in auth middleware.");
    if(req.headers.authorization){
        var userEmail = req.body;
        let token = req.headers.authorization;
        console.log(req.headers.authorization, 'req auth-----------')
        jwt.verify(token, process.env.SECRET_KEY, function(err, payload){
            if(err){
                console.log("error", err);
                res.status(401).send(err.message);
            }
            if(payload){
                console.log(payload, 'payload print ............-----------------');
                console.log(userEmail,'email id print after payload............');
                userModel.findOne({emailId: userEmail.emailId}, function(err, result){
                    console.log(result, '    result ..............')
                    if(result){
                        console.log(payload.subject, result._id.toString(),  ' payload   result ..............');
                        if(payload.subject == result._id.toString()){
                            next();
                        }
                        else{
                            res.send("email id wrong.");
                        }
                    }
                    else{
                        res.send("user email not found.");
                    }
                });
            }
        })
    }
    else{
        res.send("authorization failed please check token");
    }
}
 
router.post('/register', userController.register);

router.get('/usersIn', userController.usersIn);

router.post('/login', userController.login);

router.post('/passwordchange', authMiddleware, userController.passwordChange);

router.post('/forgotpassword', userController.forgotPassword);

router.delete('/deleteuser/:uid', userController.removeUser);

router.put('/updateuserrole/', userController.updateUserRole);

router.post('/sendotp/:mobile', userController.sendOtp);

router.post('/checkUser', userController.checkUser);

router.post('/datacheck', userController.forgotPasswordDataCheck);

router.post('/passwordrecovery', userController.forgotPasswordWithOtp);

router.get('/getuserdet/:id', userController.getUserDet);

module.exports = router;    
