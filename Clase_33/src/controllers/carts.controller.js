//mongo
import CartManagerMongo from '../dao/db/mongo/CartManagerMongo.js';
import CartManager from '../dao/db/fs/CartManager.js';
import transporter from '../service/MailService.js';
const FSCartManager = new CartManager('./src/dao/db/fs/carts.json');

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
		res.status(200).render('cartDetail', { cartProducts, id });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
};

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
//FINISH BUY
export const buyCart = async (req, res) => {
	try {
		const id = req.params.cid;
		const user = req.session.email;
		const ticket = await mongoCarts.buyCart(id, user);
		const ticketDTO = {
			id: ticket._id,
			code: ticket.code,
			amount: ticket.amount,
			purchaser: ticket.purchaser,
		};
		res.status(200).render('ticketDetail', { ticketDTO });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: ' Internal server error' });
	}
};

//SEND EMAIL
export const sendEmail = async (req, res) => {
	try {
		const user = req.session.email;
		let message = {
			from: 'seder@server.com',
			to: user,
			subject: 'message title prueba',
			text: 'plaintext version',
			html: 'html version',
		};
		await transporter.sendMail(message);
		res.status(200).send(message);
	} catch (error) {
		res.status(500).json({ error: ' Internal server error' });
	}
};

//=======================================__FileSystem__=============================================

//GET ALL
export const FSgetAllCarts = async (req, res) => {
	try {
		const carts = await FSCartManager.getAll();
		if (req.query.limit) {
			const cartsLimitados = await carts.slice(0, req.query.limit);
			res.status(200).send(cartsLimitados);
		} else {
			res.status(200).send(carts);
		}
	} catch (error) {
		res.status(500).json({ error: ' Internal server error' });
	}
};
//GET BY ID
export const FSgetById = async (req, res) => {
	try {
		let id = req.params.pid;
		id = parseInt(id);
		const cart = await FSCartManager.getById(id);
		if (cart) {
			res.status(200).send(cart);
		}
		res.status(404).send('no se encontro cart con ese id');
	} catch (error) {
		res.status(500).json({ error: ' Internal server error' });
	}
};
//CREATE
export const FSCreate = async (req, res) => {
	try {
		const cart = await FSCartManager.addCart();
		res.status(200).send(cart);
	} catch (error) {
		res.status(500).json({ error: ' Internal server error' });
	}
};
//PUSH TO CART
export const FSPushCart = async (req, res) => {
	try {
		const prod = await products.getProductById(req.params.pid);
		const idProd = parseInt(prod.id);

		const idCart = parseInt(req.params.cid);
		const cart = await FSCartManager.pushProd(idCart, idProd);

		res.status(200).send(cart);
	} catch (error) {
		res.status(500).json({ error: ' Internal server error' });
	}
};
