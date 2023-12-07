import {
	CreateToken,
	GuardarTokenEnCookie,
	VerifyToken,
} from '../middlewares/tokenJwt.js';
import transporter from '../service/MailService.js';
import jwt from 'jsonwebtoken';
import UserRepository from '../repository/UserRepository.js';
const userRepository = new UserRepository();

//SEND EMAIL
const sendEmail = async (user) => {
	try {
		let message = {
			from: 'seder@server.com',
			to: user.email,
			subject: 'message title prueba',
			text: `ingresa al siguiente link para cambiar tu contraseña: http://localhost:8080/api/session/newPassword/${user._id}/check`,
			html: 'html version',
		};
		await transporter.sendMail(message);
	} catch (error) {
		console.log('error al enviar mail');
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
		// console.log(user.email);
		await sendEmail(user);
		res.status(200).send(token);
	} catch (error) {
		console.log('error al newPassword()');
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
		console.log('error al newPassword()');
		throw error;
	}
};
