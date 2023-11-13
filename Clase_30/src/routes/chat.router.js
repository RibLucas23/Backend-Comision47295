import { Router } from 'express';
import privatesRoutes from '../middlewares/privateRoutes.js';
const chatRouter = Router();

chatRouter.get('/', privatesRoutes, (req, res) => {
	const user = req.session.email;
	res.render('index', { user });
});

export default chatRouter;
