//mongo
import CartManagerMongo from '../dao/db/mongo/CartManagerMongo.js';
const mongoCarts = new CartManagerMongo();

//GET ALL
export const getAllCarts = async (req, res) => {
	try {
		const carts = await mongoCarts.getAll();
		res.status(200).render('carts', { carts });
	} catch (error) {
		res.status(500).json({ error: ' Internal server error' });
	}
};
//CREATE CART
export const createCart = async (req, res) => {
	try {
		const newCart = await mongoCarts.newCart();
		res.status(200).send(newCart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
};
//GET By ID
export const getCartById = async (req, res) => {
	try {
		const id = req.params.cid;
		const cart = await mongoCarts.getCartById(id);
		const cartProducts = cart.productos;
		// console.log(cartProducts);
		res.status(200).render('cartDetail', { cartProducts, id });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
};
// ================================================BBBBBOOOOORRRRRRRRAAAAAARrr================================================
export const getCartById2 = async (req, res) => {
	try {
		const id = req.params.cid;
		const cart = await mongoCarts.getCartById(id);
		const cartProducts = cart.productos;
		// console.log(cartProducts);
		// res.status(200).render('cartDetail', { cartProducts, id });
		res.status(200).send(cart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
};
// ================================================BBBBBOOOOORRRRRRRRAAAAAARrr================================================

//ADD PRODUCT TO CART
export const addProductToCart = async (req, res) => {
	try {
		const id = req.params.cid;
		const pId = req.params.pid;
		let pQuantity = parseInt(req.body.pQuantity);
		if (!req.body.pQuantity) {
			pQuantity = 1;
		}
		const cart = await mongoCarts.addProdToCart(id, pId, pQuantity);
		res.status(200).send(cart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
};
//DELETE CART
export const deleteCart = async (req, res) => {
	try {
		const deleteCart = req.query.deleteCart;
		const id = req.params.cid;
		console.log(deleteCart);

		if (deleteCart === 'delete') {
			console.log('entro a delete');
			const cart = await mongoCarts.delete(id);
			return res.status(200).send(cart);
		}
		console.log('no entro a delete');

		const emptyCart = await mongoCarts.emptyCart(id);
		return res.status(200).send(emptyCart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
};
//UPDATE CART
export const updateCart = async (req, res) => {
	try {
		const id = req.params.cid;
		const newArray = req.body;
		const cart = await mongoCarts.updateCart(id, newArray);
		res.status(200).send(cart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
};
//DELET PRODUCT FROM CART
export const deleteProductFromCart = async (req, res) => {
	try {
		const cId = req.params.cid;
		const pId = req.params.pid;
		const deleteCart = await mongoCarts.deleteProduct(cId, pId);
		res.status(200).send(deleteCart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
};
