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
		const title = object.title;
		const description = object.description;
		const price = object.price;
		const thumbnail = object.thumbnail;
		const stock = object.stock;
		const category = object.category;
		const code = object.code;

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
	}

	// borro un producto por id
	async delete(pid) {
		const product = await productModel.deleteOne({ _id: pid });
		return product;
	}
	//actualizo un producto
	async update(object) {
		const pid = object.pid;
		const title = object.title;
		const description = object.description;
		const price = object.price;
		const thumbnail = object.thumbnail;
		const stock = object.stock;
		const category = object.category;
		const code = object.code;

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
	}
}

export default ProductRepository;
