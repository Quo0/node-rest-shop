const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Products",
		required: [true, "Set the ID of the product you want to order!"]
	},
	quantity: {
		type: Number,
		min: [1, "You can't set quantity to zero!"],
		default: 1,
		validate:{
			validator: function(val){
				return /^[0-9]{1,3}$/.test(val);
			},
			message: `{VALUE} is not a valid for the {PATH}!
			The quantity must be between 1 and 1000`
		},
		required: [true, "The quantity is required!"]
	},
}, {collection: "Orders"});

module.exports = mongoose.model("Orders", ordersSchema);