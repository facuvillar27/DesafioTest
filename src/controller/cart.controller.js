import DAO from "../dao/index.js";

const cartService = new DAO.Cart();
const productService = new DAO.Product();

const getAllProductsInCart = async (req, res) => {
    try {
        const carts = await cartService.getAll();
        res.json(carts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: "Error al obtener carritos" });
    }
}

const getPurchase = async (req, res) => {
    const cid = req.params.cid
    const cart = await cartService.getById(cid).populate("products")

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" })
    }

    const purchaseItems = cart.products.map(async (product) => {
        const productInDb = await productService.getProductById(product._id)

        if (productInDb.stock < product.quantity) {
            return {success: false, message: 'No hay stock suficiente para el producto', productId: product._id}
        }

        productInDb.stock -= product.quantity
        await productInDb.save()

        return {success: true, message: 'Producto comprado', productId: product._id}
    })
    const result = await Promise.all(purchaseItems)

    res.send({message: "Compra realizada", result})
}

export { getAllProductsInCart, getPurchase };