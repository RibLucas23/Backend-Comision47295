import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');
describe('Test traer productos', () => {
	it('Deberia devolver un array de productos haciendo GET /api/products/mongo', async () => {
		const response = await requester.get('/api/products/mongo');

		expect(response.status).to.equal(200);
		expect(response.body.status).to.equal('success');
		expect(response.body.payload).to.be.ok;
		expect(response.body.payload).to.be.an('array');
	});
});
