import express from 'express';
import {cadastroUsuario,loginUsuario,atualizarUsuario,atualizarSenha,ativacaoUsuario,sendEmailSenha} from '../controllers/usuarioController.js';
import { validateData } from "../middlewares/validateData.js";
import { criarUsuarioDTO,loginUsuarioDTO,atualizarUsuarioDTO,atualizarSenhaDTO,ativacaoUsuarioDTO,sendEmailSenhaDTO } from "../validations/usuarioSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post('/login', 
    validateData(loginUsuarioDTO),
    asyncHandler(loginUsuario)
);

router.post('/cadastro', 
    validateData(criarUsuarioDTO),
    asyncHandler(cadastroUsuario)
);

router.patch('/atualizar/:id', 
    validateData(atualizarUsuarioDTO),
    asyncHandler(atualizarUsuario)
);

router.patch('/senha', 
    validateData(atualizarSenhaDTO),
    asyncHandler(atualizarSenha)
);

router.post('/esqueci-senha', 
    validateData(sendEmailSenhaDTO),
    asyncHandler(sendEmailSenha)
);

router.patch('/ativacao/:id', 
    validateData(ativacaoUsuarioDTO),
    asyncHandler(ativacaoUsuario)
);

export default router;
