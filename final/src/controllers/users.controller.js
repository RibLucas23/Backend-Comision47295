import {
	CreateToken,
	GuardarTokenEnCookie,
	VerifyToken,
} from '../middlewares/tokenJwt.js';
import { sendEmail } from '../service/MailService.js';
import jwt from 'jsonwebtoken';
import UserRepository from '../repository/UserRepository.js';
const userRepository = new UserRepository();

//GET USERS

export const getUsers = async (req, res) => {
	try {
		const users = await userRepository.getAll();
		res.status(200).json(users);
	} catch (error) {
		logger.error('error al traer usuarios');
		throw error;
	}
};
// DELETE USER
export const deleteUser = async (req, res) => {
	const userId = req.params.uid;
	try {
		const user = await userRepository.getuserById(userId);
		const textEmail = `${user.first_name} Tu cuenta ha sido eliminada`;
		await sendEmail(user, textEmail);

		const deletedUser = await userRepository.deleteUserById(userId);
		res.status(200).json(deletedUser);
	} catch (error) {
		logger.error('error al eliminar usuarios');
		throw error;
	}
};
//GET PROFILE
export const getProfile = async (req, res) => {
	try {
		const { first_name, last_name, age, email } = req.session;

		res.status(200).send({ first_name, last_name, age, email });
	} catch (error) {
		logger.error('error al traer usuarios');
		throw error;
	}
};
//LOGOUT
export const logOut = async (req, res) => {
	try {
		req.session.destroy();
		res.status(200).redirect('/api/session/login');
	} catch (error) {
		logger.error('error al traer usuarios');
		throw error;
	}
};

//LOGIN
export const login = async (req, res) => {
	try {
		const userInfo = {
			email: req.user.email,
			username: req.user.username,
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			age: req.user.age,
			rol: req.user.rol,
			isLogged: true,
			cart: req.user.cart,
		};

		req.session.email = req.user.email;
		req.session.username = req.user.username;
		req.session.first_name = req.user.first_name;
		req.session.last_name = req.user.last_name;
		req.session.age = req.user.age;
		req.session.rol = req.user.rol;
		req.session.isLogged = true;
		req.session.cart = req.user.cart;

		console.log(req.session);
		res.json({ success: true, userInfo });
	} catch (error) {
		logger.error('error al traer usuarios');
		throw error;
	}
};
//SINGUP
export const singUp = async (req, res) => {
	try {
		res.redirect('/api/session/login');
	} catch (error) {
		logger.error('error al traer usuarios');
		throw error;
	}
};
//GITHUBCALLBACK
export const gitHubCallback = async (req, res) => {
	try {
		req.session.email = req.user.email;
		req.session.username = req.user.username;
		req.session.rol = req.user.rol;
		req.session.isLogged = true;

		res.redirect('/api/session/current');
	} catch (error) {
		logger.error('error al traer usuarios');
		throw error;
	}
};
//SET ROL
export const setRol = async (req, res) => {
	const userId = req.params.uid;
	try {
		const user = await userRepository.getuserById(userId);
		console.log(user);
		if (!user) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}

		await user.togglePremium();

		return res.status(200).json({
			message: 'Rol de usuario actualizado con éxito',
			newUser: user,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error interno del servidor' });
	}
};

//DELETE USERS WITH INACTIVITY
export const deleteInactiveUsersController = async (req, res) => {
	try {
		await userRepository.deleteInactiveUsers();
		res.status(200).json({
			message: 'Usuarios inactivos eliminados correctamente.',
		});
	} catch (error) {
		console.error('Error al eliminar usuarios inactivos:', error);
		res.status(500).json({ error: 'Error interno del servidor.' });
		throw error;
	}
};

//RESET PASSWORD
export const resetPassword = async (req, res) => {
	try {
		const userId = req.params.uid;
		const token = await CreateToken(userId);
		await GuardarTokenEnCookie(res, token);
		const user = await userRepository.getuserById(userId);
		// logger.error(user.email);
		const textEmail = `ingresa al siguiente link para cambiar tu contraseña: http://localhost:8080/api/session/newPassword/${user._id}/check`;
		await sendEmail(user.email, textEmail);
		res.status(200).send(token);
	} catch (error) {
		logger.error('error al newPassword()');
		throw error;
	}
};
export const changePassword = async (req, res) => {
	try {
		const cookies = req.cookies;
		const cookieToken = cookies.newPasswordToken; // const userId = req.params.uid;
		const token = await VerifyToken(cookieToken);
		const pass = req.body.password;
		await userRepository.changePassword(token, pass);
		res.status(200).json({ token });
	} catch (error) {
		logger.error('error al newPassword()');
		throw error;
	}
};
