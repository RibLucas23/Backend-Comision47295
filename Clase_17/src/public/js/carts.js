const carts = document.querySelectorAll('.cart_id_tabla');
carts.forEach(function (cart) {
	cart.addEventListener('click', function () {
		const id = this.getAttribute('data-id'); // Obtiene el valor de data-id
		window.location.href = `/api/carts/mongo/${id}`;
	});
});

// ADD CART BUTTON
const addCartBtn = document.querySelector('#addCartBtn');
addCartBtn.addEventListener('click', async () => {
	const response = await fetch(`/api/carts/mongo`, {
		method: 'POST',
	});

	if (response.ok) {
		window.location.href = '/api/carts/mongo';
		console.log('Cart agregado con éxito');
	} else {
		console.error('Error al agregar el cart');
	}
});
//DELETE BUTTON
//evento click a cada botón de eliminación
document.addEventListener('DOMContentLoaded', function () {
	const deleteButtons = document.querySelectorAll('[id^="deleteButton-"]');

	deleteButtons.forEach((button) => {
		const productId = button.id.split('-')[1]; // Obtener el _id del producto

		button.addEventListener('click', async () => {
			try {
				console.log(
					'Botón de eliminación haciendo clic en el producto:',
					productId,
				);

				// Realizar una solicitud para eliminar el producto utilizando el productId
				const response = await fetch(`/api/carts/mongo/${productId}`, {
					method: 'DELETE',
				});

				if (response.ok) {
					window.location.href = '/api/carts/mongo';
					console.log('Producto eliminado con éxito');
				} else {
					console.error('Error al eliminar el producto');
				}
			} catch (error) {
				console.error(error);
			}
		});
	});
});
