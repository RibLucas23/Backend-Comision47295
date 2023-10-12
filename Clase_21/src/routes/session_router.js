import { Router } from 'express';
import { userModel } from '../dao/models/user.model.js';
import privatesRoutes from '../middlewares/privateRoutes.js';
import publicRoutes from '../middlewares/publicRoutes.js';
import adminRoutes from '../middlewares/adminRoutes.js';
import navMiddleware from '../middlewares/navMiddleware.js';
import passport from 'passport';

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
session_router.post(
	'/login',
	publicRoutes,
	passport.authenticate('login', { failureRedirect: '/faillogin' }),
	async (req, res) => {
		req.session.email = req.user.email;
		req.session.username = req.user.username;
		req.session.rol = req.user.rol;
		req.session.isLogged = true;

		res.redirect('/api/session/profile');
	},
);
session_router.post(
	'/signup',
	publicRoutes,
	passport.authenticate('register', { failureRedirect: '/failregister' }),
	async (req, res) => {
		res.redirect('/api/session/login');
	},
);

session_router.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
);
session_router.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	(req, res) => {
		req.session.email = req.user.email;
		req.session.username = req.user.username;
		req.session.rol = req.user.rol;
		req.session.isLogged = true;

		res.redirect('/api/session/profile');
	},
);

export default session_router;
