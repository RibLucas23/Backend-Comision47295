import { ticketModel } from '../dao/models/ticket.model.js';

class TicketService {
	//CREATE TICKET
	async createTicket(ticket) {
		try {
			ticket.code = ticket.code.toString();
			ticket.purchase_datetime = ticket.purchase_datetime.toString();
			const response = await ticketModel.create(ticket);
			return response;
		} catch (error) {
			console.log('Capa de repository createTicket', error);
			throw new Error();
		}
	}
}

export default TicketService;
