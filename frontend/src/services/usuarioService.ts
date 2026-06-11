import api from './api';
import { AxiosResponse } from 'axios';
import { LoginData, LoginResponse } from '../types/loginInterfaces';
import { CadastroData, CadastroResponse } from '@/types/usuarioInterfaces';

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


};