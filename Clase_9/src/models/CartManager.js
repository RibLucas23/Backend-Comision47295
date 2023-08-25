import fs from 'fs';

class CartManager {
	constructor(path) {
		this.path = path;
	}
	//aumento Id statica
	async aumentarID() {
		const carts = await this.getAll();
		const maxId = carts.reduce(
			(max, cart) => (cart.id > max ? cart.id : max),
			0,
		);
		return maxId + 1;
	}
	//leeo el archivo Json y lo parseo ( transformo en objeto)
	async getAll() {
		try {
			const carts = await fs.promises.readFile(this.path, 'utf-8');
			return JSON.parse(carts);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	//escribir el json
	async writeJson(newData) {
		try {
			await fs.promises.writeFile(
				this.path,
				JSON.stringify(newData, null, '\t'),
			);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	//agregar carro nuevo
	async addCart() {
		try {
			const newCart = {
				productos: [],
				id: await this.aumentarID(),
			};
			const arrayCarts = await this.getAll();
			arrayCarts.push(newCart);
			await this.writeJson(arrayCarts);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	// Obtiene un carrito por su ID
	async getById(id) {
		try {
			const arrayCarts = await this.getAll();
			const cart = arrayCarts.find((cart) => cart.id === id);
			return cart;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	//agregar producto a carro con Id especifica
	async pushProd(cartId, productid) {
		try {
			const arrayCarts = await this.getAll();
			const indexCart = arrayCarts.findIndex((cart) => cart.id === cartId);
			if (indexCart === -1) {
				throw new Error('Carrito no encontrado');
			}
			const cart = carts[indexCart];
			const existingProduct = cart.productos.find(
				(product) => product.productid === productid,
			);
			if (!existingProduct) {
				const newProduct = {
					productid: productid,
					quantity: 1,
				};
				cart.productos.push(newProduct);
			} else {
				existingProduct.quantity++;
			}

			arrayCarts[indexCart].productos[indexOldProd].quantity++;
			return await this.writeJson(arrayCarts);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	// Elimina un carrito por su ID
	async deleteCart(idCart) {
		try {
			const arrayCarts = await this.getAll();
			const newArrayCarts = arrayCarts.filter((carts) => carts.id != idCart);
			await this.writeJson(newArrayCarts);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	// Elimina un producto de un carrito por su ID de carrito e ID de producto
	async deleteProdOfCart(idCart, idProduct) {
		try {
			const arrayCarts = await this.getAll();
			const indexCart = arrayCarts.findIndex((cart) => cart.id === idCart);
			if (indexCart === -1) {
				throw new Error('Carrito no encontrado');
			}

			const cart = carts[indexCart];
			cart.productos = cart.productos.filter(
				(product) => product.productid !== idProduct,
			);

			await this.writeJson(arrayCarts);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	//eliminar producto de un carro
	async deleteProductFromCart(cartId, productId, quantityToDelete = true) {
		try {
			const arrayCarts = await this.getAll();
			const indexCart = arrayCarts.findIndex((cart) => cart.id === cartId);
			console.log(quantityToDelete);
			if (indexCart === -1) {
				throw new Error('Carrito no encontrado');
			}

			const cart = arrayCarts[indexCart];
			const product = cart.productos.find(
				(product) => product.productid === productId,
			);

			if (!product) {
				throw new Error('Producto no encontrado en el carrito');
			}

			if (quantityToDelete === true) {
				// Si la cantidad a no se estipula, eliminar el producto completamente.
				cart.productos = cart.productos.filter(
					(p) => p.productid !== productId,
				);
			} else if (product.quantity <= quantityToDelete) {
				// Si la cantidad a eliminar es mayor o igual a la cantidad en el carrito, eliminar el producto completamente.
				cart.productos = cart.productos.filter(
					(p) => p.productid !== productId,
				);
			} else {
				// Reducir la cantidad del producto en el carrito en lugar de eliminarlo completamente.
				product.quantity -= quantityToDelete;
			}

			await this.writeJson(arrayCarts);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
// const prod = {
// 	title: 'sillaza',
// 	description: 'sillaza ',
// 	price: 232323,
// 	thumbnail: 'asd',
// 	stock: 485,
// 	code: 3495432259,
// 	id: 4,
// };

export default CartManager;
