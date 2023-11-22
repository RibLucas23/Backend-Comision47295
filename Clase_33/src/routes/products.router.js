import { Router } from 'express';
const productsRouter = Router();
import privatesRoutes from '../middlewares/privateRoutes.js';
import adminRoutes from '../middlewares/adminRoutes.js';
import {
	FSCreate,
	FSUpdate,
	FSgetAll,
	FSgetById,
	createProduct,
	deleteProduct,
	getAllProducts,
	getById,
	updateProduct,
	mockingProducts,
} from '../controllers/products.controller.js';

//=======================================__MONGO__=============================================
//GET ALL
productsRouter.get('/mongo', getAllProducts);
//GENERATE FAKER PRODUCTS
productsRouter.get('/mongo/mockingproducts', mockingProducts);
//CREATE PRODUCT
productsRouter.post('/mongo', adminRoutes, createProduct);
// GET PRODUCT BY ID
productsRouter.get('/mongo/:pid', privatesRoutes, getById);
//DELETE PRODUCT
productsRouter.delete('/mongo/:pid', adminRoutes, deleteProduct);
//UPDATE PRODUCT
productsRouter.put('/mongo/:pid', adminRoutes, updateProduct);
//=======================================__FileSystem__=============================================

//ruta base de productos /
productsRouter.get('/', privatesRoutes, FSgetAll);
//ruta product id
productsRouter.get('/:pid', privatesRoutes, FSgetById);
//ruta agregar producto nuevo
productsRouter.post('/', adminRoutes, FSCreate);
//ruta update de producto con id especifico
productsRouter.put('/:pid', adminRoutes, FSUpdate);

export default productsRouter;
