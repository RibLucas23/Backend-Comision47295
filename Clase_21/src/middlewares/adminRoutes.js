const adminRoutes = (req, res, next) => {
	if (req.session.rol === 'admin') {
		return res.redirect('/api/carts/mongo');
	} else {
		return res.redirect('/api/products/mongo');
	}

	next();
};

export default adminRoutes;
