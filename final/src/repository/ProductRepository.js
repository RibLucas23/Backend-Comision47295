import { productModel } from '../dao/models/product.model.js';
class ProductRepository {
	//traer todos los productos / leer la base de datos
	async getAll() {
		const products = await productModel.find().lean();
		return products;
	}
	async getAllLimited(pagination) {
		const limite = pagination.limit;
		const regex = new RegExp(pagination.queryParam, 'i'); // 'i' indica que la búsqueda no distingue entre mayúsculas y minúsculas
		const filter = {
			$or: [{ category: regex }, { title: regex }],
		};
		const options = {
			page: pagination.page,
			limit: limite,
			...(pagination.sort && { sort: { price: sort } }),
			lean: true,
		};
		const products = await productModel.paginate(filter, options);

		return products;
	}

	//traigo producto por id
	async getProductById(idProducto) {
		const product = await productModel.findOne({ _id: idProducto });
		return product;
	}

	// creo  el producto
	async create(object) {
		try {
			const title = object.title;
			const description = object.description;
			const price = object.price;
			const thumbnail = object.thumbnail;
			const stock = object.stock;
			const category = object.category;
			const code = object.code;
			const owner = object.owner;
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
			const product = await productModel.create({
				title,
				description,
				price,
				thumbnail,
				stock,
				category,
				code,
				owner,
			});

			return product;
		} catch (error) {
			CustomError.createError({
				name: 'Product creatin error',
				cause: generateProductErrorInfo({
					title,
					description,
					price,
					thumbnail,
					stock,
					category,
					code,
				}),
				message: 'Error Trying to create Product',
				code: EErrors.INVALID_TYPES_ERROR,
			});
		}
	}

	// borro un producto por id
	async delete(pid, owner) {
		try {
			if (owner === 'admin') {
				console.log('delete con admin');

				const product = await productModel.deleteOne({ _id: pid });
				if (!product) {
					throw error;
				}
				return product;
			}
			const oldProd = await productModel.findById({ _id: pid });
			if (oldProd.owner !== owner) {
				logger.error('delete con owner que no es');
				throw error;
			}

			const product = await productModel.deleteOne({ _id: pid });
			if (!product) {
				throw error;
			}
			return console.log('eliminado con exito');
		} catch (error) {
			logger.error('Capa de Repository ProductManager delete()', error);
			throw error;
		}
	}
	//actualizo un producto
	async update(object) {
		try {
			const pid = object.pid;
			const title = object.title;
			const description = object.description;
			const price = object.price;
			const thumbnail = object.thumbnail;
			const stock = object.stock;
			const category = object.category;
			const code = object.code;
			const owner = object.owner;
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
			const product = await productModel.findById({ _id: pid });
			if (product.owner === 'admin' || product.owner === owner) {
				const newData = {
					pid,
					title,
					description,
					price,
					thumbnail,
					stock,
					category,
					code,
				};
				await productModel.updateOne({ _id: pid }, { $set: newData });
			}
			console.log('no tienes permisos para esto');
			throw error;
		} catch (error) {
			console.log('Capa de Repository ProductManager update()', error);
			throw error;
		}
	}
}

export default ProductRepository;
