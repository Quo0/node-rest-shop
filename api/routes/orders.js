const express = require("express");
const router = express.Router();

router.get("/", (req,resp,next)=>{
	resp.status(200).json({
		"message" : "handling GET /orders"
	});
});

router.get("/:id", (req,resp,next)=>{
	resp.status(200).json({
		"message" : "handling GET /orders/:id"
	});
});

router.post("/", (req,resp,next)=>{
	const order = {
		productId: req.body.productId,
		quantity: req.body.quantity
	}
	resp.status(201).json({
		"message" : "handling post /orders",
		order: order
	});
});

router.delete("/:id", (req,resp,next)=>{
	resp.status(200).json({
		"message" : "handling DELETE /orders/:id"
	});
});

module.exports = router;