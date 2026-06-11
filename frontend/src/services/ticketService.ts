// src/services/ticketService.ts
import api from './api';
import { AxiosResponse } from 'axios';
import { CriarTicketData, NovoTicketResponse, AtualizarTicketData, TicketResponse } from '@/types/ticketInterface';

const BASE_PATH = '/tickets';

export const ticketService = {

  criar: async (dados: CriarTicketData): Promise<NovoTicketResponse> => {
    try {
      const response: AxiosResponse<NovoTicketResponse> = await api.post(
        `${BASE_PATH}/criar`,
        dados
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  atualizar: async (serial: string, dados: AtualizarTicketData): Promise<TicketResponse> => {
    try {
      const response: AxiosResponse<TicketResponse> = await api.patch(
        `${BASE_PATH}/atualizar/${serial}`,
        dados
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
};