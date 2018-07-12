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

router.patch("/:id", (req,resp,next)=>{
	const newData = {};

	for(let prop in req.body){
		newData[prop] = req.body[prop]
	}

	//patch validation
	OrdersModel.schema.path("name").validate((val)=>{
		return /\w{1,}/.test(val); // poor reg exp `\( -_-)/`
	},"Invalid name!");
	OrdersModel.schema.path("quantity").validate((val)=>{
		return /^[0-9]{1,3}$/.test(val);
	},"Invalid quantity! It must be between 1 and 1000");

	const opts = {runValidators: true}

	OrdersModel.update({_id: req.params.id}, { $set: newData }, opts, (err)=>{
		if(err){ console.log(err)}
	})
		.then(
			result=>{
				resp.status(200).json(result)
			})
		.catch(
			err=>{
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