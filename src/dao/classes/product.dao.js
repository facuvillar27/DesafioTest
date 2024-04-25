import productModel from "../models/products.model.js";

class Product {

    async getAllProducts () {
        try {
            const products = await productModel.find().lean()
            return products
        }catch (error) {
            console.error('Error getting products:', error)
        }
    }

    async getProducts(req) {
        try {
            const result = await this.getFilteredProducts(req)
            const response = this.prepareResponse(req, result)
            return response
        } catch (error) {
            console.error('Error getting products:', error)
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findById(id)
            return product
        } catch (error) {
            console.error('Error getting product by id:', error)
        }
    }

    async createProduct(product) {
        try {
            const newProduct = new productModel(product)
            await newProduct.save()
            return newProduct
        } catch (error) {
            console.error('Error saving product:', error)
        }
    }


    async modifyProduct(id, product) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate
                (id, product, { new: true })
            return updatedProduct
        } catch (error) {
            console.error('Error updating product:', error)
        }
    }

    async deleteProduct(id) {
        try {
            const result = await productModel.findByIdAndDelete(id)
            return result
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    buildFilter(query) {
        let filter = {};
        for (let key in query) {
            if (['code', 'status', 'price', 'stock', 'description', 'title'].includes(key)) {
                filter[key] = query[key];
            }
        }
        return filter;
    }

    buildSortOptions(sort) {
        let sortOptions = {};
        if (sort.toLowerCase() === 'asc') {
            sortOptions = { price: 1 };
        } else if (sort.toLowerCase() === 'desc') {
            sortOptions = { price: -1 };
        }
        return sortOptions;
    }

    buildOptions(page, limit, sortOptions) {
        return {
            page: page,
            limit: limit,
            sort: sortOptions,
            populate: ''
        };
    }

    prepareResponse(req, result) {
        const limit = parseInt(req.query.limit) || 10;
        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevPage ? `localhost:${PORT}/api/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.nextPage ? `localhost:${PORT}/api/products?page=${result.nextPage}&limit=${limit}` : null,
        };
        return response;
    }

    async getFilteredProducts(req) {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || '';
        const query = req.query.query || '';
        const stock = parseInt(req.query.stock) || 0;

        let filter = this.buildFilter(req.query);
        let sortOptions = this.buildSortOptions(sort);
        let options = this.buildOptions(page, limit, sortOptions);

        return await productModel.paginate(filter, options);
    }

    async getByCode(code) {
        let product = await productModel.findOne({ code: code }).lean()
        return product
    }
}

export default Product