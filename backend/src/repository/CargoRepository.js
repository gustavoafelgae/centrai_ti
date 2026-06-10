import { getDb } from '../config/database.js';
import assert from "node:assert/strict";

export class CargoRepository {
  async insertCargosPadrao() {
    const repository = getDb().getRepository('Cargo');
    
    const cargoCheck = await repository.find();
    
    if (cargoCheck.length === 0) {
      console.log('... Populando Cargos iniciais ...');
      const cargos = [
        { id: 1, nome: 'Auxiliar de Suporte' },
        { id: 2, nome: 'Analista de Segurança' },
        { id: 3, nome: 'tecnico de infra' },
        { id: 4, nome: 'Arquiteto Cloud' },
        { id: 5, nome: 'Solicitante' }
      ];

      for (const cargo of cargos) {
        await repository.insert(cargo);
      }

      console.log('✔ Tabela Cargo populada com sucesso!');
    }
  }

  async assertExists(id) {
    console.log("Verificando existência do cargo com id:", id);
    const repository = getDb().getRepository('Cargo');
    const exists = await repository.existsBy({ id });
    assert(exists, "O Cargo informado não existe no banco de dados.");
  }

  async existsBy(id) {
    const repository = getDb().getRepository('Cargo');
    const exists = await repository.existsBy({ id });
    assert(exists, "O Cargo informado não existe no banco de dados.");
  }

  async findById(id) {
    const repository = getDb().getRepository('Cargo');
    return repository.findOneOrFail({ where: { id } });
  }

  async findAll() {
    console.log("Buscando todos os cargos...");
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

export const cargoRepository = new CargoRepository();
