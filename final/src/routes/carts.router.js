import { Router } from 'express';
const cartsRouter = Router();
import privatesRoutes from '../middlewares/privateRoutes.js';
//mongo
import {
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

cartsRouter.get('/mongo', getAllCarts);
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

cartsRouter.post('/mongo/:cid/purchase', privatesRoutes, buyCart);

export default cartsRouter;
