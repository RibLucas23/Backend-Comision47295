import winston from 'winston';
import 'dotenv/config';

const customLevelsOptions = {
	colors: {
		error: 'red',
		warning: 'yellow',
		info: 'blue',
		debug: 'green',
	},
};

const config = {
	PRODUCTION: {
		transports: [
			new winston.transports.Console({
				level: 'info',
				format: winston.format.combine(
					winston.format.colorize({ colors: customLevelsOptions.colors }),
					winston.format.simple(),
				),
			}),
			new winston.transports.File({
				filename: 'errors.log',
				level: 'error',
			}),
		],
	},
	DEVELOPMENT: {
		transports: [
			new winston.transports.Console({
				level: 'debug',
				format: winston.format.combine(
					winston.format.colorize({ colors: customLevelsOptions.colors }),
					winston.format.simple(),
				),
			}),
			new winston.transports.File({
				filename: 'errors.log',
				level: 'error',
			}),
		],
	},
};

export const logger = winston.createLogger(config[process.env.ENVIRONMENT]);
