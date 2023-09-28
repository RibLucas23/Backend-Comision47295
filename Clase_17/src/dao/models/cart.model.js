import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
	// productos: [productoSchema],
	productos: {
		type: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'products',
				},
				quantity: {
					type: Number,
					default: 0,
				},
			},
		],
		default: [],
	},
});

cartSchema.plugin(mongoosePaginate);
const cartModel = mongoose.model(cartCollection, cartSchema);
export { cartModel };
