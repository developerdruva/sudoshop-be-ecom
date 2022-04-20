var cartModel = require('../model/cart.model');

exports.addCart = async (req, res) => {
    const cartUser = req.body.userId;
    const cartItemId = req.body.cart.pid;
    const cartItemVal = req.body.cart.val;
    
    const checkUser = await cartModel.exists({userId : cartUser});
    if(checkUser){
        let checkProduct = await cartModel.findOne({userId: cartUser});
        let cartres = checkProduct.cart.map((item)=>{ return item.pid});
        if(cartres.includes(cartItemId)){
            let val = parseInt(checkProduct.cart[cartres.indexOf(cartItemId)].val) + 1;
            const updateCartVal = await cartModel.updateOne({userId:cartUser, "cart.pid": cartItemId}, {$set:{"cart.$.val": val}});
            console.log(updateCartVal);
            if(updateCartVal.acknowledged){
                cartModel.findOne({userId: cartUser},function(err,doc){
                    if(err){
                        // res.send(err);
                    }if(doc){
                        console.log(doc);
                        res.send({message : "user cart product val updated", userId : doc.userId, cart : doc.cart});
                    }
                })
            }
            
        }else{
            const updateUser = await cartModel.updateOne({userId:cartUser},{$push:{cart:{pid:cartItemId,val:cartItemVal}}});
            console.log(updateUser);
            if(updateUser.acknowledged){
                cartModel.findOne({userId: cartUser},function(err,doc){
                    if(err){
                        // res.send(err);
                    }if(doc){
                        console.log(doc);
                        res.send({message : "user cart updated", userId : doc.userId, cart : doc.cart});
                    }
                })
            }
        }
    }else{
        console.log( ' user else block in backend');
        let cart = new cartModel(req.body); 
        const cartuser = await cart.save();
        console.log(cartuser);
        if(cartuser._id){
            res.send({message : "new user cart added", userId : cartuser.userId, cart : cartuser.cart});
        }
    }
}

exports.getCart = (req, res) =>{
    console.log("api hitted getcart api");
    cartModel.find(function(err, doc){
        if(err){
            res.send(err);
        }
        if(doc){
            res.send(doc);console.log(doc);
        }
    });
}

exports.getUserCart = (req,res)=>{
    const uid = req.params.userId;
    cartModel.findOne({userId :uid}).then((doc, err)=>{
        if(doc){
            console.log(doc);
            res.send({'status' : doc});
        }else{
            res.send({"status": false});
            console.log(doc);
        }
    })
    
}

exports.deleteUserCart = async (req, res) => {
    const uid = req.params.userId;
    const delUserCart = await cartModel.deleteOne({userId : uid});
    console.log(delUserCart,'------------del user cart');
    res.send(delUserCart);
}

exports.increaseItem = async (req, res) => {
    console.log(req.body,' ============');
    const uid =req.body.uid;
    console.log(uid,' -----------');
    
    const pid = req.body.pid;
    console.log(pid,' -------------');
    const incItem = await cartModel.updateOne({userId:uid, "cart.pid": pid}, {$inc:{"cart.$.val": 1}})
    if(incItem instanceof Error){
        res.send('error');
        console.log(incItem)
    }else{
        res.send(incItem);
        console.log(incItem);
    }
}
exports.decreaseItem = async (req, res) => {
    const uid =req.body.uid;
    const pid = req.body.pid;
    const incItem = await cartModel.updateOne({userId:uid, "cart.pid": pid}, {$inc:{"cart.$.val": -1}})
    if(incItem instanceof Error){
        res.send('error');
        console.log(incItem)
    }else{
        res.send(incItem);
        console.log(incItem);
    }
}