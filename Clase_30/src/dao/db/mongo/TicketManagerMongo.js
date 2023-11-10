import { ticketModel } from '../../models/ticket.model.js';

class TicketManager {
	//CREATE TICKET
	async createTicket() {
		try {
			const ticket = await ticketModel.create();
			return ticket;
		} catch (error) {
			console.log('Capa de Controllador CartManager createTicket', error);
			throw error;
		}
	}
}
