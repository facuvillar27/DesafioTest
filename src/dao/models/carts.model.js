import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartCollection = 'carts';

async function getProductModel() {
    const { productModel } = await import('./products.model.js');
    return productModel;
}

const CartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: () => getProductModel().then(model => model.modelName),
        },
        quantity: Number,
    }],
});

CartSchema.plugin(mongoosePaginate);

const cartModel = mongoose.model(cartCollection, CartSchema);

export default cartModel;