import { Router } from 'express';
const productsRouter = Router();
import privatesRoutes from '../middlewares/privateRoutes.js';
import adminRoutes from '../middlewares/adminRoutes.js';
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getById,
	updateProduct,
	mockingProducts,
} from '../controllers/products.controller.js';
import premiumValidator from '../middlewares/premiumValidator.js';

//=======================================__MONGO__=============================================
//GET ALL
productsRouter.get('/mongo', privatesRoutes, getAllProducts);
//GENERATE FAKER PRODUCTS
productsRouter.get('/mongo/mockingproducts', adminRoutes, mockingProducts);
//CREATE PRODUCT
productsRouter.post('/mongo', premiumValidator, createProduct);
// GET PRODUCT BY ID
productsRouter.get('/mongo/:pid', privatesRoutes, getById);
//DELETE PRODUCT
productsRouter.delete('/mongo/:pid', premiumValidator, deleteProduct);
//UPDATE PRODUCT
productsRouter.put('/mongo/:pid', premiumValidator, updateProduct);

export default productsRouter;
