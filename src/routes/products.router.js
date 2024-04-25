import express from "express"
import { getAllProducts, getProductById, createProduct, modifyProduct, deleteProduct } from "../controller/products.controller.js"

const router = express.Router()

//get all products
router.get("/", getAllProducts)

//get product by id
router.get("/:pid", getProductById)

//create a new product
router.post("/:uid", createProduct)

//update a product
router.put("/:pid", modifyProduct)

//delete a product
router.delete("/:pid", deleteProduct)

export default router