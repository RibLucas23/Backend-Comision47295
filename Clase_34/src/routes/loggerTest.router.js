import { Router } from 'express';
const loggerTest = Router();
import { logger } from '../utils/logger.js';

loggerTest.get('/', async (req, res) => {
	try {
		num = 'asd';
		if (num == 4) {
			throw error;
		}
		res.send('asd');
	} catch (error) {
		logger.debug('debug /b');
		logger.http('http /b');
		logger.info('info /b');
		logger.warn('warning /b');
		logger.error('error /b', error);
	}
});

export default loggerTest;
