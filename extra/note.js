let userCheck = await userModel.find({userId:userDetais.userId});
        console.log(userCheck);

        if(userCheck=[]){
            let response = await newUser.save();
            console.log(response); 
            if(response._id){
                var payload = {"subject": response._id};
                let token = jwt.sign(payload, process.env.SECRET_KEY);
                console.log("I'm in if response id ", response._id);
                res.send({isRegistered : true, message : "successfully registered.", token: token});
            }
        }

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiNjFmOTY5ODcxYzY3NTFmZDJmMDEyOTc2IiwiaWF0IjoxNjQzNzM1NDMxfQ.BdxLPka7tGHgn4J1r1I4rBBdgimbkkdO18Zgq4RfQxI

// db.users.update({"userId":"001"},{"role":"ADMIN"}); // all document will replaced
// db.users.updateOne({"userId":"001"},{$set : {"role":"ADMIN"}});
// db.users.remove({"role":"ADMIN"});


var authMiddleware =(req,res,next) =>{
    console.log("I'm in auth middleware.");
    if(req.headers.authorization){
        var userEmail = req.body;
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, function(err, payload){
            if(err){
                console.log("error", err);
                res.status(401).send(err.message);
            }
            if(payload){
                console.log(payload, 'payload print ............');
                console.log(userEmail,'email id print after payload............');
                userModel.find({emailId: userEmail.emailId}, function(err, result){
                    console.log(result, '    result ..............')
                    if(result){
                        console.log(payload.subject, result[0]._id.toString());
                        if(payload.subject == result[0]._id.toString()){
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


// // let uni = async ()=>{
// //     var req = await unirest("POST", "https://www.fast2sms.com/dev/bulkV2").headers(
// //         {
// //             "authorization": "af3mwVZjcz2J8BFie5TYD90WNxbXgRMOdoqGhnuyr6LKCUS1HQ5GrJTHAWz6EMt3VIbOBcl4ZPNkxKgq"
// //         }
// //     ).form(
// //         {
// //             "message": `Your Order was placed successfully. Total Amount is/-. Total products: , for more details please check email: `,
// //             "language": "english",
// //             "route": "q",
// //             "numbers": '9110768769',
// //         }
// //     ).end();
// //     console.log(req);

// // }
// // uni();
// // exports.sendSms = async (options)=>{
// //     let val = 0;
// //     options.details.products.map((i,j)=>{val + i.val})
// //     req.headers({
// //         "authorization": process.env.FAST2SMS_API
// //     });
    
// //     req.form({
// //    ~
// let generateOtp = ()=>{
//     let x = '';
//     let num = Math.random();
//     let getRandomNumber = (min, max) => Math.floor(num * (max - min + 1)) + min;
//     for(i = 0; i< 6; i++){
//         x = x + getRandomNumber(1, 9);
//     }
//     return x;
// }
// console.log(generateOtp());