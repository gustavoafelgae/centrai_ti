import { EntityNotFoundError } from "typeorm";
import { ZodError } from "zod";

export const errorHandler = (error, req, res, next) => {

    console.error(`[ERRO]: ${error.message}`);

    if (error instanceof ZodError) {
        return res.status(400).json({
            statusCode: 400,
            message: "Dados de entrada inválidos.",
            errors: error.issues.map(issue => ({
                campo: issue.path.join('.'),
                detalhe: issue.message
            }))
        });
    }

    if (error.name === "AssertionError") {
        return res.status(400).json({ message: error.message });
    }

    if (error instanceof EntityNotFoundError) {
        return res.status(404).json({
            statusCode: 404,
            error: "Not Found",
            message: "Não foram encontradas informações correspondentes para a solicitação."
        });
    }

    return res.status(500).json({ 
        message: "Erro interno no servidor.",
        detail: error.message
    });
};