import { getDb } from '../config/database.js';

export class TicketRepository {
  async findById(id) {
    const repository = getDb().getRepository('Ticket');
    return repository.findOne({
      where: { id },
      relations: { servico: true, status: true, demanda: true }
    });
  }

  async findByIds(ids) {
    const repository = getDb().getRepository('Ticket');

    return repository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.servico', 'servico')
      .leftJoinAndSelect('ticket.demanda', 'demanda')
      .leftJoinAndSelect('ticket.status', 'status',
        'status.data = (SELECT MAX(s.data) FROM status s WHERE s.ticket_id = ticket.id)'
      )
      .where('ticket.id IN (:...ids)', { ids })
      .orderBy('ticket.id', 'DESC')
      .getMany();
  }

  async findAll() {
    const repository = getDb().getRepository('Ticket');
    return repository.find({
      relations: { servico: true, status: true, demanda: true }
    });
  }

  async findByServico(servicoId) {
    const repository = getDb().getRepository('Ticket');
    return repository.find({
      where: { idServico: servicoId },
      relations: { servico: true, demanda: true }
    });
  }

  async findBySerial(serial) {
    console.log("Buscando ticket por serial:", serial);
    const repository = getDb().getRepository('Ticket');
    return repository.findOneOrFail({
      where: { serial },
      relations: { servico: true, status: true, demanda: true }
    });
  }

  async create(ticket, manager = null) {
    const repository = manager ? manager.getRepository('Ticket') : getDb().getRepository('Ticket');
    const novoTicket = repository.create(ticket);
    console.log("Criando novo ticket:", novoTicket);
    return repository.save(novoTicket);
  }

  async update(id, ticket, manager = null) {
    const repository = manager ? manager.getRepository('Ticket') : getDb().getRepository('Ticket');
    console.log("Atualizando ticket:", ticket);
    await repository.update(id, ticket);
    return this.findById(id);
  }

  async delete(id) {
    const repository = getDb().getRepository('Ticket');
    return repository.delete(id);
  }

  async gerarProximoSerial(manager = null) {
    const repository = manager ? manager.getRepository('Ticket') : getDb().getRepository('Ticket');

    const [ultimoTicket] = await repository.find({
      order: { id: 'DESC' },
      take: 1
    });

    if (!ultimoTicket || !ultimoTicket.serial)
      return 'TK-000001';

    const parteNumerica = ultimoTicket.serial.split('-')[1];
    const numeroAtual = parseInt(parteNumerica, 10);
    const proximoNumero = numeroAtual + 1;
    return `TK-${String(proximoNumero).padStart(6, '0')}`;
  }

}

export const ticketRepository = new TicketRepository();