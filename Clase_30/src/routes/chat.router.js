import { Router } from 'express';
import privatesRoutes from '../middlewares/privateRoutes.js';
const chatRouter = Router();

chatRouter.get('/', privatesRoutes, (req, res) => {
	res.render('index', {});
});

export default chatRouter;
