import { cartModel } from '../../models/cart.model.js';
import { productModel } from '../../models/product.model.js';
class CartManagerMongo {
	//CREO EL CART
	async newCart() {
		try {
			const newCart = [];
			await cartModel.create({ newCart });
			return newCart;
		} catch (error) {
			return console.log('error al agregar newCart');
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
				throw error;
			}
			return cart;
		} catch (error) {
			return console.log('Not found');
		}
	}
	//UPDATE CART
	async updateCart(idCart, newCart) {
		try {
			// console.log(idCart);

			// console.table(newCart);
			const cart = await cartModel.updateOne(
				{ _id: idCart }, // Criterio de búsqueda
				{ $set: { productos: newCart } }, // Modificación
			);
			console.table(cart);
		} catch (error) {
			return console.log('Not found for uptdate');
		}
	}
	//AGREGO PRODUCTO AL CART / UPDATE A CART
	async addProdToCart(idCart, idProd, pQuantity) {
		try {
			const cart = await cartModel.findOne({ _id: idCart });
			if (!cart) {
				throw error;
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
			return console.log('error al agregar producto al acarro');
		}
	}
	//DELETE CART
	async delete(cid) {
		try {
			const cart = await cartModel.deleteOne({ _id: cid });
			if (!cart) {
				throw error;
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
			console.log('cart');
			console.log(cart);
			return cart;
		} catch (error) {}
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
				console.error('Producto no encontrado en el carrito');
				return;
			}
			// Elimina el producto del array 'productos' utilizando splice
			cart.productos.splice(productIndex, 1);

			// Guarda el carrito actualizado
			// console.table(cart.productos);
			await this.updateCart(cId, cart.productos);

			console.log('Producto eliminado del carrito:', pId);
		} catch (error) {}
	}
}

export default CartManagerMongo;
