import { useRouter } from "expo-router";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { 
  Bell, 
  Briefcase, 
  ChevronRight, 
  Cloud, 
  HardDrive, 
  Home as HomeIcon, 
  LayoutDashboard,
  Server, 
  Shield, 
  Ticket as TicketIcon, 
  User 
} from "lucide-react-native";

// Importa os Contextos Globais
import { useTickets } from "../hooks/TicketContext";
import { useUser } from "../hooks/UserContext";

// Importa a versão Web 
import { Home as WebDashboard } from "../pages/Home";

const services = [
  { id: 1, name: "Manutenção\nde Servidor", icon: Server, color: "#8b5cf6" },
  { id: 2, name: "Segurança\nCibernética", icon: Shield, color: "#3b82f6" },
  { id: 3, name: "Cloud\nComputing", icon: Cloud, color: "#06b6d4" },
  { id: 4, name: "Backup &\nRecovery", icon: HardDrive, color: "#22c55e" },
];

const navItems = [
  { label: "Início", path: "/home", icon: HomeIcon },
  { label: "Serviços", path: "/services", icon: Briefcase },
  { label: "Tickets", path: "/tickets", icon: TicketIcon },
  { label: "Perfil", path: "/profile", icon: User },
];

function NativeHomeScreen() {
  const router = useRouter();
  
  // Puxa os dados reais de usuário e tickets
  const { user } = useUser();
  const { tickets } = useTickets();

  // Pega apenas os 3 primeiros tickets da lista global
  const recentTickets = tickets.slice(0, 3).map(inc => ({
    id: inc.id,
    title: inc.title,
    status: inc.status,
    priority: inc.priority,
    time: inc.createdAt,
  }));

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Crítica': return { bg: '#fee2e2', text: '#ef4444' };
      case 'Alta': return { bg: '#ffedd5', text: '#f97316' };
      case 'Média': return { bg: '#fef9c3', text: '#eab308' };
      default: return { bg: '#dcfce7', text: '#22c55e' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name || "Usuário"}</Text>
          <Text style={styles.subtitle}>O que você precisa hoje?</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationBtn}
          activeOpacity={0.7}
          onPress={() => router.push("/profile/notifications" as any)}
        >
          <Bell size={20} color="#ffffff" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Banner Console do Analista */}
        <TouchableOpacity 
          style={styles.analystButton}
          activeOpacity={0.8}
          onPress={() => router.push("/analyst" as any)}
        >
          <View style={styles.analystButtonContent}>
            <View style={styles.analystIconBg}>
              <LayoutDashboard size={20} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.analystButtonTitle}>Console do Analista</Text>
              <Text style={styles.analystButtonSub}>Gerenciar fila de chamados</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>

        {/* Sessão de Serviços */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Serviços</Text>
            <TouchableOpacity onPress={() => router.push("/services" as any)}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.serviceCard}
                activeOpacity={0.7}
                onPress={() => router.push(`/services/${service.id}` as any)}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${service.color}15` }]}>
                  <service.icon size={24} color={service.color} />
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sessão de Tickets Recentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tickets Recentes</Text>
            <TouchableOpacity onPress={() => router.push("/tickets" as any)}>
              <Text style={styles.seeAllText}>Ver histórico</Text>
            </TouchableOpacity>
          </View>

          {recentTickets.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhum ticket aberto recentemente.</Text>
            </View>
          ) : (
            <View style={styles.ticketsList}>
              {recentTickets.map((ticket) => {
                const pStyle = getPriorityStyle(ticket.priority);
                return (
                  <TouchableOpacity 
                    key={ticket.id} 
                    style={styles.ticketCard}
                    activeOpacity={0.7}
                    onPress={() => router.push(`/tickets/${ticket.id}` as any)}
                  >
                    <View style={styles.ticketHeader}>
                      <Text style={styles.ticketTitle} numberOfLines={1}>{ticket.title}</Text>
                      <ChevronRight size={16} color="#94a3b8" />
                    </View>
                    
                    <View style={styles.ticketFooter}>
                      <View style={styles.ticketInfoRow}>
                        <Text style={styles.ticketId}>{ticket.id}</Text>
                        <Text style={styles.ticketDot}>·</Text>
                        <Text style={styles.ticketTime}>{ticket.time}</Text>
                      </View>
                      
                      <View style={styles.ticketBadges}>
                        <View style={[styles.badge, { backgroundColor: pStyle.bg }]}>
                          <Text style={[styles.badgeText, { color: pStyle.text }]}>{ticket.priority}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: '#f1f5f9' }]}>
                          <Text style={[styles.badgeText, { color: '#64748b' }]}>{ticket.status}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Rodapé de Navegação (Bottom Nav) */}
      <View style={styles.navbar}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === "Início";

          return (
            <TouchableOpacity
              key={item.path}
              onPress={() => router.push(item.path as any)}
              style={styles.navButton}
            >
              <Icon
                size={24}
                color={isActive ? "#2563eb" : "#64748b"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text
                style={[
                  styles.navButtonText,
                  isActive && styles.navButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function HomePage() {
  if (Platform.OS === "web") {
    return <WebDashboard />;
  }

  return <NativeHomeScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 30,
    paddingBottom: 20,
    backgroundColor: "#2563eb", 
    borderBottomWidth: 0, 
  },
  greeting: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff", 
  },
  subtitle: {
    fontSize: 14,
    color: "#dbeafe", 
    marginTop: 4,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  analystButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  analystButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  analystIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0f172a', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  analystButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  analystButtonSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  serviceCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    lineHeight: 18,
  },
  ticketsList: {
    gap: 12,
  },
  ticketCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
    marginRight: 12,
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ticketId: {
    fontSize: 13,
    fontWeight: "600",
    color: "#60a5fa",
  },
  ticketDot: {
    fontSize: 13,
    color: "#94a3b8",
    marginHorizontal: 6,
  },
  ticketTime: {
    fontSize: 12,
    color: "#64748b",
  },
  ticketBadges: {
    flexDirection: "row",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderStyle: "dashed",
  },
  emptyStateText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  navbar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingVertical: Platform.OS === "ios" ? 20 : 12,
    paddingHorizontal: 8,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
  },
  navButtonText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  navButtonTextActive: {
    color: "#2563eb",
  },
});