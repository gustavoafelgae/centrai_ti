// src/config/servicosConfig.ts
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

export interface ServicoConfig {
  id: number;
  name: string;
  icon: IoniconsName;
  color: string;
  description: string;
  price: string;
}

export const servicosConfig: ServicoConfig[] = [
  {
    id: 1,
    name: "Suporte Técnico",
    icon: "desktop-outline",
    color: "bg-orange-500",
    description: "Suporte 24/7 para sua empresa",
    price: "A partir de R$ 350/mês",
  },
  {
    id: 2,
    name: "Email Corporativo",
    icon: "mail-outline",
    color: "bg-teal-500",
    description: "Contas de email profissionais",
    price: "A partir de R$ 250/mês",
  },
  {
    id: 3,
    name: "Segurança Cibernética",
    icon: "shield-checkmark-outline",
    color: "bg-blue-500",
    description: "Proteção avançada contra ameaças",
    price: "A partir de R$ 800/mês",
  },
  {
    id: 4,
    name: "Backup & Recovery",
    icon: "save-outline",
    color: "bg-green-500",
    description: "Backup automático e recuperação",
    price: "A partir de R$ 400/mês",
  },
  {
    id: 5,
    name: "Infraestrutura de Rede",
    icon: "wifi-outline",
    color: "bg-pink-500",
    description: "Configuração e otimização de rede",
    price: "A partir de R$ 700/mês",
  },
  {
    id: 6,
    name: "Manutenção de Servidor",
    icon: "server-outline",
    color: "bg-purple-500",
    description: "Monitoramento e manutenção de servidores",
    price: "A partir de R$ 500/mês",
  },
  {
    id: 7,
    name: "Cloud Computing",
    icon: "cloud-outline",
    color: "bg-cyan-500",
    description: "Soluções em nuvem escaláveis",
    price: "A partir de R$ 600/mês",
  },
  {
    id: 8,
    name: "Gestão de Banco de Dados",
    icon: "server-outline",
    color: "bg-indigo-500",
    description: "Administração e otimização de BD",
    price: "A partir de R$ 650/mês",
  },
];

export const defaultIcon: IoniconsName = "apps-outline";
export const defaultColor = "bg-gray-500";
export const defaultDescription = "Serviço disponível";
export const defaultPrice = "Consulte valores";