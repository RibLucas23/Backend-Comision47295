import { Router } from 'express';
import CartManager from '../dao/db/fs/CartManager.js';
const cartsManager = new CartManager('./src/dao/db/fs/carts.json');
import ProductManager from '../dao/db/fs/ProductManager.js';
const products = new ProductManager('./src/dao/db/fs/products.json');
const cartsRouter = Router();
//mongo
import CartManagerMongo from '../dao/db/mongo/CartManagerMongo.js';
const mongoCarts = new CartManagerMongo();
//=======================================__MONGO__=============================================
cartsRouter.get('/mongo', async (req, res) => {
	try {
		const carts = await mongoCarts.getAll();
		res.status(200).send(carts);
	} catch (error) {
		console.error('error creating cart', error);
		res.status(500).json({ error: ' Internal server error' });
	}
});
cartsRouter.post('/mongo', async (req, res) => {
	try {
		const newCart = await mongoCarts.newCart();
		res.status(200).send(newCart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
});
cartsRouter.get('/mongo/:cid', async (req, res) => {
	try {
		const id = req.params.cid;
		const cart = await mongoCarts.getCartById(id);
		res.status(200).send(cart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
});
cartsRouter.post('/mongo/:cid/product/:pid', async (req, res) => {
	try {
		const id = req.params.cid;
		const pId = req.params.pid;
		const cart = await mongoCarts.addProdToCart(id, pId);
		res.status(200).send(cart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
});
cartsRouter.delete('/mongo/:cid', async (req, res) => {
	try {
		const id = req.params.cid;
		const deleteCart = await mongoCarts.delete(id);
		res.status(200).send(deleteCart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
});

//=======================================__FileSystem__=============================================
//ruta base de carts /
cartsRouter.get('/', async (req, res) => {
	const carts = await cartsManager.getAll();
	if (req.query.limit) {
		const cartsLimitados = await carts.slice(0, req.query.limit);
		res.status(200).send(cartsLimitados);
	} else {
		res.status(200).send(carts);
	}
});
//ruta cart id
cartsRouter.get('/:pid', async (req, res) => {
	let id = req.params.pid;
	id = parseInt(id);
	const cart = await cartsManager.getById(id);
	if (cart) {
		res.status(200).send(cart);
	}
	res.status(404).send('no se encontro cart con ese id');
});
//ruta agregar cart nuevo
cartsRouter.post('/', async (req, res) => {
	const cart = await cartsManager.addCart();
	res.status(200).send(cart);
});
//ruta agregar producto al carro
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
	const prod = await products.getProductById(req.params.pid);
	const idProd = parseInt(prod.id);

	const idCart = parseInt(req.params.cid);
	const cart = await cartsManager.pushProd(idCart, idProd);

	res.status(200).send(cart);
});

export default cartsRouter;
