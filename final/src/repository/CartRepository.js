import { cartModel } from '../dao/models/cart.model.js';
import { productModel } from '../dao/models/product.model.js';
import { ticketModel } from '../dao/models/ticket.model.js';
import TicketService from '../service/TicketService.js';
const ticketService = new TicketService();
class CartRepository {
	//CREO EL CART
	async newCart() {
		const newCart = [];
		const cart = await cartModel.create({ newCart });
		return cart;
	}

	//TRAIGO TODOS LOS CARTS
	async getAll() {
		const carts = await cartModel.find().lean();
		return carts;
	}
	//TRAIGO CART CON ID ESPESIFICO
	async getCartById(idCart) {
		const cart = await cartModel
			.findOne({ _id: idCart })
			.populate('productos.product')
			.lean();
		if (!cart) {
			throw new Error();
		}
		return cart;
	}
	//UPDATE CART
	async updateCart(idCart, newCart) {
		const cart = await cartModel.updateOne(
			{ _id: idCart }, // Criterio de búsqueda
			{ $set: { productos: newCart } }, // Modificación
		);
		return cart;
	}
	//AGREGO PRODUCTO AL CART / UPDATE A CART
	async addProdToCart(idCart, idProd, pQuantity) {
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
	}
	//DELETE CART
	async delete(cid) {
		const cart = await cartModel.deleteOne({ _id: cid });
		return cart;
	}
	// EMPTY CART PRODUCTS
	async emptyCart(cId) {
		try {
			const array = [];
			const cart = await this.updateCart(cId, array);
			return cart;
		} catch (error) {
			console.log('Capa de repository empyCart', error);
			throw new Error();
		}
	}
	// DELETE PRODUCT FROM CART
	async deleteProduct(cId, pId) {
		try {
			const cart = await this.getCartById(cId);
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
			logger.error('Capa de repository deleteProduct', error);
			throw new Error();
		}
	}

	//CHECK PRODUCT STOCK
	async checkStock(product) {
		try {
			if (product.product.stock < product.quantity) {
				logger.error(
					`no hay tantos del producto ${product.product.title} id: ${product.product._id}`,
				);
				return false;
			}

			return true;
		} catch (error) {
			logger.error('Capa de repository checkStock', error);
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
			logger.error('Capa de repository checkStock', error);
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

			const completeCart = await this.updateCart(cart._id, cart.productos);
			console.log(completeCart);

			const code = Math.floor(100000 + Math.random() * 900000);
			const date = new Date();
			const purchaser = user;

			const ticket = {
				code: code,
				purchase_datetime: date,
				amount: amount,
				purchaser: purchaser,
			};
			// const response = await this.createTicket(ticket);
			const response = await ticketService.createTicket(ticket);
			return response;
		} catch (error) {
			logger.error('Capa de repository  buyCart', error);
			// throw new Error('Capa de Controllador CartManager buyCart');
		}
	}
}

export default CartRepository;
