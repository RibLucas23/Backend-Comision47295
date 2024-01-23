import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Test  Cart', () => {
	it('deberia traer todos carts haciendo GET /api/carts/mongo', async () => {
		const response = await requester.get('/api/carts/mongo');
		console.log(response.body);
		expect(response.status).to.equal(200);

		expect(response.body).to.be.ok;
		expect(response.body).to.be.an('array');
	});
});
