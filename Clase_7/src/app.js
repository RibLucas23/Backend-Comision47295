
//importo express
import express, { response } from "express"
//importo el productManager y lo configuro
import ProductManager from "./ProductManager.js"
const products = new ProductManager("./src/products.json")

//instancio el sv con express
const app = express()
app.use(express.urlencoded({ extended: true }))

//ruta principal
app.get("/", async (req, res) => {
    // res.send("asd")
    const asd = `<a href="/products">productos</a><br>
    <a href="/products/?limit=1">productos con limte 1</a><br>
    <a href="/products/?limit=2">productos con limte 2</a><br>
    <a href="/products/?limit=3">productos con limte 3</a><br>
    <a href="/products/0">producto 0</a><br>
    <a href="/products/1">producto 1</a><br>
    <a href="/products/2">producto 2</a>`
    res.send(asd)
})
//ruta products
app.get('/products', async (req, res) => {
    console.log(req.query)
    const productos = await products.getProducts()
    if (req.query.limit) {
        const productosLimitados = await productos.slice(0, req.query.limit)
        res.send(productosLimitados)
    } else {
        res.send(productos);
    }
});
//ruta product id
app.get('/products/:pid', async (req, res) => {
    const id = req.params.pid
    const producto = await products.getProductById(id)
    res.send(producto);
});


//levanto el servidor
const PORT = 8080
app.listen(PORT, () => console.log(`servidor corriendo en http://localhost:${PORT}/ `))