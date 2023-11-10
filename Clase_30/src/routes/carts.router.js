import { Router } from 'express';
import CartManager from '../dao/db/fs/CartManager.js';
const cartsManager = new CartManager('./src/dao/db/fs/carts.json');
import ProductManager from '../dao/db/fs/ProductManager.js';
const products = new ProductManager('./src/dao/db/fs/products.json');
const cartsRouter = Router();
import privatesRoutes from '../middlewares/privateRoutes.js';
import adminRoutes from '../middlewares/adminRoutes.js';
//mongo
import {
	addProductToCart,
	createCart,
	deleteCart,
	deleteProductFromCart,
	getAllCarts,
	getCartById,
	getCartById2,
	updateCart,
} from '../controllers/carts.controller.js';
import CartManagerMongo from '../dao/db/mongo/CartManagerMongo.js';
const CartMongo = new CartManagerMongo();
//======================================__MONGO__=============================================
//
cartsRouter.get('/mongo', getAllCarts);
cartsRouter.post('/mongo', privatesRoutes, createCart);
cartsRouter.get('/mongo/:cid', getCartById);

cartsRouter.put('/mongo/:cid/product/:pid', privatesRoutes, addProductToCart);
cartsRouter.delete('/mongo/:cid', privatesRoutes, deleteCart);

cartsRouter.put('/mongo/:cid', privatesRoutes, updateCart);
cartsRouter.delete('/mongo/:cid/product/:pid', deleteProductFromCart);
cartsRouter.get('/asd/:cid', async (req, res) => {
	const id = req.params.cid;
	const user = req.session.email;
	const ticket = await CartMongo.buyCart(id, user);
	res.status(200).send(ticket);
});

cartsRouter.get('/mongoo/:cid', getCartById2);
cartsRouter.get('/mongo/:cid/purchase', async (req, res) => {
	const id = req.params.cid;
	const user = req.session.email;
	const ticket = await CartMongo.buyCart(id, user);

	res.status(200).render('ticketDetail', { ticket });
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
