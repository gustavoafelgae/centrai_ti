import React, { createContext, useContext, useState } from 'react';

// Os dados que o nosso usuário terá
type UserData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  plan: string;
};

// O que o contexto vai exportar
type UserContextType = {
  user: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Os dados padrão que vão aparecer quando o app abrir
  const [user, setUser] = useState<UserData>({
    name: 'João Silva',
    email: 'joao.silva@empresa.com.br',
    phone: '+55 11 98765-4321',
    company: 'Empresa LTDA',
    plan: 'Premium',
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
