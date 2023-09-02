import { Router } from 'express';
import CartManager from '../models/CartManager.js';
const cartsManager = new CartManager('./src/models/carts.json');
import ProductManager from '../models/ProductManager.js';
const products = new ProductManager('./src/models/products.json');
const cartsRouter = Router();

//ruta base de carts /
cartsRouter.get('/', async (req, res) => {
	const carts = await cartsManager.getAll();
	if (req.query.limit) {
		const cartsLimitados = await carts.slice(0, req.query.limit);
		res.status(400).send(cartsLimitados);
	} else {
		res.status(400).send(carts);
	}
});
//ruta cart id
cartsRouter.get('/:pid', async (req, res) => {
	let id = req.params.pid;
	id = parseInt(id);
	const cart = await cartsManager.getById(id);
	if (cart) {
		res.status(400).send(cart);
	}
	res.status(404).send('no se encontro cart con ese id');
});
//ruta agregar cart nuevo
cartsRouter.post('/', async (req, res) => {
	const cart = await cartsManager.addCart();
	res.status(400).send(cart);
});
//ruta agregar producto al carro
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
	const prod = await products.getProductById(req.params.pid);
	const idProd = parseInt(prod.id);

	const idCart = parseInt(req.params.cid);
	const cart = await cartsManager.pushProd(idCart, idProd);

	res.status(400).send(cart);
});

export default cartsRouter;
