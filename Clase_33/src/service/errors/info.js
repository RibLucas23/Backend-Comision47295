export const generateUserErrorInfo = (user) => {
	return `One or more properties were incomplete or not valid.
   List of required properties:
   * first_name: needs to be String, received ${user.first_name}
   * last_name: needs to be String, received ${user.last_name}
   * email: needs to be String, received ${user.email}
   `;
};

export const generateProductErrorInfo = (product) => {
	return `One or more properties were incomplete or not valid.
   List of required properties:
   * title: needs to be String, received ${product.title}
   * description: needs to be String, received ${product.description}
   * price: needs to be String, received ${product.price}
   *  thumbnail: needs to be String, received ${product.thumbnail}
   * stock: needs to be String, received ${product.stock}
   * category: needs to be String, received ${product.category}
   * code: needs to be String, received ${product.code}
   `;
};
