import { useRouter } from "expo-router";
import {
    ArrowLeft,
    Briefcase,
    Home,
    Plus,
    Search,
    Ticket as TicketIcon,
    User,
} from "lucide-react-native";
import { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Tickets } from "../pages/Tickets";

// Mock de dados baseado no print
const ticketsList = [
  {
    id: 1,
    title: "Lentidão no sistema ERP",
    category: "Performance",
    priority: "Alta",
    status: "Em andamento",
    time: "2h atrás",
  },
  {
    id: 2,
    title: "Resetar senha de usuário",
    category: "Acesso",
    priority: "Baixa",
    status: "Aguardando",
    time: "4h atrás",
  },
  {
    id: 3,
    title: "Instalação do Microsoft Office",
    category: "Software",
    priority: "Média",
    status: "Resolvido",
    time: "1d atrás",
  },
  {
    id: 4,
    title: "Problema na conexão VPN",
    category: "Rede",
    priority: "Alta",
    status: "Em andamento",
    time: "3h atrás",
  },
  {
    id: 5,
    title: "Backup não está funcionando",
    category: "Backup",
    priority: "Alta",
    status: "Aguardando",
    time: "5h atrás",
  },
];

const navItems = [
  { label: "Início", path: "/dashboard", icon: Home },
  { label: "Serviços", path: "/services", icon: Briefcase },
  { label: "Tickets", path: "/tickets", icon: TicketIcon },
  { label: "Perfil", path: "/profile", icon: User },
];

// Funções para definir as cores das tags
const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "Alta":
      return { bg: "#ffe4e6", text: "#e11d48" };
    case "Média":
      return { bg: "#fef3c7", text: "#b45309" };
    case "Baixa":
      return { bg: "#f1f5f9", text: "#475569" };
    default:
      return { bg: "#f1f5f9", text: "#475569" };
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Em andamento":
      return { bg: "#fef3c7", text: "#b45309" };
    case "Aguardando":
      return { bg: "#e0e7ff", text: "#4338ca" };
    case "Resolvido":
      return { bg: "#dcfce7", text: "#15803d" };
    default:
      return { bg: "#f1f5f9", text: "#475569" };
  }
};

function NativeTicketsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = ["Todos", "Abertos", "Fechados"];

  return (
    <View style={styles.container}>
      {/* Topo com fundo branco (Header, Busca e Filtros) */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tickets</Text>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar tickets..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterContainer}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterButton,
                  isActive && styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Lista de Tickets */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {ticketsList.map((ticket) => {
          const priorityStyle = getPriorityStyles(ticket.priority);
          const statusStyle = getStatusStyles(ticket.status);

          return (
            <TouchableOpacity
              key={ticket.id}
              style={styles.ticketCard}
              onPress={() => router.push(`/tickets/${ticket.id}` as any)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.titleArea}>
                  <Text style={styles.ticketTitle} numberOfLines={1}>
                    {ticket.title}
                  </Text>
                  <Text style={styles.ticketCategory}>{ticket.category}</Text>
                </View>
                <View
                  style={[styles.badge, { backgroundColor: priorityStyle.bg }]}
                >
                  <Text
                    style={[styles.badgeText, { color: priorityStyle.text }]}
                  >
                    {ticket.priority}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View
                  style={[styles.badge, { backgroundColor: statusStyle.bg }]}
                >
                  <Text style={[styles.badgeText, { color: statusStyle.text }]}>
                    {ticket.status}
                  </Text>
                </View>
                <Text style={styles.ticketTime}>{ticket.time}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Botão Flutuante (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push("/tickets/new" as any)}
      >
        <Plus size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Rodapé de Navegação */}
      <View style={styles.navbar}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === "Tickets"; // Aba Tickets ativa

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

export default function TicketsPage() {
  if (Platform.OS === "web") {
    return <Tickets />;
  }

  return <NativeTicketsScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  topSection: {
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0f172a",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: "#2563eb",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  filterTextActive: {
    color: "#ffffff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Espaço para o FAB não cobrir os itens
    gap: 16,
  },
  ticketCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleArea: {
    flex: 1,
    paddingRight: 12,
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  ticketCategory: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketTime: {
    fontSize: 13,
    fontWeight: "500",
    color: "#94a3b8",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 90,
    right: 20,
    backgroundColor: "#2563eb",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
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
