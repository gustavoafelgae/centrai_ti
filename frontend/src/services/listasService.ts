import api from './api';
import { AxiosResponse } from 'axios';
import { CargoResponse, ListaCargosResponse, ListaServicosResponse, ServicoResponse } from '@/types/listasInsterfaces';


export const listasService = {

    listarCargos: async (): Promise<CargoResponse[]> => {
        try {
            const response: AxiosResponse<ListaCargosResponse> = await api.get(
                `/cargos/listarCargos`
            );
            return response.data.cargos;
        } catch (error: any) {
            throw error.response?.data || error.message;
        }
    },

    listarServicos: async (): Promise<ServicoResponse[]> => {
        try {
            const response: AxiosResponse<ListaServicosResponse> = await api.get(
                `/servicos/listarServicos`
            );
            return response.data.servicos;
        } catch (error: any) {
            throw error.response?.data || error.message;
        }
    }
};