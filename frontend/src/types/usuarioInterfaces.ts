
export interface CadastroData {
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    idCargo: number;
}

export interface CadastroResponse {
    nome: string;
    email: string;
    telefone: string;
    idCargo: number;
    id: number;
    ativo: boolean;
}
