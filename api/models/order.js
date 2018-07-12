const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		validate: {
			validator: function(val){
				return /\w{1,}/.test(val); // poor reg exp `\( -_-)/`
			},
			message: "{VALUE} is not a valid for the name"
		},
		required: [true, "The name is required!"]
	},
	quantity: {
		type: Number,
		min: [1, "You can't set quantity to zero!"],
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