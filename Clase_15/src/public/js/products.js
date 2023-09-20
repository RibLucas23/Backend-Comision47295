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
