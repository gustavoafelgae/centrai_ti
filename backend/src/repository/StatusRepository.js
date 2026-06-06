import { getDb } from '../config/database.js';

export class StatusRepository {

  async findAll() {
    const repository = getDb().getRepository('Status');
    return repository.find({
      relations: { statusNome: true }
    });
  }

  async findByTicket(ticketId) {
    const repository = getDb().getRepository('Status');
    return repository.find({
      where: { ticketId },
      relations: { statusNome: true },
      order: { data: 'DESC' }
    });
  }

  async findByStatusNome(statusNomeId) {
    const repository = getDb().getRepository('Status');
    return repository.find({
      where: { statusNomeId },
      relations: { statusNome: true }
    });
  }

  async insert(status, manager = null) {
    const repository = manager ? manager.getRepository('Status') : getDb().getRepository('Status');
    console.log("Inserindo status de ticket:", status);
    return repository.createQueryBuilder()
      .insert()
      .into('Status')
      .values(status)
      .updateEntity(false) 
      .execute();
  }

  async obterStatusNomeDoStatus(id) {
    const repository = getDb().getRepository('Status');
    const status = await repository.findOneOrFail({
      where: { id },
      relations: { statusNome: true }
    });
    return status ? status.statusNome : null;
  }

async obterUltimoStatusDoTicket(ticketId) {
    const repository = getDb().getRepository('Status');
    const [ultimoStatus] = await repository.find({
      where: { ticketId },
      relations: { statusNome: true },
      order: { data: 'DESC' },
      take: 1 
    });
    return ultimoStatus || null;
  }
}

export const statusRepository = new StatusRepository();