import { getDb } from '../config/database.js';

export class UsuarioRepository {
  async findById(id) {
    const repository = getDb().getRepository('Usuario');
    return repository.findOne({ 
      where: { id },
      relations: ['cargos', 'cargos.cargo']
    });
  }

  async findAll() {
    const repository = getDb().getRepository('Usuario');
    return repository.find({
      relations: ['cargos', 'cargos.cargo']
    });
  }

  async findByEmail(email) {
    const repository = getDb().getRepository('Usuario');
    return repository.findOne({ 
      where: { email },
      relations: ['cargos', 'cargos.cargo']
    });
  }

  async create(usuario) {
    const repository = getDb().getRepository('Usuario');
    return repository.save(usuario);
  }

  async update(id, usuario) {
    const repository = getDb().getRepository('Usuario');
    await repository.update(id, usuario);
    return this.findById(id);
  }

  async delete(id) {
    const repository = getDb().getRepository('Usuario');
    return repository.delete(id);
  }

  async obterCargosDoUsuario(id) {
    const repository = getDb().getRepository('Usuario');
    const usuario = await repository.findOne({
      where: { id },
      relations: ['cargos', 'cargos.cargo']
    });
    return usuario ? usuario.cargos : [];
  }
}
