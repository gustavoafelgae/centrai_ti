import React, { createContext, useContext, useState } from "react";

export interface Ticket {
  id: string;
  title: string;
  requester: string;
  assignee: string | null;
  priority: "Crítica" | "Alta" | "Média" | "Baixa";
  status: "Aberto" | "Em Andamento" | "Aguardando" | "Resolvido";
  category: string;
  createdAt: string;
  updatedAt: string;
  sla: string;
  slaBreached: boolean;
  description?: string;
}

type TicketContextType = {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status" | "assignee" | "sla" | "slaBreached">) => void;
};

const TicketContext = createContext<TicketContextType | undefined>(undefined);

const INITIAL_INCIDENTS: Ticket[] = [
  {
    id: "INC-0041",
    title: "Servidor de produção fora do ar",
    requester: "Carlos Menezes",
    assignee: "Ana Souza",
    priority: "Crítica",
    status: "Em Andamento",
    category: "Infraestrutura",
    createdAt: "21/05/2026 08:14",
    updatedAt: "21/05/2026 09:02",
    sla: "2h restantes",
    slaBreached: false,
  },
  {
    id: "INC-0040",
    title: "VPN sem acesso para equipe remota",
    requester: "Beatriz Lima",
    assignee: null,
    priority: "Alta",
    status: "Aberto",
    category: "Rede",
    createdAt: "21/05/2026 07:50",
    updatedAt: "21/05/2026 07:50",
    sla: "30min restantes",
    slaBreached: false,
  },
  {
    id: "INC-0039",
    title: "Falha no backup noturno",
    requester: "TI Automático",
    assignee: "Pedro Alves",
    priority: "Alta",
    status: "Em Andamento",
    category: "Backup",
    createdAt: "21/05/2026 06:00",
    updatedAt: "21/05/2026 08:45",
    sla: "SLA violado",
    slaBreached: true,
  },
  {
    id: "INC-0038",
    title: "Impressora do RH não imprime",
    requester: "Márcia Ferreira",
    assignee: "João Costa",
    priority: "Média",
    status: "Aguardando",
    category: "Hardware",
    createdAt: "20/05/2026 15:30",
    updatedAt: "21/05/2026 08:00",
    sla: "4h restantes",
    slaBreached: false,
  },
];

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_INCIDENTS);

  const addTicket = (newTicketData: any) => {
    const nextIdNumber = tickets.length + 42; 
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newTicket: Ticket = {
      id: `INC-00${nextIdNumber}`,
      status: "Aberto",
      assignee: null,
      createdAt: formattedDate,
      updatedAt: formattedDate,
      sla: "4h restantes",
      slaBreached: false,
      ...newTicketData,
    };

    // Adiciona o novo ticket no TOPO da lista
    setTickets((prev) => [newTicket, ...prev]);
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTickets deve ser usado dentro de um TicketProvider");
  }
  return context;
}