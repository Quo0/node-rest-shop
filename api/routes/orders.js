const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const OrdersModel = require("../models/order");
const ProductsModel = require("../models/product");

router.get("/", (req,resp,next)=>{
	OrdersModel.find({})
		// .select("-__v")
		.populate("product","name")
		.then(
			records=>{
				console.log(records)
				const responseData = {
					count: records.length,
					orders: records.map(order=>{
						console.log(order)
						return {
							_id: order._id,
							product: order.product,
							quantity: order.quantity,
							request: {
								order:{
									description: "For getting current order",
									type: "GET",
									ulr: `http://localhost:4000/orders/${order._id}`
								},
								product:{
									description: "For getting current product",
									type: "GET",
									ulr: `http://localhost:4000/products/${order.product._id}`
								}
							}
						}
					})
				}
				resp.status(200).json(responseData)
			})
		.catch(
			err=>{
				console.log(err);
				resp.status(500).json({error: err})
			})
});

router.get("/:id", (req,resp,next)=>{
	OrdersModel.findById(req.params.id)
		.select("-__v")
		.populate("product","-__v")
		.then(
			order=>{
				if(order){
					resp.status(200).json({
						order: order,
						request: {
							description: "For getting all orders",
							type: "GET",
							url: "http://localhost:4000/orders"
						}
					})					
				}else{
					resp.status(404).json({
						message: "Can't find order with such Id in database",
						request: {
							description: "For getting all orders",
							type: "GET",
							url: "http://localhost:4000/orders"
						}
					})
				}
			})
		.catch(
			err=>{
				resp.status(500).json({error:err})
			})
});

router.post("/", (req,resp,next)=>{
	ProductsModel.findById(req.body.product)
		.then(
			product=>{
				if(!product){
					resp.status(404).json({
						message: "Product not found!"
					});
					return;
				};
				const order = new OrdersModel({
					_id: mongoose.Types.ObjectId(),
					product: req.body.product,
					quantity: req.body.quantity
				});
				return order.save()
			})
		.then(
			order=>{
				resp.status(201).json({
					message: "Order created succesfully",
					createdOrder: {
						_id: order._id,
						product: order.product,
						quantity: order.quantity,
						request: {
							description: "For getting all orders",
							type: "GET",
							url: "http://localhost:4000/orders"
						}
					}
				})
			})
		.catch(
			err=>{
				console.log(err);
				resp.status(500).json({
					message: "Can't find the product with such ID!"
				});
			})
	
});

router.patch("/:id", (req,resp,next)=>{
	const newData = {};

	for(let prop in req.body){
		newData[prop] = req.body[prop]
	}

	//patch validation
	OrdersModel.schema.path("quantity").validate((val)=>{
		return /^[0-9]{1,3}$/.test(val);
	},"Invalid quantity! It must be between 1 and 1000");

	const opts = {runValidators: true}

	OrdersModel.update({_id: req.params.id}, { $set: newData }, opts, (err)=>{
		if(err){ console.log(err)}
	})
		.then(
			result=>{
				resp.status(200).json({
					message: "You succesfully updated the order",
					request: {
						description: "For getting updated order",
						type:"GET",
						url: `http://localhost:4000/orders/${req.params.id}`
					}
				})
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
				resp.status(200).json({
					message: "You succesfully deleted the order",	
					request: {
						description: "For getting all orders",
						type:"GET",
						url: "http://localhost:4000/orders"
					}
				})
			})
		.catch(
			err=>{
				resp.status(500).json({error: err})
			})
});

module.exports = router;