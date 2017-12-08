var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {
        type: String,
        required: 'Please input product name'
    },
    description: {
        type: String,
        required: 'Please input product description'
    },
    price: {
        type: Number,
        required: 'Please input valid product price'
    }
});

var Product = mongoose.model('Product',ProductSchema);
module.exports = Product;