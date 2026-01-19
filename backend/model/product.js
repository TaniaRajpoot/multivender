const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"]
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    category: {
        type: String,
        required: [true, "Please enter product category"]
    },
    tags: {
        type: [String],
    },
    originalPrice: {
        type: Number,
        required: [true, "Please enter product price"]
    },
    discountPrice: {
        type: Number,
        required: [true, "Please enter product discount price"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"], 
        min: [0, "Stock cannot be negative"]
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        }
    ],
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide shop id"]
    },
    shop: {
        type: Object,
        required: true
    },
    soldOut: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: Object,
            },
            rating: {
                type: Number,
            },
            comment: {
                type: String,
            },
            productId: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    ratings: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);