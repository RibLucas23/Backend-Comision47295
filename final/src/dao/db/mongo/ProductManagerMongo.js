import ProductRepository from '../../../repository/ProductRepository.js';
const productRepository = new ProductRepository();
class ProductsManagerMongo {
	//traer todos los productos / leer la base de datos
	async getAll() {
		const products = await productRepository.getAll();
		return products;
	}
	async getAllLimited(page, limit, sort, queryParam) {
		const products = await productRepository.getAllLimited({
			page,
			limit,
			sort,
			queryParam,
		});

		return products;
	}
	//traigo producto por id
	async getProductById(idProducto) {
		try {
			const product = await productRepository.getProductById(idProducto);
			if (!product) {
				throw error;
			}
			return product;
		} catch (error) {
			console.log('Capa de  ProductManager getProductById()', error);
			throw error;
		}
	}

	// creo  el producto
	async create(product) {
		try {
			await productRepository.create(product);
			return product;
		} catch (error) {
			console.log('Capa de ProductManager create()', error);
			throw error;
		}
	}

	// borro un producto por id
	async delete(pid, owner) {
		try {
			await productRepository.delete(pid, owner);
		} catch (error) {
			console.log('Capa de Controllador ProductManager delete()', error);
			throw error;
		}
	}

	//actualizo un producto
	async update(
		pid,
		title,
		description,
		price,
		thumbnail,
		stock,
		category,
		code,
		owner,
	) {
		try {
			await productRepository.update({
				pid,
				title,
				description,
				price,
				thumbnail,
				stock,
				category,
				code,
				owner,
			});
		} catch (error) {
			console.log('Capa de  ProductManager update()', error);
			throw error;
		}
	}

	// creo  el producto
	async pruebaProduct(producto) {
		try {
			console.log(producto);
		} catch (error) {
			console.log('Capa de ProductManager create()', error);
			throw error;
		}
	}
}

export default ProductsManagerMongo;
