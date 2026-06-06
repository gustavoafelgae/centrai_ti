import { z } from "zod";


// Payload criacao do ticket
export const criarTicketDTO = z.object({
    idUsuario   : z.number({ invalid_type_error: "O ID do usuário deve ser um número inteiro." })
                 .int()
                 .positive("O ID do usuário deve ser maior que zero."),

    titulo: z.string({ required_error: "O título é obrigatório." })
             .min(1, "O título não pode estar vazio.")
             .max(255, "O título não pode ter mais de 255 caracteres."),
            
    prioridade: z.enum(["Baixa", "Media", "Alta", "Critica"], 
                {errorMap: () => ({ 
                    message: "A prioridade deve ser exatamente: 'Baixa', 'Media', 'Alta' ou 'Critica'." 
                })}),
                 
    descricao: z.string({ invalid_type_error: "A descrição deve ser um texto." }),
               
    idServico: z.number({ invalid_type_error: "O ID do serviço deve ser um número inteiro." })
                .int()
                .positive("O ID do serviço deve ser maior que zero.")
}).strict();


// Payload para atualização do ticket
export const atualizarTicketDTO = z.object({

    titulo: z.string({ required_error: "O título é obrigatório." })
             .min(1, "O título não pode estar vazio.")
             .max(255, "O título não pode ter mais de 255 caracteres."),

    prioridade: z.enum(["Baixa", "Media", "Alta", "Critica"], {
        errorMap: () => ({ message: "A prioridade deve ser exatamente: 'Baixa', 'Media', 'Alta' ou 'Critica'." })
    }),

    descricao: z.string({ invalid_type_error: "A descrição deve ser um texto." }),

    idServico: z.number({ invalid_type_error: "O ID do serviço deve ser um número inteiro." })
                .int()
                .positive("O ID do serviço deve ser maior que zero."),

    idStatus: z.number({ invalid_type_error: "O ID do status deve ser um número inteiro." })
               .int()
               .positive("O ID do status deve ser maior que zero."),

    idUsuarioResolved: z.number({ invalid_type_error: "O ID do usuário que resolveu deve ser um número inteiro." })
                        .int()
                        .positive("O ID do usuário que resolveu deve ser maior que zero.")
}).strict();