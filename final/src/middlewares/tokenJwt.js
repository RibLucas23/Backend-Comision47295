import 'dotenv/config';
import jwt from 'jsonwebtoken';

const claveSecreta = process.env.TOKEN_SECRET;
export const CreateToken = async (code) => {
	try {
		const codeForNewPass = {
			code,
		};

		// Clave secreta para firmar el token (guarda esta clave de forma segura)

		// Configuración del token
		const configuracionToken = {
			expiresIn: '1h', // Tiempo de expiración del token (puedes ajustarlo según tus necesidades)
		};
		// Crear el token JWT
		const newPasswordToken = jwt.sign(
			codeForNewPass,
			claveSecreta,
			configuracionToken,
		);
		console.log('Token JWT:', newPasswordToken);
		return newPasswordToken;
	} catch (error) {
		throw error;
	}
};
export const GuardarTokenEnCookie = (res, token) => {
	// Guardar el token en una cookie
	res.cookie('newPasswordToken', token, {
		httpOnly: true, // La cookie solo es accesible a través del protocolo HTTP
		// Otras opciones que puedes configurar según tus necesidades
		secure: true, // Solo enviar la cookie sobre HTTPS si tu servidor está configurado para HTTPS
		maxAge: 3600000, // Tiempo de vida de la cookie en milisegundos (1 hora en este caso)
	});
};

export const VerifyToken = async (token) => {
	try {
		const code = jwt.verify(token, claveSecreta, (error, decoded) => {
			if (error) {
				console.error('Error al verificar el token:', error.message);
			} else {
				console.log('Contenido del token decodificado:', decoded.code);
				return decoded.code;
			}
		});
		return code;
	} catch (error) {
		throw error;
	}
};
