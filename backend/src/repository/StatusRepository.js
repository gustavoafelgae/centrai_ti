import { getDb } from '../config/database.js';

export class StatusRepository {
  async findById(id) {
    const repository = getDb().getRepository('Status');
    return repository.findOne({
      where: { id },
      relations: ['statusNome']
    });
  }

  async findAll() {
    const repository = getDb().getRepository('Status');
    return repository.find({
      relations: ['statusNome']
    });
  }

  async findByTicket(ticketId) {
    const repository = getDb().getRepository('Status');
    return repository.find({
      where: { ticketId },
      relations: ['statusNome'],
      order: { data: 'DESC' }
    });
  }

  async findByStatusNome(statusNomeId) {
    const repository = getDb().getRepository('Status');
    return repository.find({
      where: { statusNomeId },
      relations: ['statusNome']
    });
  }

  async create(status) {
    const repository = getDb().getRepository('Status');
    return repository.save(status);
  }

  async update(id, status) {
    const repository = getDb().getRepository('Status');
    await repository.update(id, status);
    return this.findById(id);
  }

  async delete(id) {
    const repository = getDb().getRepository('Status');
    return repository.delete(id);
  }

  async obterStatusNomeDoStatus(id) {
    const repository = getDb().getRepository('Status');
    const status = await repository.findOne({
      where: { id },
      relations: ['statusNome']
    });
    return status ? status.statusNome : null;
  }

  async obterUltimoStatusDoTicket(ticketId) {
    const repository = getDb().getRepository('Status');
    return repository.findOne({
      where: { ticketId },
      relations: ['statusNome'],
      order: { data: 'DESC' }
    });
  }
}
