// src/hooks/context/TicketContext.tsx
import React, { createContext, useContext, useState } from "react";

export interface Ticket {
  id: number;
  serial: string;
  titulo: string;
  prioridade: string;
  descricao: string;
  servicoId: number;
  servicoNome: string
  cargoId: number;
  statusId: number;
  idUsuarioCreated: number;
  idUsuarioResolved: number;
}

type TicketContextType = {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  addTicket: (ticket: Ticket) => void;
  setCurrentTicket: (ticket: Ticket | null) => void;
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
};

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);

  const addTicket = (ticket: Ticket) => {
    setTickets(prev => [ticket, ...prev]);
  };

  return (
    <TicketContext.Provider value={{ 
      tickets, 
      currentTicket,
      addTicket, 
      setCurrentTicket,
      setTickets 
    }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTickets deve ser usado dentro de um TicketProvider");
  }
  return {
    tickets: context.tickets,
    addTicket: context.addTicket,
    setTickets: context.setTickets,
  };
}

export function useCurrentTicket() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useCurrentTicket deve ser usado dentro de um TicketProvider");
  }
  return {
    ticket: context.currentTicket,
    setTicket: context.setCurrentTicket,
  };
}