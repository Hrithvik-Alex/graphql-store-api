const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    size: Number,
    total_value: Number,
    products: [
        { 
            title: {
                type: String,
                required: true
            },
            price: Number,
            inventory_count: Number  
    }
    ]
}) 

module.exports = mongoose.model('Cart', cartSchema);