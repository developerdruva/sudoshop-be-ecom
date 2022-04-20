const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const DB = require('./services/db');
const UserRouter = require('./routes/user.routes');
const ProductRouter = require("./routes/product.routes");
const CartRouter = require("./routes/cart.routes");
const OrderRouter = require("./routes/order.routes");

dotenv.config();
DB.connectToDB();

app.use(cors());
app.use(express.json());
app.use(UserRouter);
app.use(ProductRouter);
app.use(CartRouter);
app.use(OrderRouter);

app.get('/sampleapi', function(req, res){
    res.send("OK");
})

app.get('/', function(req, res){
    res.send({status : 'your application running successfully'});
})

const PORT = process.env.PORT || 8989;

app.listen(PORT, ()=>{
    console.log("server started on port -->", PORT); 
})