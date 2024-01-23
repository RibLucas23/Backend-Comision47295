import { faker } from '@faker-js/faker';

const productFaker = {
	title: faker.commerce.product(),
	description: faker.commerce.productDescription(),
	price: faker.string.numeric(3),
	thumbnail: faker.image.urlPicsumPhotos(),
	stock: faker.string.numeric(2),
	category: faker.commerce.productMaterial(),
	code: faker.finance.ethereumAddress(),
};

export default productFaker;
