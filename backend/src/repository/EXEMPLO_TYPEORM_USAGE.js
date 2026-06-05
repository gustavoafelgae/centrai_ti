// Exemplo de como usar TypeORM nos repositórios

import { getDb } from '../config/database.js';

export class UsuarioRepository {
  // Encontrar todos os usuários
  static async findAll() {
    const db = getDb();
    return await db.getRepository('Usuario').find();
  }

  // Encontrar usuário por ID
  static async findById(id) {
    const db = getDb();
    return await db.getRepository('Usuario').findOneBy({ id });
  }

  // Encontrar usuário por email
  static async findByEmail(email) {
    const db = getDb();
    return await db.getRepository('Usuario').findOneBy({ email });
  }

  // Criar novo usuário
  static async create(usuario) {
    const db = getDb();
    const repository = db.getRepository('Usuario');
    const novoUsuario = repository.create(usuario);
    return await repository.save(novoUsuario);
  }

  // Atualizar usuário
  static async update(id, dadosAtualizacao) {
    const db = getDb();
    const repository = db.getRepository('Usuario');
    await repository.update({ id }, dadosAtualizacao);
    return await repository.findOneBy({ id });
  }

  // Deletar usuário
  static async delete(id) {
    const db = getDb();
    const repository = db.getRepository('Usuario');
    return await repository.delete({ id });
  }

  // Encontrar usuários com relações
  static async findWithRelations(id) {
    const db = getDb();
    return await db.getRepository('Usuario').findOne({
      where: { id },
      relations: ['cargo'] // carrega a relação com Cargo
    });
  }
}

/**
 * GUIA DE USO:
 * 
 * 1. Importar o repositório:
 *    import { UsuarioRepository } from '../repository/UsuarioRepository.js';
 * 
 * 2. Usar os métodos:
 *    const usuarios = await UsuarioRepository.findAll();
 *    const usuario = await UsuarioRepository.findById(1);
 *    const novoUsuario = await UsuarioRepository.create({ nome: 'João', email: 'joao@email.com', senha: '123' });
 * 
 * 3. Dentro de controllers:
 *    try {
 *      const usuario = await UsuarioRepository.findByEmail(req.body.email);
 *      if (usuario) {
 *        // verificar senha, etc
 *      }
 *    } catch (error) {
 *      res.status(500).json({ error: error.message });
 *    }
 */
