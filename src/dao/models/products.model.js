import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { userModel } from './users.model.js';

const productCollection = 'products';

const ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: { 
        type: String,
        unique: true,
        index: true
    },
    stock: Number,
    status: Boolean,
    category: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel.modelName,
        default: 'admin'
    },
});

ProductSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, ProductSchema);

export default productModel;

