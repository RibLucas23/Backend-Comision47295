const privatesRoutes = (req, res, next) => {
	if (!req.session.isLogged) {
		return res.redirect('/api/session/login');
	}
	next();
};

export default privatesRoutes;
