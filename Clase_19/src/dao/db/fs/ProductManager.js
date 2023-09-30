import fs from 'fs';
class ProductManager {
	products;

	constructor(path) {
		this.path = path;
	}
	async addProduct(
		title,
		description,
		price,
		thumbnail,
		stock,
		category,
		code,
	) {
		try {
			// creo  el producto
			// valido  que esten todos los campos llenos
			if (
				title === undefined ||
				description === undefined ||
				price === undefined ||
				thumbnail === undefined ||
				stock === undefined ||
				category === undefined ||
				code === undefined
			) {
				return console.log('llene todo los campos');
			}
			console.log('product');
			const product = {
				title,
				description,
				price,
				thumbnail,
				stock,
				category,
				code,
				status: true,
				id: await this.aumentarID(),
			};
			// valido que el code no este en uso
			if (await this.codeValidation(product.code)) {
				console.log('code ya en uso');
				throw error;
			}
			// pusheo el producto al array de productos si esta todo ok
			const productos = await this.getProducts();
			await productos.push(product);
			await fs.promises.writeFile(
				this.path,
				JSON.stringify(productos, null, '\t'),
			);
		} catch (error) {}
	}
	//funcion auto aumentar id
	async aumentarID() {
		const products = await this.getProducts();
		const maxId = products.reduce(
			(max, prod) => (prod.id > max ? prod.id : max),
			0,
		);
		return maxId + 1;
	}

	//traer todos los productos / leer la base de datos
	async getProducts() {
		try {
			const products = await fs.promises.readFile(this.path, 'utf-8');
			return JSON.parse(products);
		} catch (error) {
			console.log(error);
		}
	}
	//validacion del codigo del producto
	async codeValidation(code) {
		try {
			const products = await this.getProducts();

			const val = products.find((products) => products.code === code);
			if (val) {
				return true;
			}
			return false;
		} catch (error) {}
	}
	//traigo producto por id
	async getProductById(idProducto) {
		try {
			const contedido = await this.getProducts();
			const product = contedido.find(
				(products) => products.id == idProducto,
			);
			if (product) {
				return product;
			}
			throw error;
		} catch (error) {
			return console.log('Not found');
		}
	}

	// borro un producto por id
	async deleteProduct(idProducto) {
		try {
			const contedido = await this.getProducts();
			const arraySinProducto = contedido.filter(
				(product) => product.id != idProducto,
			);
			await fs.promises.writeFile(
				this.path,
				JSON.stringify(arraySinProducto, null, '\t'),
			);
		} catch (error) {
			console.log('product ID not found');
		}
	}
	//actualizo un producto
	async updateProduct(
		idProducto,
		title,
		description,
		price,
		thumbnail,
		code,
		stock,
		category,
	) {
		try {
			const product = await this.getProductById(idProducto);
			console.log(product);
			(product.title = title),
				(product.description = description),
				(product.price = price),
				(product.thumbnail = thumbnail),
				(product.code = code),
				(product.stock = stock);
			product.category = category;
			console.log(product);
			const products = await this.getProducts();
			let index = products.findIndex((prod) => prod.id == product.id);
			products[index] = product;
			await fs.promises.writeFile(
				this.path,
				JSON.stringify(products, null, '\t'),
			);
		} catch (error) {
			console.log(error);
		}
	}
}

//exporto el modulo
export default ProductManager;
