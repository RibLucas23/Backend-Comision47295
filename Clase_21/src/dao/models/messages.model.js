import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const messageCollection = 'messages';

const messageSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
});

messageSchema.plugin(mongoosePaginate);
const messageModel = mongoose.model(messageCollection, messageSchema);
export { messageModel };
