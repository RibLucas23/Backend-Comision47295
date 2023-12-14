import mongoose from 'mongoose';

const ticketsCollection = 'tickets';

const ticketsSchema = new mongoose.Schema({
	code: {
		type: String,
		unique: true,
		required: true,
	},
	purchase_datetime: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	purchaser: {
		type: String,
		required: true,
	},
});

const ticketModel = mongoose.model(ticketsCollection, ticketsSchema);

export { ticketModel };
