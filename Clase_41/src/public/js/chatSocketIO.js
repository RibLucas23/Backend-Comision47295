const socket = io();

let usuario = '';

let user = document.querySelector('#userEmail');
user = user.textContent;
const caja = document.getElementById('chat__input');
const contenido = document.getElementById('chat__contenido');

caja.addEventListener('change', (e) => {
	socket.emit('mensaje', {
		user: user,
		message: e.target.value,
	});
});
socket.on('nuevo_mensaje', (data) => {
	const mensajes = data.map(({ user, message }) => {
		return `	<p class="chatText" > <span class="chatEmail"> ${user} </span>  dijo:<span class="chatMsj"> ${message}</span> </p>
		`;
	});

	contenido.innerHTML = mensajes.join('');
});
