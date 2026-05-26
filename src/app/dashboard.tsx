import { useRouter } from "expo-router";
import {
  Bell,
  Briefcase,
  ChevronRight,
  Cloud,
  HardDrive,
  Home,
  LayoutGrid,
  Server,
  ShieldCheck,
  Ticket as TicketIcon,
  User,
} from "lucide-react-native";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dashboard as WebDashboard } from "../pages/Dashboard";

const services = [
  { id: 1, name: "Manutenção\nde Servidor", icon: Server, color: "#8b5cf6" },
  {
    id: 2,
    name: "Segurança\nCibernética",
    icon: ShieldCheck,
    color: "#3b82f6",
  },
  { id: 3, name: "Cloud\nComputing", icon: Cloud, color: "#06b6d4" },
  { id: 4, name: "Backup &\nRecovery", icon: HardDrive, color: "#22c55e" },
];

const recentTickets = [
  {
    id: "INC-0041",
    title: "Servidor de produção fora do ar",
    status: "Em Andamento",
    priority: "Crítica",
    date: "21/05/2026 08:14",
  },
];

const navItems = [
  { label: "Início", path: "/dashboard", icon: Home },
  { label: "Serviços", path: "/services", icon: Briefcase },
  { label: "Tickets", path: "/tickets", icon: TicketIcon },
  { label: "Perfil", path: "/profile", icon: User },
];

function MainMenu() {
  const router = useRouter();

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Cabeçalho Azul */}
        <View style={styles.headerBlue}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.greetingText}>Olá, João</Text>
              <Text style={styles.subGreetingText}>
                O que você precisa hoje?
              </Text>
            </View>
            <TouchableOpacity
              style={styles.notificationBtn}
              activeOpacity={0.8}
            >
              <Bell size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Console do Analista */}
        <TouchableOpacity
          style={styles.analystCard}
          activeOpacity={0.9}
          onPress={() => router.push("/analyst" as any)}
        >
          <View style={styles.analystLeft}>
            <View style={styles.analystIconWrapper}>
              <LayoutGrid size={22} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.analystTitle}>Console do Analista</Text>
              <Text style={styles.analystSubtitle}>
                Gerenciar incidentes e métricas
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#475569" />
        </TouchableOpacity>

        {/* Container de Serviços (Card Branco) */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Serviços</Text>
            <TouchableOpacity onPress={() => router.push("/services" as any)}>
              <Text style={styles.linkText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceCard}
                  onPress={() => router.push(`/services/${service.id}` as any)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: service.color },
                    ]}
                  >
                    <Icon size={24} color="#ffffff" strokeWidth={2} />
                  </View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Container de Tickets (Card Branco) */}
        <View style={[styles.sectionWrapper, { marginTop: 16 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tickets Recentes</Text>
            <TouchableOpacity onPress={() => router.push("/tickets" as any)}>
              <Text style={styles.linkText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {recentTickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              style={styles.ticketCard}
              onPress={() => router.push(`/tickets/${ticket.id}` as any)}
              activeOpacity={0.7}
            >
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketTitleText}>{ticket.title}</Text>
                <View style={styles.criticalBadge}>
                  <Text style={styles.criticalBadgeText}>
                    {ticket.priority}
                  </Text>
                </View>
              </View>
              <View style={styles.ticketFooter}>
                <Text style={styles.ticketStatusText}>{ticket.status}</Text>
                <Text style={styles.ticketDateText}>{ticket.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Rodapé de Navegação */}
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

export default function DashboardPage() {
  if (Platform.OS === "web") return <WebDashboard />;
  return <MainMenu />;
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 110,
  },
  headerBlue: {
    backgroundColor: "#3b82f6",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 60,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
  },
  subGreetingText: {
    fontSize: 14,
    color: "#e0e7ff",
    marginTop: 2,
  },
  notificationBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  analystCard: {
    backgroundColor: "#111827",
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  analystLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  analystIconWrapper: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  analystTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  analystSubtitle: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 2,
  },
  sectionWrapper: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563eb",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  serviceCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
    lineHeight: 18,
  },
  ticketCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderRadius: 16,
    padding: 16,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  ticketTitleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
    marginRight: 10,
    lineHeight: 20,
  },
  criticalBadge: {
    backgroundColor: "#fef2f2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  criticalBadgeText: {
    color: "#ef4444",
    fontSize: 11,
    fontWeight: "700",
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketStatusText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },
  ticketDateText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "500",
  },
  navbar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingVertical: Platform.OS === "ios" ? 20 : 12,
    paddingHorizontal: 8,
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
  },
  navButton: {
    alignItems: "center",
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
