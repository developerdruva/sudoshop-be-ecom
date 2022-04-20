var orderModel = require('../model/order.model');
const emailService = require("../services/SendEmail");  
const smsService = require("../services/SendSMS");

exports.newOrder = async (req, res) => {
    console.log('new order api hitted.');
    let orderInfo = req.body;
    console.log(orderInfo, 'new order orderInfo details.........');
    let resorderId = await orderModel.findOne({orderId : orderInfo.orderId});
    if(resorderId){
        res.send({status : false, message  : "order id already existed"});
    }else{
        let order = new orderModel(orderInfo);  
        let orderRes = await order.save();
        if(orderRes._id){
            let options = {
                to : orderRes.emailId,
                subject : "Order Details",
                text : "hi there",
                html: `
                      <h1 style="color:#34495E;">Hello ${orderRes.details.customer},</h1>
                      <h1 style="color:green;">Your order placed successfully.</h1>
                      <h2>Order Details:</h2>
                      <div>
                      Order ID : <span>${orderRes.orderId}</span><br/>
                      Email : <span>${orderRes.emailId}</span><br/>
                      Mobile : <span>${orderRes.details.mobile}</span><br/>
                      Adress : <span>${orderRes.details.address}</span><br/>
                      Amount : <span style="color:blue;font-size:18px;"><b>${orderRes.details.amount}/-</b></span><br/><br/>
                      <b>Products</b> : <br/>
                      <table>
                            <tr>
                                ${orderRes.details.products.map((i,j)=>{
                                    return `<td><img src=${i.product.imageUrl} height="100px" width="60px" alt='product url' />&nbsp;
                                    <center><p >${i.val}</p> </center></td>`
                                })}
                            </tr>
                        </table>
                      </div>
                `
            }
            let mailRes = await emailService.sendEmail(options);
            let smsRes = await smsService.orderSms(orderRes);
            if(mailRes && smsRes){
                res.send({status : true, mail : true, sms: true, message : 'order added'});
            }else{
                res.send({status : true, mail : false, sms: false, message : 'order added'});
            }
        }else{
            res.send({status : false, mail : false, sms: false, message : 'order not added'});
        }
    }
}

exports.ordersIn = async (req, res) => {
    console.log('api hitted ordersIn');
    orderModel.find(function(err, doc){
        if(doc){
            console.log(doc, ' --------------doc');
            res.send(doc);
        }if(err){
            console.log(err, '-------------err');
            res.send(err);
        }
    });
}

exports.ordersByUser = async (req, res)=>{
    console.log('api hitted orderbyuser');
    let userId = req.params.userId;
    console.log(userId,'--------api hitted orderbyuser');
    let orderRes = await orderModel.find({userId:userId});
    console.log('----------', orderRes, '--------------');
    if(orderRes.length > 0){
        res.send(orderRes);
    }else{
        res.send(false);
    }
}