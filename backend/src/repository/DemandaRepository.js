import { getDb } from '../config/database.js';
import assert from "node:assert/strict";

export class DemandaRepository {

  async assertExists(id) {
    if (!id) return;
    const repository = getDb().getRepository('Demanda');
    const exists = await repository.existsBy({ id });
    assert(exists, "A Demanda informada não existe no banco de dados.");
  }

  async findById(id) {
    const repository = getDb().getRepository('Demanda');
    return repository.findOneOrFail({
      where: { id },
      relations: { ticket: true }
    });
  }

  async findByidUsuarioCreated(idUsuarioCreater) {
    const repository = getDb().getRepository('Demanda');
    return repository.find({
      where: { idUsuarioCreated: idUsuarioCreater }
    });
  }

  async findAll() {
    const repository = getDb().getRepository('Demanda');
    return repository.find({
      relations: { ticket: true }
    });
  }

  async create(demanda, manager = null) {
    const repository = manager ? manager.getRepository('Demanda') : getDb().getRepository('Demanda');
    const novaDemanda = repository.create(demanda);
    console.log("Criando nova demanda:", novaDemanda);
    return repository.save(novaDemanda);
  }

  async update(id, demanda, manager = null) {
    const repository = manager ? manager.getRepository('Demanda') : getDb().getRepository('Demanda');
    console.log("Atualizando demanda com id:", id, "Dados:", demanda);
    await repository.update(id, demanda);
    return this.findById(id);
  }
}

export const demandaRepository = new DemandaRepository();