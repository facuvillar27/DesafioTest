// import productsDao from "../dao/mongo/index.js";
import DAO from "../dao/index.js";
import mongoose from "mongoose";

// import Products from "../dao/dbManagers/products.js"

const userService = new DAO.User();
const productService = new DAO.Product();
const cartService = new DAO.Cart();

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers()
        res.json(users)
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: "Error al obtener usuarios" });
    }
};

const getUserById = async (req, res) => {
    const uid = req.params.uid

    try {
        const user = await userService.findIndex((u) => u.id === uid)

        if (user === -1) {
            return res.status(404).json({ error: "Usuario no encontrado" })
        }

        const response = {
            message: "Usuario encontrado",
            data: user
        }
        res.json(response)
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario" })
    }
}

const createUser = async (req, res) => {
}

const addProductToCart = async (req, res) => {
    const { pid } = req.params;
    const uid = req.user.id;
    
    // Verifica que el producto exista
    const product = await productService.getProductById(pid);
    if (!product) {
        return res.status(404).send({ status: "error", error: "Product not found" });
    }
    
    // Encuentra el usuario y su carrito
    const user = await userService.getBy({ _id: uid });
    if (!user || !user.cart) {
        return res.status(404).send({ status: "error", error: "User or cart not found" });
    }
    // Verifica si el producto ya está en el carrito
    const productInCart = user.cart.products.find(item => item.product._id.toString() === pid);
    
    let update;
    let arrayFilters;

    if (productInCart) {
        // Si el producto ya está en el carrito, incrementa la cantidad
        update = {
            $inc: { 'products.$[elem].quantity':   1 }
        };
        arrayFilters = [{ 'elem.product': mongoose.Types.ObjectId(pid) }];
    } else {
        // Si el producto no está en el carrito, lo agrega con cantidad  1
        update = {
            $push: { products: { product: mongoose.Types.ObjectId(pid), quantity:  1 } }
        };
    }

    try {
        const cartUpdate = await cartService.updateCart(user.cart._id, update, { arrayFilters });
        
        if (cartUpdate.modifiedCount >  0) {
            res.send({ status: "success", message: "Product quantity updated in cart" });
        } else {
            res.status(400).send({ status: "error", error: "Couldn't update product quantity in cart" });
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
}

const emptyCart = async (req, res) => {
        const uid = req.user.id;
    
        const user = await userService.getBy({ _id: uid });
        if (!user || !user.cart) {
            return res.status(404).send({ status: "error", error: "User or cart not found" });
        }
    
        try {
            const cartUpdate = await cartService.emptyCart(user.cart._id);
            if (cartUpdate.modifiedCount > 0) {
                res.send({ status: "success", message: "Cart emptied" });
            } else {
                res.status(400).send({ status: "error", error: "Couldn't empty cart" });
            }
        } catch (error) {
            console.error('Error emptying cart:', error);
            res.status(500).send({ status: "error", error: "Internal server error" });
        }
}

const modifyRole = async (req, res) => {
    const { uid } = req.params;
    const { role } = req.body;

    try {
        const user = await userService.updateRole(uid, role);
        if (!user) {
            return res.status(404).json({ status: "error", error: "User not found" });
        }
        res.json({ status: "success", message: "User role updated" });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ status: "error", error: "Internal server error" });
    }
}

export { getUsers, createUser, addProductToCart, emptyCart, modifyRole}