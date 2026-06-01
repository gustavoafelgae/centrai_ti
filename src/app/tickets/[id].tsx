import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react-native';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// IMPORTANTE: Ajuste este import dependendo de como o seu TicketDetail web foi exportado
// Se der erro de "não tem membro exportado", mude para: import WebTicketDetail from "../../pages/TicketDetail";
import { TicketDetail as WebTicketDetail } from '../../pages/TicketDetail';

// --- Banco de Dados Local (Mock de Tickets) ---
const TICKETS_DATA: Record<string, any> = {
  'INC-0041': {
    id: 'INC-0041',
    title: 'Servidor de produção fora do ar',
    description:
      'O servidor principal de produção parou de responder. Os clientes estão relatando erro 503 ao tentar acessar o sistema. Precisamos de verificação urgente no datacenter.',
    status: 'Em Andamento',
    priority: 'Crítica',
    category: 'Infraestrutura',
    requester: 'Carlos Menezes',
    date: '21/05/2026 08:14',
  },
  'INC-0040': {
    id: 'INC-0040',
    title: 'VPN sem acesso para equipe remota',
    description:
      "Vários usuários da equipe de vendas não conseguem conectar na VPN corporativa desde as 7h da manhã. O erro retornado é 'Connection Timeout'.",
    status: 'Aberto',
    priority: 'Alta',
    category: 'Rede',
    requester: 'Beatriz Lima',
    date: '21/05/2026 07:50',
  },
  'INC-0039': {
    id: 'INC-0039',
    title: 'Falha no backup noturno',
    description:
      'O script de backup do banco de dados principal falhou durante a madrugada com erro de falta de espaço em disco no storage secundário.',
    status: 'Em Andamento',
    priority: 'Alta',
    category: 'Backup',
    requester: 'TI Automático',
    date: '21/05/2026 06:00',
  },
  'INC-0038': {
    id: 'INC-0038',
    title: 'Impressora do RH não imprime',
    description:
      'A impressora principal do departamento de Recursos Humanos está com atolamento de papel recorrente e aviso de toner baixo.',
    status: 'Aguardando',
    priority: 'Média',
    category: 'Hardware',
    requester: 'Márcia Ferreira',
    date: '20/05/2026 15:30',
  },
};

// Funções auxiliares para cores das etiquetas (Badges)
const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case 'Crítica':
      return { bg: '#fef2f2', text: '#ef4444' };
    case 'Alta':
      return { bg: '#fff7ed', text: '#f97316' };
    case 'Média':
      return { bg: '#fef9c3', text: '#eab308' };
    default:
      return { bg: '#f1f5f9', text: '#64748b' };
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Aberto':
      return { bg: '#eff6ff', text: '#3b82f6' };
    case 'Em Andamento':
      return { bg: '#f3e8ff', text: '#a855f7' };
    case 'Resolvido':
      return { bg: '#dcfce7', text: '#22c55e' };
    default:
      return { bg: '#fef9c3', text: '#eab308' }; // Aguardando
  }
};

function NativeTicketDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extrai o ID da URL de forma segura
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const currentId = rawId ? String(rawId) : 'INC-0041';

  // Busca o ticket. Se não encontrar o ID exato, mostra o INC-0041 por padrão
  const ticket = TICKETS_DATA[currentId] || TICKETS_DATA['INC-0041'];

  const pStyle = getPriorityStyle(ticket.priority);
  const sStyle = getStatusStyle(ticket.status);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color='#0f172a' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Ticket</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Card Principal */}
        <View style={styles.card}>
          <View style={styles.idRow}>
            <Text style={styles.ticketId}>{ticket.id}</Text>
            <Text style={styles.dateText}>{ticket.date}</Text>
          </View>

          <Text style={styles.title}>{ticket.title}</Text>

          {/* Badges de Status e Prioridade */}
          <View style={styles.badgesRow}>
            <View style={[styles.badge, { backgroundColor: pStyle.bg }]}>
              <Text style={[styles.badgeText, { color: pStyle.text }]}>
                {ticket.priority}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: sStyle.bg }]}>
              <Text style={[styles.badgeText, { color: sStyle.text }]}>
                {ticket.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Card de Informações */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informações</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <User size={18} color='#64748b' />
            </View>
            <View>
              <Text style={styles.infoLabel}>Solicitante</Text>
              <Text style={styles.infoValue}>{ticket.requester}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <Tag size={18} color='#64748b' />
            </View>
            <View>
              <Text style={styles.infoLabel}>Categoria</Text>
              <Text style={styles.infoValue}>{ticket.category}</Text>
            </View>
          </View>

          <View
            style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0 }]}
          >
            <View style={styles.infoIconWrapper}>
              <Calendar size={18} color='#64748b' />
            </View>
            <View>
              <Text style={styles.infoLabel}>Abertura</Text>
              <Text style={styles.infoValue}>{ticket.date}</Text>
            </View>
          </View>
        </View>

        {/* Card de Descrição */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Descrição do Problema</Text>
          <Text style={styles.descriptionText}>{ticket.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default function TicketDetailPage() {
  if (Platform.OS === 'web') {
    // Renderiza a versão web se estiver no navegador
    return <WebTicketDetail />;
  }

  // Renderiza a tela nativa bonita no celular
  return <NativeTicketDetailScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
  dateText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
    lineHeight: 26,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  descriptionText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
});
