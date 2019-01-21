const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    size: Number,
    total_value: Number,
    products: [{ Number }]
}) 

module.exports = mongoose.model('Cart', cartSchema);