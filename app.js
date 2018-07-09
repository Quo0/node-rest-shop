const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");


//database
const mongoOptions = {
	 useNewUrlParser: true,
	 authSource: process.env.MONGO_ATLAS_PW, // to avoid authentication error
	 replicaSet: "node-rest-shop-shard-0"
}
mongoose.connect(`mongodb://admin:${process.env.MONGO_ATLAS_PW}@node-rest-shop-shard-00-00-bg88w.mongodb.net:27017,node-rest-shop-shard-00-01-bg88w.mongodb.net:27017,node-rest-shop-shard-00-02-bg88w.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true`, 
	mongoOptions
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//CORS
app.use((req,resp,next)=>{
	resp.header("Access-Control-Allow-Origin","*");
	resp.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorizaton"
	);
	if(req.method === "OPTIONS"){
		resp.header("Access-Controll-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
		return resp.status(200).json({});		
	}
	next();
});

app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);

//error catching
app.use((req,resp,next)=>{
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

app.use((error,req,resp,next)=>{
	resp.status(error.status || 500);
	resp.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;