import { productModel } from '../../models/product.model.js';

class ProductsManagerMongo {
	//traer todos los productos / leer la base de datos
	async getAll() {
		const products = await productModel.find().lean();
		return products;
	}
	async getAllLimited(page, limit, sort, queryParam) {
		const limite = limit;
		console.log(queryParam);
		const regex = new RegExp(queryParam, 'i'); // 'i' indica que la búsqueda no distingue entre mayúsculas y minúsculas
		const filter = {
			$or: [{ category: regex }, { title: regex }],
		};
		const options = {
			page,
			limit: limite,
			...(sort && { sort: { price: sort } }),
			lean: true,
		};

		const products = await productModel.paginate(filter, options);

		return products;
	}
	//traigo producto por id
	async getProductById(idProducto) {
		try {
			const product = await productModel.findOne({ _id: idProducto });
			if (!product) {
				throw error;
			}
			return product;
		} catch (error) {
			return console.log('Not found');
		}
	}

	// creo  el producto
	async create(title, description, price, thumbnail, stock, category, code) {
		try {
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
			});

			return product;
		} catch (error) {
			return console.log('llene todos los campos');
		}
	}

	// borro un producto por id
	async delete(pid) {
		try {
			const product = await productModel.deleteOne({ _id: pid });
			if (!product) {
				throw error;
			}
			return product;
		} catch (error) {
			return console.log('Not found');
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
	) {
		try {
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
			const newData = {
				title,
				description,
				price,
				thumbnail,
				code,
				stock,
				category,
			};
			const newProduct = await productModel.updateOne(
				{ _id: pid },
				{ $set: newData },
			);

			return newProduct;
		} catch (error) {
			console.log('verifique los datos');
		}
	}
}

export default ProductsManagerMongo;
