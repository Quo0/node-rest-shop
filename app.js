const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

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