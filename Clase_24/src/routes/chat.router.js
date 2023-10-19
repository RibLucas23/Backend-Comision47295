import { Router } from 'express';

const chatRouter = Router();

chatRouter.get('/', (req, res) => {
	res.render('index', {});
});

export default chatRouter;
