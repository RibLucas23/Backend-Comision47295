const navMiddleware = (req, res, next) => {
	if (!req.session.isLogged) {
		return res.redirect('/api/session/isNotLogged');
	}

	next();
};

export default navMiddleware;
