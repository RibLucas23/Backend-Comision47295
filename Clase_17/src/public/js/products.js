const price_svg_desc = document.getElementById('price_svg_desc');
const price_svg_asc = document.getElementById('price_svg_asc');
const buscador_tabla = document.getElementById('buscador_tabla');
//Buscador, cuando se aprieta enter, busca lo que se haya escrito en el input
buscador_tabla.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		const searchTerm = buscador_tabla.value;
		window.location.href = `/api/products/mongo?query=${searchTerm}`;
		event.preventDefault();
	}
});
//ordenan los precios de mayor a menor y viceversa
price_svg_desc.addEventListener('click', () => {
	window.location.href = '/api/products/mongo?sort=desc';
});
price_svg_asc.addEventListener('click', () => {
	window.location.href = '/api/products/mongo?sort=asc';
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
				const response = await fetch(`/api/products/mongo/${productId}`, {
					method: 'DELETE',
				});

				if (response.ok) {
					window.location.href = '/api/products/mongo';
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

// ADD TO CART BUTTON

const addToCartButton = document.querySelectorAll('.addToCartButton');
let cartId = '';

Swal.fire({
	title: 'Ingresa el ID del CART',
	input: 'text',
	confirmButtonText: 'Ingresar',
}).then((result) => {
	cartId = result.value;
});
addToCartButton.forEach(function (product) {
	product.addEventListener('click', async function () {
		try {
			const Pid = this.getAttribute('productId'); // Obtiene el valor de data-id
			console.log(
				'Botón de agregar producto al cart haciendo clic en el producto:',
				Pid,
			);

			// Realizar una solicitud para agregar el producto utilizando el productId
			const response = await fetch(
				`/api/carts/mongo/${cartId}/product/${Pid}`,
				{
					method: 'PUT',
				},
			);

			if (response.ok) {
				alert('Producto Agregado con éxito');
			} else {
				console.error('Error al eliminar el producto');
			}
		} catch (error) {
			console.error(error);
		}
	});
});
