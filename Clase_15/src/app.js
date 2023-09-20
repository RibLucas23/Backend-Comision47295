//importo express
import express from 'express';
//importo handlebars
import handlebars from 'express-handlebars';
//importo socket.io
import { Server } from 'socket.io';
//importo los routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import chatRouter from './routes/chat.router.js';
import realTimeProducts from './routes/realTimeProducts.router.js';
//importo el modelo de mongo para el chat
import { messageModel } from './dao/models/messages.model.js';
//importo mongoose
import mongoose from 'mongoose';
//conecto con mongoDB
mongoose.connect(
	'mongodb+srv://lacuentadelcs:kL1KKIiSF79BG3F1@cluster0.w9hb72v.mongodb.net/ecommerce?retryWrites=true&w=majority',
);

//instancio el sv con express y setteo los middleWares
const app = express();
app.use(express.static('./src/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//levanto el servidor
const PORT = 8080;
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
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/chat', chatRouter);
app.use('/realtimeproducts', realTimeProducts);

//productos en home solo para el desafio
import ProductManager from './dao/db/fs/ProductManager.js';
const products = new ProductManager('./src/dao/db/fs/products.json');

app.get('/', async (req, res) => {
	const productsAll = await products.getProducts();
	res.render('home', { productsAll });
});
app.post('/', async (req, res) => {
	const prod = req.body;
	await products.addProduct(
		prod.title,
		prod.description,
		parseInt(prod.price),
		prod.thumbnail,
		parseInt(prod.stock),
		prod.category,
		prod.code,
	);
	res.status(200).send(prod);
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
