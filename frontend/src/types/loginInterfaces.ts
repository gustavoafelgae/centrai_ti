
export interface LoginData {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    idCargo: number;
    ativo: boolean;
    cargo: {
      id: number;
      nome: string;
    }
  };
  message?: string;
}