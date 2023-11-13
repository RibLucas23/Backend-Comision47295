import { Router } from 'express';
import CartManager from '../dao/db/fs/CartManager.js';
const cartsRouter = Router();
import privatesRoutes from '../middlewares/privateRoutes.js';
//mongo
import {
	FSCreate,
	FSPushCart,
	FSgetAllCarts,
	FSgetById,
	addProductToCart,
	buyCart,
	createCart,
	deleteCart,
	deleteProductFromCart,
	getAllCarts,
	getCartById,
	updateCart,
} from '../controllers/carts.controller.js';
//======================================__MONGO__=============================================
//
cartsRouter.get('/mongo', privatesRoutes, getAllCarts);
cartsRouter.post('/mongo', privatesRoutes, createCart);
cartsRouter.get('/mongo/:cid', privatesRoutes, getCartById);

cartsRouter.put('/mongo/:cid/product/:pid', privatesRoutes, addProductToCart);
cartsRouter.delete('/mongo/:cid', privatesRoutes, deleteCart);

cartsRouter.put('/mongo/:cid', privatesRoutes, updateCart);
cartsRouter.delete(
	'/mongo/:cid/product/:pid',
	privatesRoutes,
	deleteProductFromCart,
);

cartsRouter.get('/mongo/:cid/purchase', privatesRoutes, buyCart);
//=======================================__FileSystem__=============================================
cartsRouter.get('/', privatesRoutes, FSgetAllCarts);
cartsRouter.get('/:pid', privatesRoutes, FSgetById);
cartsRouter.post('/', privatesRoutes, FSCreate);
cartsRouter.post('/:cid/product/:pid', privatesRoutes, FSPushCart);

export default cartsRouter;
