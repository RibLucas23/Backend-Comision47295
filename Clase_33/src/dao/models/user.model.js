import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: {
		type: String,
		unique: true,
	},
	age: Number,
	password: String,
	cart: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'carts',
	},
	rol: {
		type: String,
		default: 'usuario',
	},
	// username: String,
	// email: String,
	// password: String,
	// rol: {
	// 	type: String,
	// 	default: 'usuario',
	// },
});

const userModel = mongoose.model(userCollection, userSchema);

export { userModel };
