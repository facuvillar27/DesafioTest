import orderModel from '../models/orders.model.js';

class Order {
    getOrders = async () => {
        try {
            const orders = await orderModel.find()
            return orders;
        } catch (error) {
            console.error('Error getting orders:', error);
        }
    }

    getOrderById = async (id) => {
        try {
            const order = await orderModel.findById(id);
            return order;
        } catch (error) {
            console.error('Error getting order by id:', error);
            throw error;
        }
    }

    createOrder = async (order) => {
        try {
            const newOrder = new orderModel(order);
            await newOrder.save();
            return newOrder;
        } catch (error) {
            console.error('Error saving order:', error);
            throw error;
        }
    }

    resolveOrder = async (id, order) => {
        try {
            const result = orderModel.findByIdAndUpdate(id, order);
            return result;
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    }
}

export default Order;

