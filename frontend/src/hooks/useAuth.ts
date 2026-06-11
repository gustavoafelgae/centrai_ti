import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usuarioService } from '../services/usuarioService';
import { LoginData } from '../types/loginInterfaces'
import SHA256 from "crypto-js/sha256";
import { CadastroData } from '@/types/usuarioInterfaces';
import { useUser } from './context/UserContext';
import { ResetPasswordData } from '@/types/usuarioInterfaces';


export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();

    const login = async (email: string, senha: string): Promise<boolean> => {
        setLoading(true);
        try {
            const dados: LoginData = {
                email: email.trim(),
                senha: SHA256(senha.trim()).toString()
            };
            const response = await usuarioService.logar(dados);
            await AsyncStorage.setItem('@App:user', JSON.stringify(response.usuario));

            setUser({
                id: response.usuario.id,
                nome: response.usuario.nome,
                email: response.usuario.email,
                telefone: response.usuario.telefone,
                idCargo: response.usuario.cargo.id,
                nomeCargo: response.usuario.cargo.nome,
                ativo: response.usuario.ativo
            });

            return true;

        } catch (error: any) {
            console.log(error)
            const mensagem = error.message || 'Erro ao fazer login';
            Alert.alert('Erro de Autenticação', mensagem);
            return false;
        } finally {
            setLoading(false);
        }
    };


    const logout = async (): Promise<void> => {
        try {
            await AsyncStorage.multiRemove(['@App:token', '@App:user']);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };


    const cadastro = async (dados: CadastroData): Promise<boolean> => {

        setLoading(true);
        try {
            const response = await usuarioService.cadastrar(dados);
            await AsyncStorage.setItem('@App:user', JSON.stringify(response));

            return true;

        } catch (error: any) {
            console.log(error)
            const mensagem = error.message || 'Erro ao fazer cadastro de usuario';
            Alert.alert('Ocorreu um falha ao tentar cadastrar. Tente novamente!', mensagem);
            return false;
        } finally {
            setLoading(false);
        }
    };


    const solicitarRecuperacao = async (email: string): Promise<boolean> => {
        setLoading(true);
        try {
            await usuarioService.solicitarRecuperacaoSenha(email);
            return true;
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Falha ao solicitar recuperação.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const confirmarResetSenha = async (email: string, codigo: string, novaSenha: string): Promise<boolean> => {
        setLoading(true);
        try {
            await usuarioService.atualizarSenha({ email, codigo, novaSenha });
            return true;
        } catch (error: any) {
            // LANÇA O ERRO PARA QUEM CHAMOU A FUNÇÃO
            throw error;
        } finally {
            setLoading(false);
        }
    };


    return {
        loading,
        login,
        logout,
        cadastro,
        solicitarRecuperacao,
        confirmarResetSenha,
    };
};