import { getDb } from '../config/database.js';

export class UsuarioCargoRepository {
  async atribuirCargoAoUsuario(usuarioId, cargoId) {
    const repository = getDb().getRepository('UsuarioCargo');
    
    // Verificar se já existe
    const existe = await repository.findOne({
      where: { usuarioId, cargoId }
    });

    if (!existe) {
      await repository.insert({
        usuarioId,
        cargoId
      });
    }

    return existe;
  }

  async removerCargoDoUsuario(usuarioId, cargoId) {
    const repository = getDb().getRepository('UsuarioCargo');
    return repository.delete({
      usuarioId,
      cargoId
    });
  }

  async obterCargosDoUsuario(usuarioId) {
    const repository = getDb().getRepository('UsuarioCargo');
    return repository.find({
      where: { usuarioId },
      relations: ['cargo']
    });
  }

  async obterUsuariosComCargo(cargoId) {
    const repository = getDb().getRepository('UsuarioCargo');
    return repository.find({
      where: { cargoId },
      relations: ['usuario']
    });
  }

  async verificarSeUsuarioTemCargo(usuarioId, cargoId) {
    const repository = getDb().getRepository('UsuarioCargo');
    return repository.findOne({
      where: { usuarioId, cargoId }
    });
  }
}
