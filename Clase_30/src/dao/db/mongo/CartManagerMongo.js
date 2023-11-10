import { cartModel } from '../../models/cart.model.js';
import { productModel } from '../../models/product.model.js';
import { ticketModel } from '../../models/ticket.model.js';
import ProductsManagerMongo from './ProductManagerMongo.js';
const productsManager = new ProductsManagerMongo();
class CartManagerMongo {
	//CREO EL CART
	async newCart() {
		try {
			const newCart = [];
			await cartModel.create({ newCart });
			return newCart;
		} catch (error) {
			console.log('Capa de Controllador CartManager newCart()', error);
			throw new Error();
		}
	}

	//TRAIGO TODOS LOS CARTS
	async getAll() {
		const carts = await cartModel.find().lean();
		return carts;
	}
	//TRAIGO CART CON ID ESPESIFICO
	async getCartById(idCart) {
		try {
			const cart = await cartModel
				.findOne({ _id: idCart })
				.populate('productos.product')
				.lean();
			if (!cart) {
				throw new Error();
			}
			return cart;
		} catch (error) {
			console.log('Capa de Controllador CartManager getCartById', error);
			throw new Error();
		}
	}
	//UPDATE CART
	async updateCart(idCart, newCart) {
		try {
			// console.log(newCart);

			console.log(newCart.productos);
			const cart = await cartModel.updateOne(
				{ _id: idCart }, // Criterio de búsqueda
				{ $set: { productos: newCart.productos } }, // Modificación
			);
			console.table(cart);
		} catch (error) {
			console.log('Capa de Controllador CartManager updateCart', error);
			throw new Error();
		}
	}
	//AGREGO PRODUCTO AL CART / UPDATE A CART
	async addProdToCart(idCart, idProd, pQuantity) {
		try {
			const cart = await cartModel.findOne({ _id: idCart });
			if (!cart) {
				throw new Error();
			}
			const indexProd = cart.productos.findIndex(
				(product) => product.product == idProd,
			);
			if (indexProd === -1) {
				const newProd = { product: idProd, quantity: pQuantity };
				cart.productos.push(newProd);
			} else {
				cart.productos[indexProd].quantity += pQuantity;
			}
			const newCart = await cartModel.updateOne(
				{ _id: idCart },
				{ $set: cart },
			);
			return newCart;
		} catch (error) {
			console.log('Capa de Controllador CartManager addProdToCart', error);
			throw new Error();
		}
	}
	//DELETE CART
	async delete(cid) {
		try {
			const cart = await cartModel.deleteOne({ _id: cid });
			if (!cart) {
				throw new Error();
			}
			return cart;
		} catch (error) {
			return console.log('Not found');
		}
	}
	// EMPTY CART PRODUCTS
	async emptyCart(cId) {
		try {
			const array = [];
			const cart = await this.updateCart(cId, array);
			return cart;
		} catch (error) {
			console.log('Capa de Controllador CartManager empyCart', error);
			throw new Error();
		}
	}

	// DELETE PRODUCT FROM CART
	async deleteProduct(cId, pId) {
		try {
			const cart = await this.getCartById(cId);
			// console.table(cart.productos);
			const productIndex = cart.productos.findIndex(
				(product) => product._id.toString() === pId,
			);
			if (productIndex === -1) {
				console.log(
					'Capa de Controllador CartManager deleteProduct',
					error,
				);
				throw new Error();
			}
			// Elimina el producto del array 'productos' utilizando splice
			cart.productos.splice(productIndex, 1);

			// Guarda el carrito actualizado
			await this.updateCart(cId, cart.productos);

			console.log('Producto eliminado del carrito:', pId);
		} catch (error) {
			console.log('Capa de Controllador CartManager deleteProduct', error);
			throw new Error();
		}
	}
	//CREATE TICKET
	async createTicket(ticket) {
		try {
			ticket.code = ticket.code.toString();
			ticket.purchase_datetime = ticket.purchase_datetime.toString();

			// console.log(ticket);
			await ticketModel.create(ticket);
			return ticket;
		} catch (error) {
			console.log('Capa de Controllador CartManager createTicket', error);
			throw new Error();
		}
	}
	//CHECK PRODUCT STOCK
	async checkStock(product) {
		try {
			if (product.product.stock < product.quantity) {
				console.error(
					`no hay tantos del producto ${product.product.title} id: ${product.product._id}`,
				);
				return false;
			}

			return true;
		} catch (error) {
			console.error('Capa de Controllador CartManager checkStock', error);
			throw new Error();
		}
	}
	//Calculate Total Price
	async totalPrice(product) {
		try {
			if (!product) {
				return 0;
			}

			const newStock = product.product.stock - product.quantity;
			await productModel.updateOne(
				{ _id: product.product._id },
				{ $set: { stock: newStock } },
			);
			const totalPrice = product.product.price * product.quantity;
			return totalPrice;
		} catch (error) {
			console.error('Capa de Controllador CartManager checkStock', error);
			throw new Error();
		}
	}
	//BUY ALL CART
	async buyCart(cId, user) {
		try {
			const cart = await this.getCartById(cId);
			// veo si hay stock
			const stockProductsArray = await Promise.all(
				await cart.productos.map(async (producto) => {
					const stock = await this.checkStock(producto);
					if (stock) {
						return producto;
					} else return false;
				}),
			);
			//si hay stock calculo el precio total de cada item
			const totalPriceArray = await Promise.all(
				await stockProductsArray.map(async (producto) => {
					return await this.totalPrice(producto);
				}),
			);
			//despues hago el precio total de todos los objetos que hay en stock
			const amount = totalPriceArray.reduce(
				(total, price) => total + price,
				0,
			);
			//  ahora saco los productos del carrito que hay en stock y los que no hay los dejo
			const noStockProductsArray = await Promise.all(
				await cart.productos.map(async (producto) => {
					const stock = await this.checkStock(producto);
					if (!stock) {
						return producto;
					} else return null;
				}),
			);
			const filteredNoStockProductsArray = noStockProductsArray.filter(
				(producto) => producto !== null,
			);
			cart.productos = filteredNoStockProductsArray;
			// y por ultimo actualizo el carrito sin los productos comprados y genero el ticket de compra
			await this.updateCart(cart._id, cart);
			const code = Math.floor(100000 + Math.random() * 900000);
			const date = new Date();
			const purchaser = user;
			console.log(typeof purchaser);

			const ticket = {
				code: code,
				purchase_datetime: date,
				amount: amount,
				purchaser: purchaser,
			};
			await this.createTicket(ticket);
			return ticket;
		} catch (error) {
			console.log('Capa de Controllador CartManager buyCart', error);
			// throw new Error('Capa de Controllador CartManager buyCart');
		}
	}
}

export default CartManagerMongo;
