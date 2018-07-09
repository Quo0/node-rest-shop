const mongoose = require("mongoose");

const productsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	price: Number
},{collection:"Products"});

module.exports = mongoose.model("Products", productsSchema)