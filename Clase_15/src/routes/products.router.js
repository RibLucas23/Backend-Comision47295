import { Router } from 'express';
import ProductManager from '../dao/db/fs/ProductManager.js';
const products = new ProductManager('./src/dao/db/fs/products.json');
const productsRouter = Router();

//mongo
import ProductsManagerMongo from '../dao/db/mongo/ProductManagerMongo.js';
const mongoProducts = new ProductsManagerMongo();

//=======================================__MONGO__=============================================
//GET ALL
productsRouter.get('/mongo', async (req, res) => {
	const productsAll = await mongoProducts.getAll();
	res.status(200).render('productsMongo', { productsAll });
});

//CREATE PRODUCT
productsRouter.post('/mongo', async (req, res) => {
	try {
		const { title, description, price, thumbnail, stock, category, code } =
			req.body;
		const product = await mongoProducts.create(
			title,
			description,
			price,
			thumbnail,
			stock,
			category,
			code,
		);
		const productsAll = await mongoProducts.getAll();
		res.status(200).render('productsMongo', { productsAll });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
});
// GET PRODUCT BY ID
productsRouter.get('/mongo/:pid', async (req, res) => {
	try {
		const id = req.params.pid;
		const product = await mongoProducts.getProductById(id);
		res.status(200).send(product);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
});
//DELETE PRODUCT
productsRouter.delete('/mongo/:pid', async (req, res) => {
	try {
		const id = req.params.pid;
		const product = await mongoProducts.delete(id);
		res.status(200).send(product);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
});
//UPDATE PRODUCT
productsRouter.put('/mongo/:pid', async (req, res) => {
	try {
		const id = req.params.pid;
		const { title, description, price, thumbnail, stock, category, code } =
			req.body;
		const product = await mongoProducts.update(
			id,
			title,
			description,
			price,
			thumbnail,
			stock,
			category,
			code,
		);
		res.status(200).send(product);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
});

//=======================================__FileSystem__=============================================

//ruta base de productos /
productsRouter.get('/', async (req, res) => {
	const productos = await products.getProducts();
	if (req.query.limit) {
		const productosLimitados = await productos.slice(0, req.query.limit);
		res.status(200).send(productosLimitados);
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
