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
			const cart = await cartModel.findOne({ _id: idCart });
			if (!cart) {
				throw error;
			}
			return cart;
		} catch (error) {
			return console.log('Not found');
		}
	}
	//AGREGO PRODUCTO AL CART / UPDATE A CART
	async addProdToCart(idCart, idProd) {
		try {
			const product = await productModel.findOne({ _id: idProd });
			const cart = await cartModel.findOne({ _id: idCart });
			if (!product || !cart) {
				throw error;
			}
			const indexProd = cart.productos.findIndex(
				(product) => product._id == idProd,
			);
			if (indexProd === -1) {
				const newProd = { _id: product._id, quantity: 1 };
				cart.productos.push(newProd);
			} else {
				cart.productos[indexProd].quantity++;
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
}

export default CartManagerMongo;
