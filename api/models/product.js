const mongoose = require("mongoose");

const productsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		validate: {
			validator: function(val){
				return /\w{1,}/.test(val); // poor reg exp `\( -_-)/`
			},
			message: "{VALUE} is not a valid for the name!"
		},
		required: [true, "You must set the name of the product"]
	},
	price: {
		type: Number,
		min: [0.1, "You cant't set price to zero!"],
		validate: {
			validator: function(val){
				return /^[0-9]+\.{0,1}\d{0,2}$/.test(val);
			},
			message: "The price must be a number! ( 12 / 10.5 / 10. 45 )"
		},
		required: [true, "You must set the product's price"]
	},
	productImage: {
		type: String,
		required: [true, "You must set the product's image"]
	}
},{collection:"Products"});

module.exports = mongoose.model("Products", productsSchema)