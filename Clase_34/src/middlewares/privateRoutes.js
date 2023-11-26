const privatesRoutes = (req, res, next) => {
	if (req.session.rol !== 'usuario') {
		if (req.session.rol !== 'admin') {
			return res.redirect('/api/session/login');
		}
	}

	next();
};

export default privatesRoutes;
