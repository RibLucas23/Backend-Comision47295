import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');
describe('Test  Login', () => {
	it('deberia loguear al usuario haciendo POST /api/session/login', async () => {
		const userCredentials = {
			email: 'asd',
			password: 'asd',
		};

		const response = await requester
			.post('/api/session/login')
			.send(userCredentials)
			.expect(302); // Espera una redirección después del inicio de sesión exitoso
		expect(response.header['location']).to.equal('/api/session/current');
	});
});
