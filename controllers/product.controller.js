var productModel = require("../model/product.model");

exports.add = (req,res) => {
    console.log(req.body);

    var product = new productModel(req.body);
    
    product.save(function(err, data){
        console.log('add product api hitted.');
        if(err){
            res.send({addingError : err.keyValue});
            console.log(err.keyValue);
        }
        if(data){
            console.log(data);
            res.send({isProductAdded : true});
        }
    })
}

exports.getProducts = (req,res) => {
    productModel.find({}, function(err,products){
        if(err){
            res.send(err.message);
        }
        else{
            res.send(products);
        }
       
    })
}
// http://localhost:8099/product/101

exports.getProduct = (req,res) => {

      var pid = req.params.pid;

    productModel.findOne({pid:pid}, function(err,product){
        if(err){
            res.send(err.message);
        }
        else{
            res.send(product);
        }
       
    })
}

exports.updateProduct = (req,res) => {
    var body = req.body;
    productModel.updateOne({pid:body.pid},body,function(err,product){
      if(err){
          res.send(err.message);
      }
      else{
          res.send(product);
      }     
  })
}

exports.removeProduct = (req,res) => {
    var pid = req.params.pid;
      productModel.deleteOne({pid:pid}, function(err){
          if(err){
              res.send(err.message);
          }
          else{
              res.send({isProductDeleted : true});
          }
      })
}

exports.userProducts = (req, res) => {
    console.log(req.body,'request body');
    let pids = req.body.pids;
    console.log(pids,'getting from request');
    productModel.find({pid : {$in : pids}}).then((doc, err)=>{
        if(doc){
            res.send({"products": doc});
            console.log(doc);
        }if(err){
            console.log(err);
        }
    })
}

exports.editProduct = (req, res) => {
    let product = {
        pid : req.body.pid,
        name : req.body.name,
        price : req.body.price,
        brand : req.body.brand,
        imageUrl : req.body.imageUrl
    }
    console.log('---------product', product);
    productModel.updateOne({pid: product.pid}, {$set: product}).then((doc, err)=>{
        if(err){
            // console.log('errrrrrrrrrrrr', err)
            res.send({status : 'product not updated'});
        }if(doc){
            console.log('doccccccccccccc', doc);
            if(doc.modifiedCount > 0){
                res.send({updated : true, status : 'product updated'});
            }else{
                res.send({updated : false, status : 'no changes found'});
            }
        }
    })
}
