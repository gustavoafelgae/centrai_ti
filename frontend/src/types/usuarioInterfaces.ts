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

export interface UpdateUserData {
  nome: string;
  email: string;
  telefone: string;
  idCargo: number;
}

export interface UpdateUserResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  idCargo: number;
  cargo: {
    id: number;
    nome: string
  };
  ativo: boolean;
}

export interface ResetPasswordData {
  email: string;
  codigo: string;
  novaSenha: string;
}
