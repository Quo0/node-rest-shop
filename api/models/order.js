const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	quantity: Number,
}, {collection: "Orders"});

module.exports = mongoose.model("Orders", ordersSchema);