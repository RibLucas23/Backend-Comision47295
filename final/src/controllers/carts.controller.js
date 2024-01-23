//mongo
import CartManagerMongo from '../dao/db/mongo/CartManagerMongo.js';
import transporter, { sendEmail } from '../service/MailService.js';

const mongoCarts = new CartManagerMongo();

//GET ALL
export const getAllCarts = async (req, res) => {
	try {
		const carts = await mongoCarts.getAll();
		res.status(200).send(carts);
	} catch (error) {
		logger.error(' error getting carts ', error);
		res.status(500).json({ error: ' Error en  getAllCarts controller' });
	}
};
//CREATE CART
export const createCart = async (req, res) => {
	try {
		const newCart = await mongoCarts.newCart();
		res.status(200).send(newCart);
	} catch (error) {
		console.error(error);
		logger.error(' error creating carts ', error);

		res.status(500).json({ error: ' Error en  createCart controller' });
	}
};
//GET By ID
export const getCartById = async (req, res) => {
	try {
		const id = req.params.cid;
		console.log(id);
		const cart = await mongoCarts.getCartById(id);
		res.status(200).json(cart);
	} catch (error) {
		logger.error(' error getting carts ', error);
		res.status(500).json({ error: ' Error en  getCartById controller' });
	}
};

//ADD PRODUCT TO CART
export const addProductToCart = async (req, res) => {
	try {
		const id = req.params.cid;
		const pId = req.params.pid;
		if (req.session.rol !== 'admin') {
			const owner = req.session.email;
			let pQuantity = parseInt(req.body.pQuantity);

			if (!req.body.pQuantity) {
				pQuantity = 1;
			}
			const cart = await mongoCarts.addProdToCart(id, pId, pQuantity, owner);
			res.status(200).send(cart);
		}
	} catch (error) {
		logger.error(' error adding products to carts ', error);
		res.status(500).json({ error: ' Error en  addProductToCart controller' });
	}
};
//DELETE CART
export const deleteCart = async (req, res) => {
	try {
		const deleteCart = req.query.deleteCart;
		const id = req.params.cid;

		if (deleteCart === 'delete') {
			const cart = await mongoCarts.delete(id);
			return res.status(200).send(cart);
		}

		const emptyCart = await mongoCarts.emptyCart(id);
		return res.status(200).send(emptyCart);
	} catch (error) {
		logger.error(' error deleting carts ', error);
		res.status(500).json({ error: ' Error en  deleteCart controller' });
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
		logger.error(' error updating carts ', error);
		res.status(500).json({ error: ' Error en  updateCart controller' });
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
		logger.error(' error deleting products from carts ', error);
		res.status(500).json({
			error: ' Error en  deleteProductFromCart controller',
		});
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
		const msj = `compra finalizada, 
		 ticket:${ticketDTO.id}
		 code:${ticketDTO.id}
		 amount:$${ticketDTO.code}
		 purchaser:${ticketDTO.purchaser}`;
		await sendEmail(user, msj, 'compra finalizada');
		res.status(200).json(ticketDTO);
	} catch (error) {
		logger.error(' error ending  buy in carts ', error);
		res.status(500).json({ error: ' Error en  buyCart controller' });
	}
};
