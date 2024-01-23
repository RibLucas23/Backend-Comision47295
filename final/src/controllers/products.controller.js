import ProductsManagerMongo from '../dao/db/mongo/ProductManagerMongo.js';
import productFaker from '../service/FakerMockService.js';
const mongoProducts = new ProductsManagerMongo();
import { logger } from '../utils/logger.js';
import { sendEmail } from '../service/MailService.js';
//GET ALL
export const getAllProducts = async (req, res) => {
	try {
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

		res.status(200).json({
			responseDto,
			userUser,
			userRol,
		});
	} catch (error) {
		logger.error(' error getting products ', error);
		res.status(500).json({ error: ' Internal server error' });
	}
};

//CREATE PRODUCT
export const createProduct = async (req, res) => {
	try {
		const { title, description, price, thumbnail, stock, category, code } =
			req.body;
		if (
			!title ||
			!description ||
			!price ||
			!thumbnail ||
			!stock ||
			!category ||
			!code
		) {
			throw error;
		}
		const user = req.session.rol;
		const product = {
			title,
			description,
			price,
			thumbnail,
			stock,
			category,
			code,
		};

		if (user === 'premium') {
			product.owner = req.session.email;
			await mongoProducts.create(product);
			const productsAll = await mongoProducts.getAll();
			res.status(200).render('productsMongo', { productsAll });
		}
		if (user === 'admin') {
			product.owner = 'admin';
			await mongoProducts.create(product);
			const productsAll = await mongoProducts.getAll();
			res.status(200).render('productsMongo', { productsAll });
		}
	} catch (error) {
		logger.error(' error creating product ', error);
		res.status(500).json({ error: ' Internal server error' });
	}
};

// GET PRODUCT BY ID
export const getById = async (req, res) => {
	try {
		console.log('asd');
		const id = req.params.pid;
		const product = await mongoProducts.getProductById(id);
		console.log(product);
		res.status(200).send(product);
	} catch (error) {
		logger.error(' error getting product ', error);
		res.status(500).json({ error: ' Internal server error' });
	}
};

//DELETE PRODUCT
export const deleteProduct = async (req, res) => {
	try {
		const id = req.params.pid;
		const product = await mongoProducts.getProductById(id);
		const textForMail = 'tu producto ha sido eliminado';
		const subject = 'eliminacion de producto';
		if (req.session.rol === 'admin') {
			const oldProduct = await mongoProducts.delete(id, req.session.rol);
			await sendEmail(product.owner, textForMail, subject);
			res.status(200).send('producto eliminado');
		}
		if (req.session.rol === 'premium') {
			const owner = req.session.email;
			const oldProduct = await mongoProducts.delete(id, owner);
			await sendEmail(product.owner, textForMail, subject);

			res.status(200).send('producto eliminado');
		}
	} catch (error) {
		logger.error(' error deleting product ', error);
		res.status(500).json({ error: ' Internal server error' });
	}
};

//UPDATE PRODUCT
export const updateProduct = async (req, res) => {
	try {
		const id = req.params.pid;
		const { title, description, price, thumbnail, stock, category, code } =
			req.body;
		if (req.session.rol === 'premium') {
			const owner = req.session.email;
			const product = await mongoProducts.update(
				id,
				title,
				description,
				price,
				thumbnail,
				stock,
				category,
				code,
				owner,
			);
			res.status(200).send('product update ok');
		}
		if (req.session.rol === 'admin') {
			const owner = 'admin';
			const product = await mongoProducts.update(
				id,
				title,
				description,
				price,
				thumbnail,
				stock,
				category,
				code,
				owner,
			);
			res.status(200).send('product update ok');
		}
	} catch (error) {
		logger.error(' error updating product ', error);
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
		logger.error(' error mocking products ', error);
		res.status(500).json({ error: ' Internal server error' });
	}
};
