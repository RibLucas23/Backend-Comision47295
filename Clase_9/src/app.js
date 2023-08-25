//importo express
import express, { response } from 'express';
//importo los routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

//instancio el sv con express
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//ruta principal
app.get('/', async (req, res) => {
	// res.send("asd")
	const asd = `<a href="/products">productos</a><br>
    <a href="/api/products/?limit=1">productos con limte 1</a><br>
    <a href="/api/products/?limit=2">productos con limte 2</a><br>
    <a href="/api/products/?limit=3">productos con limte 3</a><br>
    <a href="/api/products/0">producto 0</a><br>
    <a href="/api/products/1">producto 1</a><br>
    <a href="/api/products/2">producto 2</a>`;
	res.send(asd);
});
//rutas del router
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//levanto el servidor
const PORT = 8080;
app.listen(PORT, () =>
	console.log(`servidor corriendo en http://localhost:${PORT}/ `),
);
