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
