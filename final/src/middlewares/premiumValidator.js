const premiumValidator = (req, res, next) => {
	const allowedRoles = ['admin', 'premium'];
	if (!allowedRoles.includes(req.session.rol)) {
		console.log('no sos admin ni premium');
		return res.send('no sos premium ni admin');
	}
	next();
};

export default premiumValidator;
