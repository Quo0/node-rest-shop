const express = require("express");
const router = express.Router();

router.get("/",(req,resp,next)=>{
	resp.status(200).json({
		"message" : "handling GET /products"
	})
});

router.get("/:id",(req,resp,next)=>{
	resp.status(200).json({
		"message" : "handling GET /products/:id"
	})
});

router.post("/",(req,resp,next)=>{
	const product = {
		name: req.body.name,
		price: req.body.price
	}
	resp.status(201).json({
		"message" : "handling POST /products",
		createdProduct: product
	});
});

router.patch("/:id",(req,resp,next)=>{
	resp.status(200).json({
		"message" : "handling PATCH /products"
	})
});

router.delete("/:id",(req,resp,next)=>{
	resp.status(200).json({
		"message" : "handling DELETE /products/:id"
	})
});


module.exports = router;