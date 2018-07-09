const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const OrdersModel = require("../models/order");

router.get("/", (req,resp,next)=>{
	OrdersModel.find({})
		.then(
			records=>{
				resp.status(200).json(records)
			})
		.catch(
			err=>{
				resp.status(500).json({error: err})
			})
});

router.get("/:id", (req,resp,next)=>{
	OrdersModel.findById(req.params.id)
		.then(
			order=>{
				if(order){
					resp.status(200).json(order)					
				}else{
					resp.status(404).json({
						message: "Can't find order with such Id in database"
					})
				}
			})
		.catch(
			err=>{
				resp.status(500).json({error:err})
			})
});

router.post("/", (req,resp,next)=>{
	const order = new OrdersModel({
		_id: mongoose.Types.ObjectId(),
		name: req.body.name,
		quantity: req.body.quantity
	});
	order.save()
		.then(
			order=>{
				resp.status(201).json({
					"message" : "handling post /orders",
					createdOrder: order
				})
			})
		.catch(err=>{
			resp.status(500).json({error:err})
		})
});

router.delete("/:id", (req,resp,next)=>{
	OrdersModel.remove({_id: req.params.id})
		.then(
			result=>{
				resp.status(200).json(result)
			})
		.catch(
			err=>{
				resp.status(500).json({error: err})
			})
});

module.exports = router;