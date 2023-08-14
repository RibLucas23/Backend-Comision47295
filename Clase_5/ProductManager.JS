const { error } = require('console');
const fs = require('fs');

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
    async aumentarID() {
        ProductManager.id++
    }

    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.path, "utf-8")
            const arrayProducts = JSON.parse(products)
            // console.log(arrayProducts)
            return arrayProducts

        } catch (error) {
            console.log(error)
        }
    }
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

    async deleteProduct(idProducto) {
        try {
            const contedido = await this.getProducts()
            const arraySinProducto = contedido.filter((product) => product.id != idProducto)
            await fs.promises.writeFile(this.path, JSON.stringify(arraySinProducto, null, '\t'))

        } catch (error) {
            console.log("product ID not found")
        }
    }
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

const productManager = new ProductManager("./products.json")



const funcionAsync = async () => {
    const productManager = new ProductManager("./products.json")
    // await productManager.addProduct("mesa", "mesa gamer", 222, "asd", 345563, 10)
    // await productManager.addProduct("mesaza", "mesaza gamer", 3332, "asd", 15550, 5)
    // await productManager.addProduct("mesazaza", "mesaza gamer", 33322, "asd", 16520, 5)
    await productManager.updateProduct(2, "mesita", "mesita gamer", 32, "asddas", 22, 56)


};

funcionAsync();