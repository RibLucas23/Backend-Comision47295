import mongoose from 'mongoose';

const cartCollection = 'carts';

const productoSchema = new mongoose.Schema({
	productid: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
});

const cartSchema = new mongoose.Schema({
	productos: [productoSchema],
});

const cartModel = mongoose.model(cartCollection, cartSchema);
export { cartModel };
