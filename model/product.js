const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {type: String, required: true},
    price: Number,
    inventory_count: Number
}) 

module.exports = mongoose.model('Product', productSchema);