import { useState, useEffect, useCallback } from 'react';
import { listasService } from '../services/listasService';
import { CargoResponse, ServicoResponse, ListaServicosFront } from '@/types/listasInsterfaces';
import {
    servicosConfig,
    defaultIcon,
    defaultColor,
    defaultDescription,
    defaultPrice,
    ServicoConfig
} from '../config/servicosConfig';
import { Alert } from 'react-native';

export const useCargos = () => {
    const [cargos, setCargos] = useState<CargoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const carregarCargos = async () => {
        setLoading(true);
        setError(null);
        try {
            const dados = await listasService.listarCargos();
            setCargos(dados);
        } catch (err: any) {
            const mensagem = err.message || 'Lista de cargos não encontrada';
            Alert.alert('Erro ao realizar requisição', mensagem);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarCargos();
    }, []);

    return {
        cargos,
        loading,
        error,
        recarregar: carregarCargos
    };
};

export const useServicos = () => {
    const [servicos, setServicos] = useState<ListaServicosFront[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const mesclarServicos = useCallback((servicosBanco: ServicoResponse[]): ListaServicosFront[] => {
        return servicosBanco.map(servicoBanco => {
            const config = servicosConfig.find(
                config => config.id === servicoBanco.id
            );

            return {
                id: config?.id || servicoBanco.id,
                name: config?.name || servicoBanco.servico,
                cargoId: servicoBanco.id || 0,
                icon: config?.icon || defaultIcon,
                color: config?.color || defaultColor,
                description: config?.description || defaultDescription,
                price: config?.price || defaultPrice,
            };
        });
    }, []);

    const carregarServicos = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const servicosBanco = await listasService.listarServicos();
            const servicosMesclados = mesclarServicos(servicosBanco);
            setServicos(servicosMesclados);

        } catch (err: any) {
            const mensagem = err.message || 'Erro ao carregar serviços';
            setError(mensagem);
            console.error('Erro ao carregar serviços:', err);

        } finally {
            setLoading(false);
        }
    }, [mesclarServicos]);

    useEffect(() => {
        carregarServicos();
    }, [carregarServicos]);

    return {
        servicos,
        loading,
        error,
        recarregar: carregarServicos
    };
};