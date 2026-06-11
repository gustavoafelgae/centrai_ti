import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface UserData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  idCargo: number;
  nomeCargo: string;
  ativo: boolean;
}

type UserContextType = {
  user: UserData | null;
  setUser: (userData: UserData | null) => void;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  updateUser: (data: Partial<UserData>) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      let userData = null;

      if (Platform.OS === 'web') {
        const stored = localStorage.getItem('@App:user');
        userData = stored ? JSON.parse(stored) : null;
      } else {
        const stored = await AsyncStorage.getItem('@App:user');
        userData = stored ? JSON.parse(stored) : null;
      }

      if (userData) {
        setUserState(userData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async (userData: UserData | null) => {
    try {
      if (userData) {
        const jsonString = JSON.stringify(userData);

        if (Platform.OS === 'web') {
          localStorage.setItem('@App:user', jsonString);
        } else {
          await AsyncStorage.setItem('@App:user', jsonString);
        }
      } else {
        if (Platform.OS === 'web') {
          localStorage.removeItem('@App:user');
        } else {
          await AsyncStorage.removeItem('@App:user');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  };

  const setUser = async (userData: UserData | null) => {
    setUserState(userData);
    await saveUserData(userData);
  };

  const updateUser = (data: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUserState(updatedUser);
      saveUserData(updatedUser);
    }
  };

  const logout = async () => {
    await setUser(null);
  };

  if (isLoading) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        logout,
        updateUser,
        isLoading
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}

export function useAuthenticatedUser() {
  const { user, ...rest } = useUser();

  if (!user) {
    throw new Error(
      'useAuthenticatedUser: Usuário não está autenticado. ' +
      'Use este hook apenas em telas protegidas por autenticação.'
    );
  }

  return {
    user,
    ...rest
  };
}