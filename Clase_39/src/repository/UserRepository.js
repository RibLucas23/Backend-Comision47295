import { userModel } from '../dao/models/user.model.js';
class UserRepository {
	//traer todos los useros / leer la base de datos
	async getAll() {
		const users = await userModel.find().lean();
		return users;
	}

	//traigo usero por id
	async getuserById(idUser) {
		const user = await userModel.findOne({ _id: idUser });
		return user;
	}

	// creo  el usero

	// borro un usero por id

	//actualizo un usero
	async changePassword(userId, pass) {
		try {
			const user = await userModel.findById({ _id: userId });

			if (user.password === pass) {
				console.log('no puedes usar tu contraseña actual');
				throw error;
			}
			user.password = pass;
			console.log('contraseña cambiada exitosamente!');
			await userModel.updateOne({ _id: userId }, { $set: user });
		} catch (error) {
			console.log('Capa de Repository userManager update()', error);
			throw error;
		}
	}
}

export default UserRepository;
