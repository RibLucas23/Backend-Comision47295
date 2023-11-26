//importo express
import express from 'express';
// importo session
import session from 'express-session';
//importo handlebars
import handlebars from 'express-handlebars';
//importo socket.io
import { Server } from 'socket.io';
//importo los routers
import session_router from './routes/session.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import chatRouter from './routes/chat.router.js';
import realTimeProducts from './routes/realTimeProducts.router.js';

import loggerTest from './routes/loggerTest.router.js';

//importo el modelo de mongo para el chat
import { messageModel } from './dao/models/messages.model.js';
//importo mongoose y mongoStore
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
// importo la config de passport
import initializePassport from './config/passport.config.js';
//importo dotenv y lo inicio
// import config from './config/env.config.js';
import dotenv from 'dotenv';
dotenv.config();
//importo el manejador de errores
//importo el logger y lo instancio mas abajo
// import { logger } from './utils/logger.js';   <=== logger lo importo en el archivo que vaya a utilizar el logger, pero "errors" lo inicializo con app()
import { errors } from './middlewares/errors/errorsWinston.js';
//instancio el sv con express
const app = express();

//conecto con mongoDB y mongoStore
mongoose.connect(process.env.MONGO_DB);
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_DB,
			ttl: 100,
		}),
		secret: process.env.SECRET_KEY_MONGO,
		resave: false,
		saveUninitialized: false,
	}),
);

//setteo los middleWares
app.use(express.static('./src/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(errors);
//levanto el servidor
const PORT = process.env.PORT;
const httpServer = app.listen(PORT, () =>
	console.log(`servidor corriendo en http://localhost:${PORT}/ `),
);
// handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');
// sockets
const socketServer = new Server(httpServer);

//rutas del router
app.use('/api/session', session_router);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/chat', chatRouter);
app.use('/realtimeproducts', realTimeProducts);

//loggerTest
app.use('/loggerTest', loggerTest);

//productos en home solo para el desafio
import ProductManager from './dao/db/fs/ProductManager.js';
import passport from 'passport';
import { configDotenv } from 'dotenv';
const products = new ProductManager('./src/dao/db/fs/products.json');

app.get('/', async (req, res) => {
	res.redirect('/api/session/login');
});

// Socket Server
// const mensajes = [];
socketServer.on('connection', async (socket) => {
	console.log(`se conecto el usuario con socket id: ${socket.id}`);
	//realtime products
	try {
		const productos = await products.getProducts();
		socket.emit('todos_los_productos', productos);
	} catch (error) {
		console.error('Error al obtener los productos:', error);
	}
	try {
		socket.on('newProduct', async (newProd) => {
			console.log(newProd);
			await products.addProduct(
				newProd.newProd.title,
				newProd.newProd.description,
				parseInt(newProd.newProd.price),
				newProd.newProd.thumbnail,
				parseInt(newProd.newProd.stock),
				newProd.newProd.category,
				newProd.newProd.code,
			);
			const productos = await products.getProducts();
			socketServer.emit('todos_los_productos', productos);
		});
	} catch (error) {
		console.error('Error al agregar nuevo produto:', error);
	}
	// Chat
	socket.on('mensaje', async (data) => {
		console.log(data);
		await messageModel.create(data);
		const mensajes = await messageModel.find().lean();
		console.log(mensajes);
		socketServer.emit('nuevo_mensaje', mensajes);
	});
});
