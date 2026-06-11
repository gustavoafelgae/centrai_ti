import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type IoniconsName = ComponentProps<typeof Ionicons>['name'];

export interface CargoResponse {
  id: number;
  nome: string;
}

export interface ListaCargosResponse {
  cargos: Array<CargoResponse>;
}

export interface ServicoResponse {
  id: number;
  servico: string;
  cargoId: number;
}

export interface ListaServicosResponse {
  servicos: Array<ServicoResponse>;
}

export interface ListaServicosFront {
  id: number;
  name: string;
  cargoId: number;
  icon: IoniconsName;
  color: string;
  description: string;
  price: string;
}