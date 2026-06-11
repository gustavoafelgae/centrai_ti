// app/tickets/index.tsx
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { BottomNav } from "../components/BottomNav";

const tickets = [
  {
    id: 1,
    title: "Lentidão no sistema ERP",
    status: "Em andamento",
    priority: "Alta",
    time: "2h atrás",
    category: "Performance",
  },
  {
    id: 2,
    title: "Resetar senha de usuário",
    status: "Aguardando",
    priority: "Baixa",
    time: "4h atrás",
    category: "Acesso",
  },
  {
    id: 3,
    title: "Instalação do Microsoft Office",
    status: "Resolvido",
    priority: "Média",
    time: "1d atrás",
    category: "Software",
  },
  {
    id: 4,
    title: "Problema na conexão VPN",
    status: "Em andamento",
    priority: "Alta",
    time: "3h atrás",
    category: "Rede",
  },
  {
    id: 5,
    title: "Backup não está funcionando",
    status: "Aguardando",
    priority: "Alta",
    time: "5h atrás",
    category: "Backup",
  },
  {
    id: 6,
    title: "Solicitar novo notebook",
    status: "Resolvido",
    priority: "Média",
    time: "2d atrás",
    category: "Hardware",
  },
];

type TabType = "all" | "open" | "closed";

export function Tickets() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Em andamento":
        return { bg: "#fef9c3", text: "#eab308" };
      case "Aguardando":
        return { bg: "#eff6ff", text: "#3b82f6" };
      case "Resolvido":
        return { bg: "#dcfce7", text: "#22c55e" };
      default:
        return { bg: "#f1f5f9", text: "#64748b" };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Crítica":
        return { bg: "#fee2e2", text: "#ef4444" };
      case "Alta":
        return { bg: "#ffedd5", text: "#f97316" };
      case "Média":
        return { bg: "#fef9c3", text: "#eab308" };
      default:
        return { bg: "#f1f5f9", text: "#64748b" };
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === "open" && ticket.status === "Resolvido") return false;
    if (activeTab === "closed" && ticket.status !== "Resolvido") return false;
    if (
      searchQuery &&
      !ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const tabs: { key: TabType; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "open", label: "Abertos" },
    { key: "closed", label: "Fechados" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/home")}
          >
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tickets</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#94a3b8"
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholder="Buscar tickets..."
            placeholderTextColor="#94a3b8"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tickets List */}
      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const statusStyle = getStatusStyle(item.status);
          const priorityStyle = getPriorityStyle(item.priority);

          return (
            <TouchableOpacity
              style={styles.ticketCard}
              onPress={() => router.push(`/tickets/${item.id}` as any)}
              activeOpacity={0.7}
            >
              <View style={styles.ticketHeader}>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.ticketCategory}>{item.category}</Text>
                </View>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: priorityStyle.bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      { color: priorityStyle.text },
                    ]}
                  >
                    {item.priority}
                  </Text>
                </View>
              </View>

              <View style={styles.ticketFooter}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusStyle.bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: statusStyle.text },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
                <Text style={styles.ticketTime}>{item.time}</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={16}
                color="#94a3b8"
                style={styles.chevron}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>Nenhum ticket encontrado</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/tickets/new" as any)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  // Header
  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginRight: 40,
  },
  headerSpacer: {
    width: 40,
  },
  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
  },
  // Tabs
  tabsRow: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#2563eb",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  tabTextActive: {
    color: "#ffffff",
  },
  // List
  listContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  // Ticket Card
  ticketCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    position: "relative",
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingRight: 24,
  },
  ticketInfo: {
    flex: 1,
    marginRight: 12,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  ticketCategory: {
    fontSize: 13,
    color: "#6b7280",
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "700",
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  ticketTime: {
    fontSize: 12,
    color: "#94a3b8",
  },
  chevron: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  // Empty State
  emptyState: {
    alignItems: "center",
    padding: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
  },
  // FAB
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});