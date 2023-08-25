import { Router } from 'express';
import ProductManager from '../models/ProductManager.js';
const products = new ProductManager('./src/models/products.json');
const productsRouter = Router();

//ruta base de productos /
productsRouter.get('/', async (req, res) => {
	const productos = await products.getProducts();
	if (req.query.limit) {
		const productosLimitados = await productos.slice(0, req.query.limit);
		res.status(400).send(productosLimitados);
	} else {
		res.status(400).send(productos);
	}
});
//ruta product id
productsRouter.get('/:pid', async (req, res) => {
	const id = req.params.pid;
	const producto = await products.getProductById(id);
	if (producto) {
		res.status(400).send(producto);
	}
	res.status(404).send('no se encontro el producto con ese id');
});
//ruta agregar producto nuevo
productsRouter.post('/', async (req, res) => {
	const prod = req.body;
	await products.addProduct(
		prod.title,
		prod.description,
		parseInt(prod.price),
		prod.thumbnail,
		parseInt(prod.stock),
		prod.category,
		prod.code,
	);
	res.status(400).send(prod);
});
//ruta update de producto con id especifico
productsRouter.put('/:pid', async (req, res) => {
	const prod = req.body;
	const idProd = req.params.pid;
	await products.updateProduct(
		idProd,
		prod.title,
		prod.description,
		parseInt(prod.price),
		prod.thumbnail,
		prod.code,
		parseInt(prod.stock),
		prod.category,
	);
	res.status(400).send(prod);
});

export default productsRouter;
