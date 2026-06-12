import { usuarioRepository } from '../repository/UsuarioRepository.js';
import { cargoRepository } from '../repository/CargoRepository.js';
import { UsuarioSchema } from '../entities/Usuario.js';
import { enviarCodigoVerificacao } from '../utils/enviaEmail.js';


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

  if (usuario.ativo !== true) {
    return res.status(403).json({
      message: "Sua conta está inativa. Entre em contato com o suporte."
    });
  }

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


// NÃO APAGA ESSA CONST, ELA SALVA TEMPORARIAMENTE O VALOR //
const codigosTemporarios = {}; 
// NÃO APAGA ESSA CONST, ELA SALVA TEMPORARIAMENTE O VALOR //
export const sendEmailSenha = async (req, res) => {
  const { email } = req.body;
  
  try {
    const usuario = await usuarioRepository.findByEmail(email);
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    codigosTemporarios[email] = {
      codigo: codigo,
      expiraEm: Date.now() + 900000
    };

    await enviarCodigoVerificacao(email, codigo);
    return res.status(200).json({ message: "Código enviado para seu e-mail." });

  } catch (error) {
    return res.status(404).json({ message: "E-mail de usuário não encontrado." });
  }
};


export const atualizarSenha = async (req, res) => {
  const { email, codigo, novaSenha } = req.body;
  const registro = codigosTemporarios[email];

  if (!registro || registro.codigo !== codigo) {
    return res.status(400).json({ message: "Código inválido." });
  }

  try {
    const usuario = await usuarioRepository.findByEmail(email);

    await usuarioRepository.update(usuario.id, { senha: novaSenha });
    delete codigosTemporarios[email];

    return res.status(200).json({ message: "Senha atualizada com sucesso." });
    
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar a senha no banco de dados." });
  }
};


// ATIVAÇÃO / DESATIVAÇÃO DE USUÁRIO
export const ativacaoUsuario = async (req, res) => {

  const { id } = req.params;
  const { ativo } = req.body;
  const usuarioAtualizado = await usuarioRepository.update(Number(id), { ativo });

  return res.status(200).json(omitirSenha(usuarioAtualizado));
};