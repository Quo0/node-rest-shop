const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const ProductsModel = require("../models/product");

router.get("/",(req,resp,next)=>{
	ProductsModel.find({})
		// .select("-__v")
		.then(
			records=>{
				const responseData = {
					count: records.length,
					products: records.map(prod=>{
						return {
							_id: prod._id,
							name: prod.name,
							price: prod.price,
							request: {
								description: "For getting current product",
								type: "GET",
								url: `http://localhost:4000/products/${prod._id}`
							}
						} 
					}),
				}
				resp.status(200).json(responseData)
			})
		.catch(
			err=>{
				resp.status(500).json({error: err})
			})
});

router.get("/:id",(req,resp,next)=>{
	ProductsModel.findById(req.params.id)
		.select("-__v")
		.then(
			product=>{
				if(product){
					resp.status(200).json({
						product: product,
						request: {
							description: "For getting all the products",
							type: "GET",
							url: "http://localhost:4000/products/"
						}
					})					
				}else{
					resp.status(404).json({
						message: "Can't find product with such Id in database"
					})
				}
			})
		.catch(
			err=>{
				resp.status(500).json({error:err})
			})
});

router.post("/",(req,resp,next)=>{
	const product = new ProductsModel({
		_id: mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
	});
	product.save()
		.then(
			product=>{
				resp.status(201).json({
					"message" : "Product created succesfully",
					createdProduct: {
						name: product.name,
						price: product.price,
						_id: product._id,
						request: {
							description: "For getting all the products",
							type: "GET",
							url: `http://localhost:4000/products`
						}
					}
				})
			})
		.catch(
			err=>{
				console.log(err.message)
				resp.status(500).json({error:err})
			})
});

router.patch("/:id",(req,resp,next)=>{
	const newData = {}

	for(let prop in req.body){
		newData[prop] = req.body[prop]
	}

	// patch validation 
	ProductsModel.schema.path("name").validate((val)=>{
		return /\w{1,}/.test(val); // poor reg exp `\( -_-)/`
	}, "Invalid name!");
	ProductsModel.schema.path("price").validate((val)=>{
		return /^[0-9]+\.{0,1}\d{0,2}$/.test(val)
	}, "Invalid price!");

	const opts = { runValidators: true };

	ProductsModel.update({_id: req.params.id} , { $set: newData } , opts, (err)=>{
		if(err){ console.log(err.errors)};
	})
		.then(
			result=>{
				// console.log("updated: ", result)
				resp.status(200).json({
					message: "You succesfully updated the product",
					request: {
						description: "For getting updated product",
						type:"GET",
						url: `http://localhost:4000/products/${req.params.id}`
					}
				})
			})
		.catch(
			err=>{
				resp.status(500).json({error:err})
			})
});

router.delete("/:id",(req,resp,next)=>{
	ProductsModel.remove({_id: req.params.id})
		.then(
			result=>{
				resp.status(200).json({
					message: "You succesfully deleted the product",
					request: {
						description: "For getting all products",
						type:"GET",
						url: `http://localhost:4000/products`
					}
				})
			})
		.catch(
			err=>{
				resp.status(500).json({error:err})
			})
});


module.exports = router;