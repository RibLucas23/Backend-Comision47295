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
		res.status(200).render('carts', { carts });
	} catch (error) {
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
		const cartProducts = cart.productos;
		// console.log(cartProducts);
		res.status(200).render('cartDetail', { cartProducts, id });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
});

cartsRouter.put('/mongo/:cid/product/:pid', async (req, res) => {
	try {
		const id = req.params.cid;
		const pId = req.params.pid;
		let pQuantity = parseInt(req.body.pQuantity);
		if (!req.body.pQuantity) {
			pQuantity = 1;
		}
		const cart = await mongoCarts.addProdToCart(id, pId, pQuantity);
		res.status(200).send(cart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
});
cartsRouter.delete('/mongo/:cid', async (req, res) => {
	try {
		const deleteCart = req.query.deleteCart;
		const id = req.params.cid;
		console.log(deleteCart);

		if (deleteCart === 'delete') {
			console.log('entro a delete');
			const cart = await mongoCarts.delete(id);
			return res.status(200).send(cart);
		}
		console.log('no entro a delete');

		const emptyCart = await mongoCarts.emptyCart(id);
		return res.status(200).send(emptyCart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
});

cartsRouter.put('/mongo/:cid', async (req, res) => {
	try {
		const id = req.params.cid;
		const newArray = req.body;
		const cart = await mongoCarts.updateCart(id, newArray);
		res.status(200).send(cart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
});
cartsRouter.delete('/mongo/:cid/product/:pid', async (req, res) => {
	try {
		const cId = req.params.cid;
		const pId = req.params.pid;
		const deleteCart = await mongoCarts.deleteProduct(cId, pId);
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
