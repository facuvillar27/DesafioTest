import express from "express"
const router = express.Router()
import { getAllProductsInCart, getPurchase } from "../controller/cart.controller.js"

router.get("/", getAllProductsInCart);

router.post("/cid/purchase", getPurchase)
    


export default router