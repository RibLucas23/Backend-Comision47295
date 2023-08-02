class ProductManager {
    products;
    static id = 0

    constructor() {
        this.products = []
    }
    addProduct(title, description, price, thumbnail, code, stock) {
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
        if (this.codeValidation(product.code)) {
            return console.log("code ya en uso")
        }

        // pusheo el producto al array de productos si esta todo ok
        this.products.push(product)
        ProductManager.id++
    }

    getProducts() {
        console.log(this.products)
    }
    codeValidation(code) {
        const val = this.products.find((products) => products.code === code)
        if (val) {
            return true
        }
    }
    getProductById(idProducto) {
        const res = this.products.find((products) => products.id == idProducto)
        if (res) {
            return console.log(res)
        }
        return console.log("Not found")
    }
}

const productManager = new ProductManager()
productManager.addProduct("mesa", "mesa gamer", 222, "asd", 343, 10)
// productManager.addProduct("mesa", "mesa gamer", 222, "asd", 343, 10)
productManager.addProduct("mesaza", "mesaza gamer", 3332, "asd", 10, 5)

// productManager.getProducts()
productManager.getProductById(1)
// productManager.getProductById(2)