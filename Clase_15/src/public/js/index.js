const socket = io();

let usuario = '';

//chat
Swal.fire({
	title: 'Ingresa un correo',
	input: 'text',
	confirmButtonText: 'Ingresar',
}).then((result) => {
	usuario = result.value;
});
const caja = document.getElementById('chat__input');
const contenido = document.getElementById('chat__contenido');

caja.addEventListener('change', (e) => {
	socket.emit('mensaje', {
		user: usuario,
		message: e.target.value,
	});
});
socket.on('nuevo_mensaje', (data) => {
	const mensajes = data.map(({ user, message }) => {
		return `<p>${user} dijo: ${message}</p>`;
	});

	contenido.innerHTML = mensajes.join('');
});

// productos

socket.on('todos_los_productos', async (data) => {
	let n = 0;
	const cuerpoHtml = data.map((producto) => {
		n++;

		return `<tr>
				<th scope='row'>${n}</th>
				<td>${producto.title}</td>
				<td>${producto.price}</td>
				<td>${producto.code}</td>
				<td>${producto.stock}</td>
			</tr>`;
	});
	document.querySelector('#tablaProductos').innerHTML = cuerpoHtml;
});

document.querySelector('#product__form').addEventListener('submit', (e) => {
	e.preventDefault();
	const newProd = {
		title: document.querySelector('#product__title').value,
		description: document.querySelector('#product__description').value,
		price: document.querySelector('#product__price').value,
		thumbnail: document.querySelector('#product__thumbnail').value,
		stock: document.querySelector('#product__stock').value,
		code: document.querySelector('#product__code').value,
		category: document.querySelector('#product__category').value,
	};
	console.log(newProd);
	socket.emit('newProduct', { newProd });
});
