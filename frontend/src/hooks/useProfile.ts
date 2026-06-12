import { UpdateUserData } from "@/types/usuarioInterfaces";
import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usuarioService } from '../services/usuarioService';
import { useUser } from './context/UserContext';


export const useProfile = () => {
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();

    const atualizarUsuario = async (dados: UpdateUserData, id: number): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await usuarioService.atualizarPerfil(dados, id);
            await AsyncStorage.setItem('@App:user', JSON.stringify(response));

            setUser({
                id: response.id,
                nome: response.nome,
                email: response.email,
                telefone: response.telefone,
                idCargo: response.cargo.id,
                nomeCargo: response.cargo.nome,
                ativo: response.ativo
            });
            return true;

        } catch (error: any) {
            console.log(error)
            const mensagem = error.message || 'Erro ao atualizar cliente';
            Alert.alert('Erro ao atualizar cliente', mensagem);
            throw error.response?.data || error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        atualizarUsuario
    };
}