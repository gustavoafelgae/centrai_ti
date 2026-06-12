// app/analyst.tsx
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../hooks/context/UserContext";
import { useStatus } from "../hooks/useLists";
import { ticketService } from "../services/ticketService";
import { TicketListResponse } from "../types/ticketInterface";

export default function AnalystConsole() {
  const router = useRouter();
  const { user } = useUser();
  const { statusList } = useStatus();

  const [tickets, setTickets] = useState<TicketListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatusId, setActiveStatusId] = useState<number | null>(null);

  // Carrega tickets pelo cargoId do usuário
  useEffect(() => {
    if (user?.idCargo) {
      carregarTickets();
    }
  }, [user?.idCargo])

  const carregarTickets = async () => {
    setLoading(true);
    try {
      const dados = await ticketService.listarPorCargo(user!.idCargo);
      setTickets(dados);
    } catch (error: any) {
      console.error('Erro ao carregar tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pega o último status do array de status
  const getUltimoStatus = (ticket: TicketListResponse) => {
    if (!ticket.status || ticket.status.length === 0) return null;
    return ticket.status[ticket.status.length - 1];
  };

  // Nome do status pelo ID
  const getStatusNome = (statusId: number) => {
    const status = statusList.find(s => s.id === statusId);
    return status?.nome || 'Desconhecido';
  };

  const getStatusStyle = (statusId: number) => {
    switch (statusId) {
      case 1: return { bg: "#dcfce7", text: "#22c55e" };  // Aberto
      case 2: return { bg: "#fef9c3", text: "#eab308" };  // Em Andamento
      case 3: return { bg: "#f1f5f9", text: "#64748b" };  // Finalizado
      case 4: return { bg: "#fee2e2", text: "#ef4444" };  // Cancelado
      default: return { bg: "#f1f5f9", text: "#64748b" };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Critica": return { bg: "#fee2e2", text: "#ef4444" };
      case "Alta": return { bg: "#ffedd5", text: "#f97316" };
      case "Media": return { bg: "#fef9c3", text: "#eab308" };
      default: return { bg: "#dcfce7", text: "#22c55e" };
    }
  };

  // Função helper para verificar se o ticket está ativo
  const isTicketAtivo = (ticket: TicketListResponse) => {
    const s = getUltimoStatus(ticket);
    const statusId = s?.statusNomeId || 0;
    return statusId == 1 || statusId == 2; // Aberto e Em Adanmento
  };

  // Contadores apenas de tickets ativos
  const ticketsAtivos = tickets.filter(isTicketAtivo);

  const baixaCount = ticketsAtivos.filter(t => t.prioridade === 'Baixa').length;
  const mediaCount = ticketsAtivos.filter(t => t.prioridade === 'Media').length;
  const altaCount = ticketsAtivos.filter(t => t.prioridade === 'Alta').length;
  const criticaCount = ticketsAtivos.filter(t => t.prioridade === 'Critica').length;

  // Filtra tickets
  const filteredTickets = tickets.filter((ticket) => {
    const ultimoStatus = getUltimoStatus(ticket);

    if (activeStatusId !== null) {
      if (!ultimoStatus || ultimoStatus.statusNomeId !== activeStatusId) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        ticket.titulo.toLowerCase().includes(query) ||
        ticket.serial.toLowerCase().includes(query)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando tickets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push("/home")}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Console do Analista</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Cards de Métricas */}
        {/* Cards de Métricas - Por Prioridade */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#22c55e' }]}>{baixaCount}</Text>
            <Text style={styles.metricLabel}>Baixa</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#eab308' }]}>{mediaCount}</Text>
            <Text style={styles.metricLabel}>Média</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#f97316' }]}>{altaCount}</Text>
            <Text style={styles.metricLabel}>Alta</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#ef4444' }]}>{criticaCount}</Text>
            <Text style={styles.metricLabel}>Crítica</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholder="Buscar por título ou serial..."
            placeholderTextColor="#94a3b8"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros de Status */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, activeStatusId === null && styles.tabActive]}
            onPress={() => setActiveStatusId(null)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeStatusId === null && styles.tabTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          {statusList.map((status) => (
            <TouchableOpacity
              key={status.id}
              style={[styles.tab, activeStatusId === status.id && styles.tabActive]}
              onPress={() => setActiveStatusId(status.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeStatusId === status.id && styles.tabTextActive]}>
                {status.nome}
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
        refreshing={loading}
        onRefresh={carregarTickets}
        renderItem={({ item }) => {
          const ultimoStatus = getUltimoStatus(item);
          const statusId = ultimoStatus?.statusNomeId || 0;
          const statusStyle = getStatusStyle(statusId);
          const priorityStyle = getPriorityStyle(item.prioridade);

          return (
            <TouchableOpacity
              style={styles.ticketCard}
              onPress={() => router.push({
                pathname: '/tickets/[id]',
                params: { id: item.serial }
              } as any)}
              activeOpacity={0.7}
            >
              <View style={styles.ticketHeader}>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketSerial}>{item.serial}</Text>
                  <Text style={styles.ticketTitle} numberOfLines={2}>
                    {item.titulo}
                  </Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg }]}>
                  <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
                    {item.prioridade}
                  </Text>
                </View>
              </View>

              <View style={styles.ticketFooter}>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <View style={[styles.statusDot, { backgroundColor: statusStyle.text }]} />
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {getStatusNome(statusId)}
                  </Text>
                </View>
                {ultimoStatus && (
                  <Text style={styles.ticketTime}>{ultimoStatus.data}</Text>
                )}
              </View>

              <Ionicons name="chevron-forward" size={16} color="#94a3b8" style={styles.chevron} />
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

      {/* Resumo */}
      <View style={styles.summaryBar}>
        <MaterialCommunityIcons name="chart-bar" size={16} color="#60a5fa" />
        <Text style={styles.summaryText}>
          {filteredTickets.length} de {tickets.length} tickets
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 16, color: '#64748b' },
  header: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingTop: Platform.OS === "ios" ? 50 : 20, paddingBottom: 12, paddingHorizontal: 16 },
  headerTop: { flexDirection: "row", alignItems: "center", marginBottom: 16, marginTop: 20 },
  backButton: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: "700", color: "#0f172a", textAlign: "center", marginRight: 40 },
  headerSpacer: { width: 40 },
  metricsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  metricCard: { flex: 1, backgroundColor: "#f8fafc", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  metricValue: { fontSize: 22, fontWeight: "800" },
  metricLabel: { fontSize: 11, color: "#64748b", fontWeight: "600", marginTop: 2 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#f3f4f6", borderRadius: 14, paddingHorizontal: 14, height: 46, marginBottom: 14 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#0f172a" },
  tabsRow: { flexDirection: "row", gap: 8, flexWrap: 'wrap' },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#f3f4f6" },
  tabActive: { backgroundColor: "#2563eb" },
  tabText: { fontSize: 13, fontWeight: "600", color: "#6b7280" },
  tabTextActive: { color: "#ffffff" },
  listContent: { padding: 16, paddingBottom: 80, gap: 12 },
  ticketCard: { backgroundColor: "#ffffff", borderRadius: 20, padding: 16, elevation: 2, position: "relative" },
  ticketHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, paddingRight: 24 },
  ticketInfo: { flex: 1, marginRight: 12 },
  ticketSerial: { fontSize: 12, fontWeight: "700", color: "#2563eb", marginBottom: 4 },
  ticketTitle: { fontSize: 15, fontWeight: "700", color: "#0f172a", lineHeight: 20 },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  priorityText: { fontSize: 11, fontWeight: "700" },
  ticketFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: "700" },
  ticketTime: { fontSize: 11, color: "#94a3b8" },
  chevron: { position: "absolute", top: 16, right: 16 },
  emptyState: { alignItems: "center", padding: 40, gap: 12 },
  emptyText: { fontSize: 16, color: "#94a3b8" },
  summaryBar: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#e5e7eb", gap: 8, paddingBottom: 50 },
  summaryText: { fontSize: 16, color: "#64748b" },
});