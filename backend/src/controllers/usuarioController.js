import { getDb } from '../config/database.js';
import { usuarioRepository } from '../repository/UsuarioRepository.js';
import { cargoRepository } from '../repository/CargoRepository.js';
import { UsuarioSchema } from '../entities/Usuario.js';
import assert from "node:assert/strict";


const omitirSenha = (usuario) => {
    const { senha, ...usuarioLimpo } = usuario;
    return usuarioLimpo;
};


export const buscarUsuarioPorId = async (req, res) => {

    const { id } = req.params;
    const usuario = await usuarioRepository.findById(Number(id));
    const { senha, ...usuarioSemSenha } = usuario;

    return res.status(200).json(usuarioSemSenha);
};


// LOGIN DE USUÁRIO
export const loginUsuario = async (req, res) => {

    const { email, senha } = req.body;
    const usuario = await usuarioRepository.findByEmailAndSenha(email, senha);

    return res.status(200).json({ 
        message: "Login realizado com sucesso.", 
        usuario: omitirSenha(usuario) 
    });
}


// CADASTRO DE USUÁRIO
export const cadastroUsuario = async (req, res) => {

  const dadosDeEntrada = req.body; 
  await cargoRepository.assertExists(dadosDeEntrada.idCargo);
  const novoUsuario = await usuarioRepository.create(dadosDeEntrada);

  return res.status(201).json(omitirSenha(novoUsuario));
}


// ATUALIZAÇÃO DE USUÁRIO
export const atualizarUsuario = async (req, res) => {
  
  const { id } = req.params;
  const dadosDeEntrada = req.body;
  await cargoRepository.assertExists(dadosDeEntrada.idCargo);

  const usuarioAtualizado = await usuarioRepository.update(Number(id), dadosDeEntrada);
  const { senha, ...usuarioSemSenha } = usuarioAtualizado;

  return res.status(200).json(omitirSenha(usuarioAtualizado));
}


// ATUALIZAÇÃO DE SENHA
export const atualizarSenha = async (req, res) => {
    
  const { email, novaSenha } = req.body;
  const usuario = await usuarioRepository.findByEmail(email);
  await usuarioRepository.update(usuario.id, { senha: novaSenha });

  return res.status(200).json({ message: "Senha atualizada com sucesso." });
};


// ATIVAÇÃO / DESATIVAÇÃO DE USUÁRIO
export const alterarStatusUsuario = async (req, res) => {
  
  const { id } = req.params;
  const { ativo } = req.body;
  const usuarioAtualizado = await usuarioRepository.update(Number(id), { ativo });
        
  return res.status(200).json(omitirSenha(usuarioAtualizado));
};