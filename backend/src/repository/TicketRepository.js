import { getDb } from '../config/database.js';

export class TicketRepository {
  async findById(id) {
    const repository = getDb().getRepository('Ticket');
    return repository.findOne({
      where: { id },
      relations: ['servico', 'status', 'demanda']
    });
  }

  async findAll() {
    const repository = getDb().getRepository('Ticket');
    return repository.find({
      relations: ['servico', 'status', 'demanda']
    });
  }

  async findByServico(servicoId) {
    const repository = getDb().getRepository('Ticket');
    return repository.find({
      where: { idServico: servicoId },
      relations: ['servico', 'status', 'demanda']
    });
  }

  async findByStatus(statusId) {
    const repository = getDb().getRepository('Ticket');
    return repository.find({
      where: { idStatus: statusId },
      relations: ['servico', 'status', 'demanda']
    });
  }

  async create(ticket) {
    const repository = getDb().getRepository('Ticket');
    return repository.save(ticket);
  }

  async update(id, ticket) {
    const repository = getDb().getRepository('Ticket');
    await repository.update(id, ticket);
    return this.findById(id);
  }

  async delete(id) {
    const repository = getDb().getRepository('Ticket');
    return repository.delete(id);
  }

  async obterServicoDoTicket(id) {
    const repository = getDb().getRepository('Ticket');
    const ticket = await repository.findOne({
      where: { id },
      relations: ['servico']
    });
    return ticket ? ticket.servico : null;
  }

  async obterStatusDoTicket(id) {
    const repository = getDb().getRepository('Ticket');
    const ticket = await repository.findOne({
      where: { id },
      relations: ['status']
    });
    return ticket ? ticket.status : null;
  }
}
