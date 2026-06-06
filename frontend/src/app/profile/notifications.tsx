import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  CheckCheck,
  CheckCircle2,
  Info,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// --- Banco de Dados Local (Mock de Notificações) ---
const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    type: 'alert',
    title: 'SLA Violado: INC-0039',
    description:
      "O ticket 'Falha no backup noturno' ultrapassou o tempo limite de resolução.",
    time: 'Há 10 min',
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Ticket Resolvido',
    description:
      'O ticket INC-0035 (Reset de senha) foi marcado como resolvido por Pedro Alves.',
    time: 'Há 2 horas',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Manutenção Programada',
    description:
      'Os servidores da AWS passarão por manutenção neste fim de semana (00:00 às 04:00).',
    time: 'Ontem',
    read: true,
  },
  {
    id: '4',
    type: 'alert',
    title: 'Novo Incidente Crítico',
    description:
      'Servidor de produção fora do ar. Ticket INC-0041 aberto por Carlos Menezes.',
    time: 'Ontem',
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Função para marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Ícone dinâmico baseado no tipo de notificação
  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle size={24} color='#ef4444' />;
      case 'success':
        return <CheckCircle2 size={24} color='#22c55e' />;
      case 'info':
      default:
        return <Info size={24} color='#3b82f6' />;
    }
  };

  // Cor de fundo do ícone baseada no tipo
  const getIconBg = (type: string) => {
    switch (type) {
      case 'alert':
        return '#fef2f2';
      case 'success':
        return '#dcfce7';
      case 'info':
      default:
        return '#eff6ff';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Cabeçalho Ajustado para Azul */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            {/* Seta alterada para branco */}
            <ArrowLeft size={24} color='#ffffff' />
          </TouchableOpacity>
          <Text style={styles.title}>Notificações</Text>
        </View>

        {/* Botão de marcar como lido */}
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.readAllButton}
            onPress={markAllAsRead}
          >
            {/* Ícone alterado para branco para combinar com o fundo azul */}
            <CheckCheck size={18} color='#ffffff' />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de Notificações */}
      <ScrollView contentContainerStyle={styles.content} bounces={true}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={48} color='#cbd5e1' />
            <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
            <Text style={styles.emptyText}>
              Você está em dia com seus avisos!
            </Text>
          </View>
        ) : (
          notifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard,
              ]}
              activeOpacity={0.7}
              onPress={() => {
                // Ao clicar, marca a notificação específica como lida
                setNotifications(
                  notifications.map(n =>
                    n.id === notification.id ? { ...n, read: true } : n,
                  ),
                );
              }}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getIconBg(notification.type) },
                ]}
              >
                {getIcon(notification.type)}
              </View>

              <View style={styles.textContainer}>
                <View style={styles.cardHeader}>
                  <Text
                    style={[
                      styles.cardTitle,
                      !notification.read && styles.unreadText,
                    ]}
                  >
                    {notification.title}
                  </Text>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.cardDescription}>
                  {notification.description}
                </Text>
                <Text style={styles.cardTime}>{notification.time}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: '#2563eb', // Fundo azul corrigido
    borderBottomWidth: 0, // Removida a borda clara
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff', // Título branco corrigido
  },
  readAllButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)', // Fundo semi-transparente para combinar com o azul
    borderRadius: 8,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  unreadCard: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  unreadText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
  },
});