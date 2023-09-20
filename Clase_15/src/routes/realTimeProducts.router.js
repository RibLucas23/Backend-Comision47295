import { Router } from 'express';
import ProductManager from '../dao/db/fs/ProductManager.js';
const products = new ProductManager('./src/dao/db/fs/products.json');
const realTimeProducts = Router();

realTimeProducts.get('/', async (req, res) => {
	const productsAll = await products.getProducts();
	res.render('realTimeProducts', { productsAll });
});
// realTimeProducts.post('/', async (req, res) => {
// 	const prod = req.body;
// 	await products.addProduct(
// 		prod.title,
// 		prod.description,
// 		parseInt(prod.price),
// 		prod.thumbnail,
// 		parseInt(prod.stock),
// 		prod.category,
// 		prod.code,
// 	);
// 	res.render('realTimeProducts', { productsAll });
// });
export default realTimeProducts;
