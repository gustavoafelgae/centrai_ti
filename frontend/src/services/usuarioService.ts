import api from './api';
import { AxiosResponse } from 'axios';
import { LoginData, LoginResponse } from '../types/loginInterfaces';
import { CadastroData, CadastroResponse, UpdateUserData, UpdateUserResponse, ResetPasswordData} from '@/types/usuarioInterfaces';

const BASE_PATH = '/usuarios';

export const usuarioService = {

    logar: async (dados: LoginData): Promise<LoginResponse> => {
        try {
            const response: AxiosResponse<LoginResponse> = await api.post(
                `${BASE_PATH}/login`,
                dados
            );
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error.message;
        }
    },

    cadastrar: async (dados: CadastroData): Promise<CadastroResponse> => {
        try {
            const response: AxiosResponse<CadastroResponse> = await api.post(
                `${BASE_PATH}/cadastro`,
                dados
            );
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error.message;
        }
    },

    atualizarPerfil: async (dados: UpdateUserData, id: number): Promise<UpdateUserResponse> => {
        try {
            const response = await api.patch(`/usuarios/atualizar/${id}`, dados);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    },

    solicitarRecuperacaoSenha: async (email: string) => {
        const response = await api.post(`${BASE_PATH}/esqueci-senha`, { email });
        return response.data;
    },

    atualizarSenha: async (dados: ResetPasswordData) => {
        const response = await api.patch(`${BASE_PATH}/senha`, dados);
        return response.data;
    }

};