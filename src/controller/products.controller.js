// import productsDao from "../dao/mongo/index.js";
import DAO from "../dao/index.js";

// import Products from "../dao/dbManagers/products.js"

const productService = new DAO.Product();
const userService = new DAO.User();

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getProducts(req)
        res.json(products)
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: "Error al obtener productos" });
    }
};

const getProductById = async (req, res) => {
    const pid = req.params.pid

    try {
        const product = await productService.getProductById(pid)

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        const response = {
            message: "Producto encontrado",
            data: product
        }
        res.json(response)
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" })
    }
}

const createProduct = async (req, res) => {
    const uid = req.params.uid
    const user = await userService.getUserById(uid)
    if (user.role !== 'admin' && user.role !== 'premium') {
        return res.status(403).json({ error: "No tienes permisos para crear productos nuevo" })
    }

    const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'status', 'category'];
    for (let field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `El campo ${field} es requerido` });
        }
    }
    const productExists = await productService.getByCode(req.body.code)
    if (productExists) {
        return res.status(404).json({ error: "Producto existente" })
    }

    const { title, description, price, thumbnail, code, stock, status, category } = req.body;
    const ownerUser = await userService.getBy({ email: user.email }); // Adjust this line to match your actual function
    if (!ownerUser) {
        return res.status(404).json({ error: "Owner user not found" });
    }
    const owner = ownerUser._id;
    try {
        const response = await productService.createProduct({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category,
            owner
        })
        res.json({ message: "Producto agregado", data: response })
    } catch (error) {
        console.error(error); // Registra el error completo en los logs
        res.status(500).json({ error: 'Error al agregar el producto', details: error.message });
    }
}

const modifyProduct = async (req, res) => {
    const pid = req.params.pid
    const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'status', 'category'];

    // Verificar que todos los campos requeridos estan presentes en req.body
    for (let field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `El campo ${field} es requerido` });
        }
    }

    const product = req.body
    try {
        const existingProduct = await productService.getProductById(pid)
        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        if (existingProduct.owner !== req.user.email && req.user.role !== 'admin') {
            return res.status(403).json({ error: "No tienes permisos para modificar este producto" })
        }
        const response = await productService.modifyProduct(pid, product)
        res.json({ message: "Producto actualizado", data: response })
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" })
    }
}

const deleteProduct = async (req, res) => {
    const pid = req.params.pid

    try {
        const existingProduct = await productService.getProductById(pid)
        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }
        if (existingProduct.owner !== req.user.email && req.user.role !== 'admin') {
            return res.status(403).json({ error: "No tienes permisos para eliminar este producto" })
        }
        const response = await productService.deleteProduct(pid)
        res.json({ message: "Producto eliminado", data: response })
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" })
    }
}


export { getAllProducts, getProductById, createProduct, modifyProduct, deleteProduct}