import { userModel } from "../models/users.model.js";
import cartModel from "../models/carts.model.js";

class User {
    async getUsers() {
        try {
            const users = await userModel.find().populate('cart');
            return users.map(user => user.toObject())
        } catch (error) {
            console.error('Error getting users:', error)
        }
    }

    async getUserById(id) {
        try {
            const user = await userModel.findById(id).populate('cart');
            return user
        } catch (error) {
            console.error('Error getting user by id:', error)
        }
    }

    async createUser(user) {
        if (!user.cart) {
            const newCart = new cartModel({ products: [] });
            const savedCart = await newCart.save();
            user.cart = savedCart._id;
        }
        let result = await userModel.create(user);
        return result;
    }

    async getBy(params) {
        let result = await userModel.findOne(params).populate({
            path: 'cart',
            populate: { path: 'products.product' } // Pobla los productos dentro del carrito
        }).lean();
        return result;
    }

    async update (id, user) {
        delete user._id;
        let result = await userModel.updateOne({ _id: id}, {$set:user})
        return result;
    }

    async updateRole(id, role) {
        try {
            let result = await userModel.updateOne({ _id: id }, { $set: { role: role } });
            if (result.nModified === 0) {
                throw new Error("No se pudo actualizar el rol del usuario");
            }
            const updatedUser = await this.getUserById(id);
            return updatedUser;
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error;
        }
    }
}

export default User