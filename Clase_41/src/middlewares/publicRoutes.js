const publicRoutes = (req, res, next) => {
	if (req.session.isLogged) {
		return res.redirect('/api/products/mongo');
	}
	next();
};

export default publicRoutes;
