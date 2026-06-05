import { getDb } from '../config/database.js';

export class StatusNomeRepository {
  async insertStatusPadrao() {
    const repository = getDb().getRepository('StatusNome');
    
    const statusCheck = await repository.find();
    
    if (statusCheck.length === 0) {
      const statuses = [
        { nome: 'Aberto' },
        { nome: 'Em Andamento' },
        { nome: 'Finalizado' },
        { nome: 'Cancelado' }
      ];

      for (const status of statuses) {
        await repository.insert(status);
      }

      console.log('✔ Tabela Status_Nome populada com sucesso!');
    }
  }

  async findById(id) {
    const repository = getDb().getRepository('StatusNome');
    return repository.findOne({ 
      where: { id },
      relations: ['statuses']
    });
  }

  async findAll() {
    const repository = getDb().getRepository('StatusNome');
    return repository.find({
      relations: ['statuses']
    });
  }

  async create(status) {
    const repository = getDb().getRepository('StatusNome');
    return repository.save(status);
  }

  async update(id, status) {
    const repository = getDb().getRepository('StatusNome');
    await repository.update(id, status);
    return this.findById(id);
  }

  async delete(id) {
    const repository = getDb().getRepository('StatusNome');
    return repository.delete(id);
  }

  async obterStatusDoStatusNome(id) {
    const repository = getDb().getRepository('StatusNome');
    const statusNome = await repository.findOne({
      where: { id },
      relations: ['statuses']
    });
    return statusNome ? statusNome.statuses : [];
  }
}
