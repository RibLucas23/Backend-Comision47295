// DELETE BUTTON CART DETAIL
const cart_id = document.querySelector('#cart_id');
const emptyButtonCartDetail = document.querySelector('#emptyButtonCartDetail');
const deleteButtonCartDetail = document.querySelectorAll(
	'.deleteButtonCartDetail',
);
const buyButtonCartDetail = document.querySelector('#buyButtonCartDetail');

emptyButtonCartDetail.addEventListener('click', async () => {
	try {
		// Realizar una solicitud para vaciar el cart
		const Cid = cart_id.getAttribute('cartId'); // Obtiene el valor de cartId

		const response = await fetch(`/api/carts/mongo/${Cid}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			alert('Cart Vaciado con éxito');
			window.location.href = `/api/carts/mongo/${Cid}`;
		} else {
			console.error('Error al vaciar el cart');
		}
	} catch (error) {}
});
deleteButtonCartDetail.forEach(function (product) {
	product.addEventListener('click', async function () {
		try {
			console.log('asd');

			const Cid = cart_id.getAttribute('cartId'); // Obtiene el valor de cartId
			const Pid = this.getAttribute('productId'); // Obtiene el valor de productId
			console.log(
				'Botón de Borrar producto del cart haciendo clic en el button:',
				Pid,
			);
			console.log(Cid);
			console.log(Pid);

			// Realizar una solicitud para eliminar el producto utilizando el productId y cartId
			const response = await fetch(
				`/api/carts/mongo/${Cid}/product/${Pid}`,
				{
					method: 'DELETE',
				},
			);

			if (response.ok) {
				alert('Producto Eliminado con éxito');
				window.location.href = `/api/carts/mongo/${Cid}`;
			} else {
				console.error('Error al eliminar el producto');
			}
		} catch (error) {
			console.error(error);
		}
	});
});

buyButtonCartDetail.addEventListener('click', async () => {
	try {
		// Realizar una solicitud para vaciar el cart
		const Cid = cart_id.getAttribute('cartId'); // Obtiene el valor de cartId
		window.location.href = `/api/carts/mongo/${Cid}/purchase`;

		// const response = await fetch(`/api/carts/mongo/${Cid}/purchase`, {
		// 	method: 'GET',
		// });

		// if (response.ok) {
		// 	alert('Compra exitosa');
		// 	window.location.href = `/api/carts/mongo/${Cid}/purchase`;
		// } else {
		// 	console.error('Compra exitosa');
		// }
	} catch (error) {}
});
