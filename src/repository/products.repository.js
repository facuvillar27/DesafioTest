export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getAllProducts() {
        const result = await this.dao.getAll()
        return result
    }

    async createProduct (product) {
        const result = await this.dao.create(product)
        return result
    }

    async modifyProduct (id, product) {
        const result = await this.dao.modify(id, product)
        return result
    }

    async deleteProduct (id) {
        const result = await this.dao.delete(id)
        return result
    }
}
// import ProductsDTO from '../dao/DTO/product.js';

// export default class ProductsRepository {
//     constructor(dao) {
//         this.dao = dao
//     }

//     async getProducts() {
//         const result = await this.dao.get()
//         return result
//     }

//     async createProduct (product) {
//         const newProduct = new ProductsDTO(product)
//         const result = await this.dao.create(newProduct)
//         return result
//     }

//     async modifyProduct (id, product) {
//         const result = await this.dao.modify(id, product)
//         return result
//     }

//     async deleteProduct (id) {
//         const result = await this.dao.delete(id)
//         return result
//     }
// }