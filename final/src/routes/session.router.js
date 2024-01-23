import { Router } from 'express';
import { userModel } from '../dao/models/user.model.js';
import privatesRoutes from '../middlewares/privateRoutes.js';
import publicRoutes from '../middlewares/publicRoutes.js';
import adminRoutes from '../middlewares/adminRoutes.js';
import navMiddleware from '../middlewares/navMiddleware.js';
import passport from 'passport';
import {
	changePassword,
	deleteInactiveUsersController,
	deleteUser,
	getProfile,
	getUsers,
	gitHubCallback,
	logOut,
	login,
	resetPassword,
	setRol,
	singUp,
} from '../controllers/users.controller.js';

const session_router = Router();

session_router.get('/', adminRoutes, getUsers);
session_router.delete('/delete', adminRoutes, deleteInactiveUsersController);
session_router.delete('/delete/:uid', adminRoutes, deleteUser);

session_router.get('/admin', adminRoutes, publicRoutes, (req, res) => {
	res.render('login');
});
session_router.get('/login', publicRoutes, (req, res) => {
	res.render('login');
});
session_router.get('/signup', publicRoutes, (req, res) => {
	res.render('signup');
});
session_router.get('/current', privatesRoutes, getProfile);
session_router.get('/logout', logOut);
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
	login,
);
session_router.post(
	'/signup',
	publicRoutes,
	passport.authenticate('register', { failureRedirect: '/failregister' }),
	singUp,
);

session_router.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
);
session_router.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	gitHubCallback,
);

session_router.put('/premium/:uid', setRol);

session_router.get('/newPassword/:uid', resetPassword);
session_router.get('/newPassword/:uid/check', changePassword);

export default session_router;
