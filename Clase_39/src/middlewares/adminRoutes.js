const adminRoutes = (req, res, next) => {
	if (req.session.rol !== 'admin') {
		return res.send('no tienes permisos para eso');
	}

	next();
};

export default adminRoutes;
