import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	rol: {
		type: String,
		default: 'usuario',
	},
});

const userModel = mongoose.model(userCollection, userSchema);

export { userModel };
