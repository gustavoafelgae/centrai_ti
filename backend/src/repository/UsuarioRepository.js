import { getDb } from '../config/database.js';
import assert from "node:assert/strict";

export class UsuarioRepository {
  async findById(id) {
    console.log("Buscando usuario por id:", id);
    const repository = getDb().getRepository('Usuario');
    return repository.findOneOrFail({ 
      where: { id },
      relations: { cargo: true }
    });
  }

  async findByEmail(email) {
    console.log("Buscando usuario por email:", email);
    const repository = getDb().getRepository('Usuario');
    return repository.findOneOrFail({ 
      where: { email } 
    });
  }

  async findAll() {
    console.log("Buscando todos os usuarios");
    const repository = getDb().getRepository('Usuario');
    return repository.find({
      relations: { cargo: true }
    });
  }

  async findByEmailAndSenha(email, senha) {
    console.log("Realizando login do usuario:", email);
    const repository = getDb().getRepository('Usuario');
    return repository.findOneOrFail({ 
      where: { email, senha },
      relations: { cargo: true }
    });
  }

  async create(usuario) {
    const repository = getDb().getRepository('Usuario');
    const novoUsuario = repository.create(usuario);
    console.log("Criando novo usuario:", usuario);
    return repository.save(novoUsuario);
  }

  async update(id, usuario) {
    console.log("Atualizando usuario com id:", id, "Dados:", usuario);
    const repository = getDb().getRepository('Usuario');
    await repository.update(id, usuario);
    return this.findById(id);
  }

  async delete(id) {
    console.log("Desativando usuario com id:", id);
    const repository = getDb().getRepository('Usuario');
    return repository.delete(id);
  }

  async obterCargosDoUsuario(id) {
    console.log("Obtendo cargo com id:", id); 
    const repository = getDb().getRepository('Usuario');
    const usuario = await repository.findOne({
      where: { id },
      relations: { cargo: true }
    });
    return usuario ? usuario.cargos : [];
  }

  async assertExists(id) {
    console.log("Verificando existência do usuário com id:", id);
    const repository = getDb().getRepository('Usuario');
    const exists = await repository.existsBy({ id });
    assert(exists, "O Usuário informado não existe no banco de dados.");
  }
}

export const usuarioRepository = new UsuarioRepository();