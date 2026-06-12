// src/hooks/useTicket.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { ticketService } from '@/services/ticketService';
import { useCurrentTicket } from './context/TicketContext';
import { CriarTicketData, AtualizarTicketData } from "@/types/ticketInterface";

export const useTicket = () => {
  const [loading, setLoading] = useState(false);
  const { setTicket } = useCurrentTicket();

    const carregarTicket = async (serial: string) => {
    setLoading(true);
    try {
      const response = await ticketService.buscarPorSerial(serial);

      setTicket({
        id: response.id,
        serial: response.serial,
        titulo: response.titulo,
        prioridade: response.prioridade as 'Baixa' | 'Media' | 'Alta' | 'Critica',
        descricao: response.descricao,
        servicoId: response.servico.id,
        servicoNome: response.servico.servico,
        statusId: response.status.id,
        cargoId: response.servico.cargoId,
        idUsuarioCreated: response.demanda.idUsuarioCreated,
        idUsuarioResolved: response.demanda.idUsuarioResolved,
      });

      return true;
    } catch (error: any) {
      console.log(error);
      const mensagem = error?.mensagem || error?.message || 'Erro ao carregar ticket';
      Alert.alert('Erro', mensagem);
      return false;
    } finally {
      setLoading(false);
    }
  };


  const criarTicket = async (dados: CriarTicketData) => {
    setLoading(true);
    try {
      const response = await ticketService.criar(dados);
      
      // A resposta tem: { mensagem, ticket: {...} }
      const ticketData = response.ticket;

      setTicket({
        id: ticketData.id,
        serial: ticketData.serial,
        titulo: ticketData.titulo,
        prioridade: ticketData.prioridade as 'Baixa' | 'Media' | 'Alta' | 'Critica',
        descricao: ticketData.descricao,
        servicoId: ticketData.servico.id,
        servicoNome: ticketData.servico.servico,
        statusId: ticketData.status.id,
        cargoId: ticketData.servico.cargoId,
        idUsuarioCreated: ticketData.demanda.idUsuarioCreated,
        idUsuarioResolved: ticketData.demanda.idUsuarioResolved ?? 0, // null vira 0
      });

      return ticketData; // Retorna o ticket para usar no NewTicket
    } catch (error: any) {
      console.log(error);
      const mensagem = error?.mensagem || error?.message || 'Erro ao criar ticket';
      Alert.alert('Erro', mensagem);
      throw error.response?.data || error;;
    } finally {
      setLoading(false);
    }
  };


  const atualizarTicket = async (serial: string, dados: AtualizarTicketData) => {
    setLoading(true);
    try {
      const response = await ticketService.atualizar(serial, dados);
      
      // A resposta do atualizar também vem no mesmo formato
      const ticketData = response.ticket;

      setTicket({
        id: ticketData.id,
        serial: ticketData.serial,
        titulo: ticketData.titulo,
        prioridade: ticketData.prioridade as 'Baixa' | 'Media' | 'Alta' | 'Critica',
        descricao: ticketData.descricao,
        servicoId: ticketData.servico.id,
        servicoNome: ticketData.servico.servico,
        statusId: ticketData.status.id,
        cargoId: ticketData.servico.cargoId,
        idUsuarioCreated: ticketData.demanda.idUsuarioCreated,
        idUsuarioResolved: ticketData.demanda.idUsuarioResolved ?? 0,
      });

      return true;
    } catch (error: any) {
      console.log(error);
      const mensagem = error?.mensagem || error?.message || 'Erro ao atualizar ticket';
      Alert.alert('Erro', mensagem);
      throw error.response?.data || error;;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    criarTicket,
    atualizarTicket,
    carregarTicket
  };
};