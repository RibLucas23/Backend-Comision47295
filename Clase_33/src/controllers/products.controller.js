import ProductsManagerMongo from '../dao/db/mongo/ProductManagerMongo.js';
import ProductManager from '../dao/db/fs/ProductManager.js';
import productFaker from '../service/FakerMockService.js';
const FSProdManager = new ProductManager('./src/dao/db/fs/products.json');
const mongoProducts = new ProductsManagerMongo();

//GET ALL
export const getAllProducts = async (req, res) => {
	const userUser = req.session.username;
	const userRol = req.session.rol;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const sort = req.query.sort || '';
	const query = req.query.query || '';
	const productsAll = await mongoProducts.getAllLimited(
		page,
		limit,
		sort,
		query,
	);
	productsAll.prevLink = productsAll.hasPrevPage
		? `http://localhost:8080/api/products/mongo?page=${productsAll.prevPage}`
		: '';
	productsAll.nextLink = productsAll.hasNextPage
		? `http://localhost:8080/api/products/mongo?page=${productsAll.nextPage}`
		: '';
	productsAll.isValid = !(page <= 0 || page > productsAll.totalPages);
	const responseDto = {
		status: 'success',
		payload: productsAll.docs,
		totalDocs: productsAll.totalDocs,
		limit: productsAll.limit,
		totalPages: productsAll.totalPages,
		page: productsAll.page,
		pagingCounter: productsAll.pagingCounter,
		hasPrevPage: productsAll.hasPrevPage,
		hasNextPage: productsAll.hasNextPage,
		prevPage: productsAll.prevPage,
		nextPage: productsAll.nextPage,
		prevLink: productsAll.prevLink,
		nextLink: productsAll.nextLink,
		isValid: productsAll.isValid,
	};
	res.status(200).render('productsMongo', { responseDto, userUser, userRol });
};

//CREATE PRODUCT
export const createProduct = async (req, res) => {
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
};

// GET PRODUCT BY ID
export const getById = async (req, res) => {
	try {
		const id = req.params.pid;
		const product = await mongoProducts.getProductById(id);
		res.status(200).send(product);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
};

//DELETE PRODUCT
export const deleteProduct = async (req, res) => {
	try {
		const id = req.params.pid;
		const product = await mongoProducts.delete(id);
		res.status(200).send(product);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
};

//UPDATE PRODUCT
export const updateProduct = async (req, res) => {
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
};
//MOCKING PRODUCTs
export const mockingProducts = async (req, res) => {
	try {
		const product = productFaker;
		await mongoProducts.create(
			product.title,
			product.description,
			product.price,
			product.thumbnail,
			product.stock,
			product.category,
			product.code,
		);
		res.status(200).send(product);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
};
//=======================================__FileSystem__=============================================

//GET ALL
export const FSgetAll = async (req, res) => {
	try {
		console.log('productos');
		const productos = await FSProdManager.getProducts();
		if (req.query.limit) {
			const productosLimitados = await productos.slice(0, req.query.limit);
			res.status(200).send(productosLimitados);
		} else {
			res.status(400).send(productos);
		}
	} catch (error) {
		res.status(500).json({ error: ' Internal server error' });
	}
};
//GET BY ID
export const FSgetById = async (req, res) => {
	try {
		const id = req.params.pid;
		const producto = await FSProdManager.getProductById(id);
		if (producto) {
			res.status(400).send(producto);
		}
		res.status(404).send('no se encontro el producto con ese id');
	} catch (error) {
		res.status(500).json({ error: ' Internal server error' });
	}
};
//CREATE
export const FSCreate = async (req, res) => {
	try {
		const prod = req.body;
		await FSProdManager.addProduct(
			prod.title,
			prod.description,
			parseInt(prod.price),
			prod.thumbnail,
			parseInt(prod.stock),
			prod.category,
			prod.code,
		);
		res.status(400).send(prod);
	} catch (error) {
		res.status(500).json({ error: ' Internal server error' });
	}
};
//UPDATE
export const FSUpdate = async (req, res) => {
	try {
		const prod = req.body;
		const idProd = req.params.pid;
		await FSProdManager.updateProduct(
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
	} catch (error) {
		res.status(500).json({ error: ' Internal server error' });
	}
};
