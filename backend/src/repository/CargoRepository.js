import { getDb } from '../config/database.js';

export class CargoRepository {
  async insertCargosPadrao() {
    const repository = getDb().getRepository('Cargo');
    
    const cargoCheck = await repository.find();
    
    if (cargoCheck.length === 0) {
      const cargos = [
        { id: 1, nome: 'Auxiliar de Suporte' },
        { id: 2, nome: 'Analista de Segurança' },
        { id: 3, nome: 'tecnico de infra' },
        { id: 4, nome: 'Arquiteto Cloud' }
      ];

      for (const cargo of cargos) {
        await repository.insert(cargo);
      }

      console.log('✔ Tabela Cargo populada com sucesso!');
    }
  }

  async findById(id) {
    const repository = getDb().getRepository('Cargo');
    return repository.findOne({ where: { id } });
  }

  async findAll() {
    const repository = getDb().getRepository('Cargo');
    return repository.find();
  }

  async create(cargo) {
    const repository = getDb().getRepository('Cargo');
    return repository.save(cargo);
  }

  async update(id, cargo) {
    const repository = getDb().getRepository('Cargo');
    await repository.update(id, cargo);
    return this.findById(id);
  }

  async delete(id) {
    const repository = getDb().getRepository('Cargo');
    return repository.delete(id);
  }
}
