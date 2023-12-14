const privatesRoutes = (req, res, next) => {
	const allowedRoles = ['usuario', 'admin', 'premium'];

	if (!allowedRoles.includes(req.session.rol)) {
		return res.redirect('/api/session/login');
	}

	next();
};

export default privatesRoutes;
