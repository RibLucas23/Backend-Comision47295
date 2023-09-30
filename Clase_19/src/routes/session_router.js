import { Router } from 'express';
import { userModel } from '../dao/models/user.model.js';
import privatesRoutes from '../middlewares/privateRoutes.js';
import publicRoutes from '../middlewares/publicRoutes.js';
import adminRoutes from '../middlewares/adminRoutes.js';
import navMiddleware from '../middlewares/navMiddleware.js';

const session_router = Router();
session_router.get('/admin', adminRoutes, publicRoutes, (req, res) => {
	res.render('login');
});
session_router.get('/login', publicRoutes, (req, res) => {
	res.render('login');
});
session_router.get('/signup', publicRoutes, (req, res) => {
	res.render('signup');
});
session_router.get('/profile', privatesRoutes, (req, res) => {
	const { username, email } = req.session;
	res.render('profile', { username, email });
});
session_router.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/api/session/login');
});
session_router.get('/isLogged', navMiddleware, (req, res) => {
	res.status(200).send(true);
});
session_router.get('/isNotLogged', (req, res) => {
	res.status(400).send(false);
});
session_router.post('/login', publicRoutes, async (req, res) => {
	const { email, password } = req.body;
	const user = await userModel.findOne({ email, password }).lean();

	if (!user) {
		console.error('usuario o contraseña invalidos');
		return res.redirect('/api/session/login');
	}
	req.session.email = user.email;
	req.session.username = user.username;
	req.session.rol = user.rol;
	req.session.isLogged = true;

	res.redirect('/api/products/mongo');
});
session_router.post('/signup', publicRoutes, async (req, res) => {
	const { username, email, password } = req.body;

	const user = await userModel.create({ username, password, email });

	req.session.username = user.username;
	req.session.email = user.email;
	req.session.isLogged = true;

	res.redirect('/api/products/mongo');
});

export default session_router;
