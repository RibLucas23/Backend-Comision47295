import nodemailer from 'nodemailer';
import 'dotenv/config';
const transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

//SEND EMAIL
export const sendEmail = async (user, textEmail, subject) => {
	try {
		console.log(user);
		console.log(textEmail);
		console.log(subject);

		let message = {
			from: 'seder@server.com',
			to: user,
			subject: subject,
			text: textEmail,
			html: 'html version',
		};
		await transporter.sendMail(message);
	} catch (error) {
		console.log('error al enviar mail');
		throw error;
	}
};

export default transporter;
