import { userModel } from '../dao/models/user.model.js';
import { sendEmail } from '../service/MailService.js';
class UserRepository {
	//traer todos los useros / leer la base de datos
	async getAll() {
		const users = await userModel.find().select('-password').lean();
		return users;
	}

	//traigo usero por id
	async getuserById(idUser) {
		const user = await userModel.findOne({ _id: idUser });
		return user;
	}

	// creo  el usero

	// borro un usero por id
	async deleteUserById(idUser) {
		try {
			// Utiliza el método findByIdAndDelete de Mongoose para eliminar el usuario por su ID
			const deletedUser = await userModel.findByIdAndDelete(idUser);

			if (deletedUser) {
				console.log(`Usuario con ID ${idUser} eliminado correctamente.`);
				return deletedUser;
			} else {
				console.log(`No se encontró un usuario con ID ${idUser}.`);
				return null;
			}
		} catch (error) {
			console.error('Error al eliminar usuario:', error);
			throw error; // Puedes manejar el error según tus necesidades
		}
	}
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
	async deleteInactiveUsers() {
		try {
			// Calcula la fecha hace 2 días
			const twoDaysAgo = new Date();
			twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

			// Encuentra los usuarios inactivos antes de eliminarlos
			const inactiveUsers = await userModel.find({
				last_connection: { $lt: twoDaysAgo },
			});

			// Envía un correo electrónico a cada usuario inactivo
			for (const user of inactiveUsers) {
				const textEmail = 'Cuenta Eliminada por inactividad';
				await sendEmail(user, textEmail);
			}

			// Realiza la eliminación de los usuarios inactivos
			const deletionResult = await userModel.deleteMany({
				last_connection: { $lt: twoDaysAgo },
			});

			console.log(`${deletionResult.deletedCount} usuarios eliminados.`);
		} catch (error) {
			console.log(
				'Capa de Repository userManager deleteInactiveUsers()',
				error,
			);
			throw error;
		}
	}
}

export default UserRepository;
