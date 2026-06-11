// src/types/ticketInterface.ts

export interface CriarTicketData {
    idUsuario: number;
    titulo: string;
    prioridade: string;
    descricao: string;
    idServico: number;
}

export interface AtualizarTicketData {
    titulo?: string;
    prioridade?: string;
    descricao?: string;
    idServico?: number;
    idStatus?: number;
    idUsuarioResolved?: number;
}

export interface NovoTicketResponse {
    mensagem: string;
    ticket: {
        id: number;
        serial: string;
        titulo: string;
        prioridade: 'Baixa' | 'Media' | 'Alta' | 'Critica';
        descricao: string;
        idServico: number;
        servico: {
            id: number;
            servico: string;
            cargoId: number;
        };
        demanda: {
            id: number;
            idUsuarioCreated: number;
            idUsuarioResolved: number;
            idTicket: number;
        };
        status: {
            id: number;
            nome: string;
        };
    }
}

export interface TicketResponse {
    mensagem: string;
    ticket: {
        id: number;
        serial: string;
        titulo: string;
        prioridade: string;
        descricao: string;
        servico: {
            id: number;
            servico: string;
            cargoId: number;
        };
        demanda: {
            id: number;
            idUsuarioCreated: number;
            idUsuarioResolved: number;
            idTicket: number;
        };
        status: {
            id: number;
            nome: string;
        };
    };
}