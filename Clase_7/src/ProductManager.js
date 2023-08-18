import fs from 'fs'
class ProductManager {
    products;
    static id = 0

    constructor(path) {
        this.path = path
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            console.log(ProductManager.id)
            // creo  el producto
            const product =
            {
                title,
                description,
                price,
                thumbnail,
                stock,
                code,
                id: ProductManager.id
            }
            // valido  que esten todos los campos llenos
            if (title === undefined ||
                description === undefined ||
                price === undefined ||
                thumbnail === undefined ||
                stock === undefined ||
                code === undefined) {
                return console.log("llene todo los campos")
            }
            // valido que el code no este en uso
            if (await this.codeValidation(product.code)) {
                console.log("code ya en uso")
                throw error
            }

            // pusheo el producto al array de productos si esta todo ok
            const productos = await this.getProducts()
            await this.aumentarID()
            await productos.push(product)
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(productos, null, '\t')
            );
            console.log(ProductManager.id)

        } catch (error) {

        }
    }
    //funcion auto aumentar id
    async aumentarID() {
        ProductManager.id++
    }

    //traer todos los productos / leer la base de datos
    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.path, "utf-8")
            const arrayProducts = JSON.parse(products)
            return arrayProducts

        } catch (error) {
            console.log(error)
        }
    }
    //validacion del codigo del producto
    async codeValidation(code) {
        try {
            const products = await this.getProducts()
            const val = products.find((products) => products.code === code)
            if (val) {
                return true
            }
            return false

        } catch (error) {

        }
    }
    //traigo producto por id
    async getProductById(idProducto) {
        try {
            const contedido = await this.getProducts()
            const product = contedido.find((products) => products.id == idProducto)
            if (product) {
                return product
            }
            throw error
        } catch (error) {
            return console.log("Not found")

        }
    }

    // borro un producto por id
    async deleteProduct(idProducto) {
        try {
            const contedido = await this.getProducts()
            const arraySinProducto = contedido.filter((product) => product.id != idProducto)
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(arraySinProducto, null, '\t')
            )

        } catch (error) {
            console.log("product ID not found")
        }
    }
    //actualizo un producto
    async updateProduct(idProducto, title, description, price, thumbnail, code, stock) {
        try {
            const product = await this.getProductById(idProducto)
            console.log(product)
            product.title = title,
                product.description = description,
                product.price = price,
                product.thumbnail = thumbnail,
                product.code = code,
                product.stock = stock
            console.log(product)
            const products = await this.getProducts()
            let index = products.findIndex(prod => prod.id == product.id)
            products[index] = product
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))

        } catch (error) {
            console.log(error)
        }
    }
}


//exporto el modulo
export default ProductManager 