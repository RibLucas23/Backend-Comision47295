// import { cartModel } from '../../models/cart.model.js';
// import { productModel } from '../../models/product.model.js';
// import { ticketModel } from '../../models/ticket.model.js';
// import ProductsManagerMongo from './ProductManagerMongo.js';
// const productsManager = new ProductsManagerMongo();
import CartRepository from '../../../repository/CartRepository.js';
import ProductRepository from '../../../repository/ProductRepository.js';
const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
class CartManagerMongo {
	//CREO EL CART
	async newCart() {
		try {
			const newCart = await cartRepository.newCart();
			return newCart;
		} catch (error) {
			console.log('Capa de Controllador CartManager newCart()', error);
			throw new Error();
		}
	}

	//TRAIGO TODOS LOS CARTS
	async getAll() {
		const carts = await cartRepository.getAll();
		return carts;
	}
	//TRAIGO CART CON ID ESPESIFICO
	async getCartById(idCart) {
		try {
			const cart = await cartRepository.getCartById(idCart);
			return cart;
		} catch (error) {
			console.log('Capa de Controllador CartManager getCartById', error);
			throw new Error();
		}
	}
	//UPDATE CART
	async updateCart(idCart, newCart) {
		try {
			const cart = await cartRepository.updateCart(idCart, newCart);
			return cart;
		} catch (error) {
			console.log('Capa de Controllador CartManager updateCart', error);
			throw new Error();
		}
	}
	//AGREGO PRODUCTO AL CART / UPDATE A CART
	async addProdToCart(idCart, idProd, pQuantity, owner) {
		try {
			const product = await productRepository.getProductById(idProd);
			console.log(product);
			if (product.owner === owner) {
				console.log('no puedas agregar tus propios productos al cart');
				throw error;
			}
			const newCart = await cartRepository.addProdToCart(
				idCart,
				idProd,
				pQuantity,
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
			const cart = await cartRepository.delete(cid);
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
			const cart = await cartRepository.emptyCart(cId);
			return cart;
		} catch (error) {
			console.log('Capa de Controllador CartManager empyCart', error);
			throw new Error();
		}
	}

	// DELETE PRODUCT FROM CART
	async deleteProduct(cId, pId) {
		try {
			const newCart = await cartRepository.deleteProduct(cId, pId);
			return newCart;
		} catch (error) {
			console.log('Capa de Controllador CartManager deleteProduct', error);
			throw new Error();
		}
	}
	//CREATE TICKET
	async createTicket(ticket) {
		try {
			const response = await cartRepository.createTicket(ticket);
			return response;
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
			const totalPrice = await cartRepository.totalPrice(product);
			return totalPrice;
		} catch (error) {
			console.error('Capa de Controllador CartManager checkStock', error);
			throw new Error();
		}
	}
	//BUY ALL CART
	async buyCart(cId, user) {
		try {
			const ticket = await cartRepository.buyCart(cId, user);
			return ticket;
		} catch (error) {
			console.log('Capa de Controllador CartManager buyCart', error);
		}
	}
}

export default CartManagerMongo;
