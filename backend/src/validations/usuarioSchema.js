import { z } from "zod";

// PayLoad de login
export const loginUsuarioDTO = z.object({
    email: z.string({ required_error: "O e-mail é obrigatório." })
            .email("Formato de e-mail inválido.")
            .max(80, "O e-mail não pode ter mais de 80 caracteres."),

    senha: z.string({ required_error: "A senha é obrigatória." })
            .length(64, "A senha deve ter exatamente 64 caracteres (Formato SHA-256).")
            .regex(/^[a-fA-F0-9]{64}$/, "A senha informada não é um hash SHA-256 válido."),
}).strict();


// PayLoad de criação de usuário
export const criarUsuarioDTO = z.object({
    nome: z.string({ required_error: "O nome é obrigatório." })
           .max(255, "O nome não pode ter mais de 255 caracteres."),
           
    email: z.string({ required_error: "O e-mail é obrigatório." })
            .email("Formato de e-mail inválido.")
            .max(80, "O e-mail não pode ter mais de 80 caracteres."),
            
    telefone: z.string({ required_error: "O telefone é obrigatório." })
               .length(11, "O telefone deve ter exatamente 11 caracteres numéricos."),

    senha: z.string({ required_error: "A senha é obrigatória." })
            .length(64, "A senha deve ter exatamente 64 caracteres (Formato SHA-256).")
            .regex(/^[a-fA-F0-9]{64}$/, "A senha informada não é um hash SHA-256 válido."),
            
    idCargo: z.number({ invalid_type_error: "O ID do cargo deve ser um número inteiro." })
              .int()
              .positive("O ID do cargo deve ser maior que zero.")
}).strict();


// PayLoad de atualização de usuário
export const atualizarUsuarioDTO = z.object({
    nome: z.string()
           .max(255, "O nome não pode ter mais de 255 caracteres.")
           .optional(),
           
    email: z.string()
            .email("Formato de e-mail inválido.")
            .max(80, "O e-mail não pode ter mais de 80 caracteres.")
            .optional(),
            
    telefone: z.string()
               .length(11, "O telefone deve ter exatamente 11 caracteres numéricos.")
               .optional(),
               
    idCargo: z.number({ invalid_type_error: "O ID do cargo deve ser um número inteiro." })
              .int()
              .positive("O ID do cargo deve ser maior que zero.")
              .optional()
    })
    .strict()
    .refine((dados) => Object.keys(dados).length > 0, {
      message: "Nenhum dado válido fornecido para atualização."
});;


// Payload para atualização de senha
export const atualizarSenhaDTO = z.object({
    email: z.string({ required_error: "O e-mail é obrigatório." })
            .email("Formato de e-mail inválido."),
            
    novaSenha: z.string({ required_error: "A nova senha é obrigatória." })
                .length(64, "A senha deve ter exatamente 64 caracteres (Formato SHA-256).")
                .regex(/^[a-fA-F0-9]{64}$/, "A senha informada não é um hash válido.")
}).strict();


// Payload para ativar/desativar usuário
export const ativacaoUsuarioDTO = z.object({
    ativo: z.boolean({ 
        required_error: "O campo 'ativo' é obrigatório.",
        invalid_type_error: "O campo 'ativo' deve ser true ou false." 
    })
}).strict();