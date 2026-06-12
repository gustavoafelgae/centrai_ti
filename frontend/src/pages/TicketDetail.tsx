// app/tickets/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useCurrentTicket } from "@/hooks/context/TicketContext";
import { useUser } from "@/hooks/context/UserContext";
import { useTicket } from "@/hooks/useTicket";

export default function TicketDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ticket } = useCurrentTicket();
  const { user } = useUser();
  const { loading, atualizarTicket, carregarTicket } = useTicket();

  const [isLoadingTicket, setIsLoadingTicket] = useState(true); // Começa true

  // Sempre carrega o ticket do backend ao entrar na tela
  useEffect(() => {
    if (id) {
      loadTicket();
    }
  }, [id]);

  const loadTicket = async () => {
    setIsLoadingTicket(true);
    await carregarTicket(id);  // Atualiza o contexto com dados frescos
    setIsLoadingTicket(false);
  };

  // Loading enquanto busca
  if (isLoadingTicket) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 12, color: '#64748b' }}>Carregando ticket...</Text>
      </View>
    );
  }

  // Não encontrado (após tentar carregar)
  if (!ticket) {
    return (
      <View style={styles.centered}>
        <Ionicons name="ticket-outline" size={48} color="#94a3b8" />
        <Text style={styles.emptyTitle}>Ticket não encontrado</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/tickets")}>
          <Text style={styles.backBtnText}>Voltar para lista</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ==================== REGRAS DE NEGÓCIO ====================

  const isCreator = user?.id === ticket.idUsuarioCreated;
  const isAssignedToMe = ticket.idUsuarioResolved === user?.id;
  const isNotAssigned = ticket.idUsuarioResolved === null;
  const isFromMyService = user?.idCargo === ticket.cargoId;

  const isOpen = ticket.statusId === 1;
  const isInProgress = ticket.statusId === 2;
  const isFinished = ticket.statusId === 3;
  const isCancelled = ticket.statusId === 4;
  const isClosed = isFinished || isCancelled;

  const canAssign = isNotAssigned && isFromMyService && !isClosed;
  const canFinish = isAssignedToMe && isInProgress;
  const canCancel = (isCreator || isAssignedToMe) && !isClosed;
  const buttonsDisabled = isClosed;

  // ==================== HANDLERS ====================

  const handleAssign = async () => {
    if (!canAssign || buttonsDisabled) return;

    Alert.alert(
      "Atribuir Ticket",
      "Deseja atribuir este ticket para você?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Atribuir",
          onPress: async () => {
            setIsLoadingTicket(true);
            await atualizarTicket(ticket.serial, {
              titulo: ticket.titulo,
              prioridade: ticket.prioridade,
              descricao: ticket.descricao,
              idServico: ticket.servicoId,
              idStatus: 2,
              idUsuarioResolved: user!.id,
            });
            setIsLoadingTicket(false);
          }
        }
      ]
    );
  };

  const handleFinish = async () => {
    if (!canFinish || buttonsDisabled) return;

    Alert.alert(
      "Finalizar Ticket",
      "Confirmar que este ticket foi resolvido?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Finalizar",
          onPress: async () => {
            setIsLoadingTicket(true);
            await atualizarTicket(ticket.serial, {
              titulo: ticket.titulo,
              prioridade: ticket.prioridade,
              descricao: ticket.descricao,
              idServico: ticket.servicoId,
              idStatus: 3,
              idUsuarioResolved: user!.id,
            });
            setIsLoadingTicket(false);
          }
        }
      ]
    );
  };

  const handleCancel = async () => {
    if (!canCancel || buttonsDisabled) return;

    const quem = isCreator ? "Você criou este ticket." : "Você está responsável por este ticket.";

    Alert.alert(
      "Cancelar Ticket",
      `Tem certeza que deseja cancelar este ticket?\n\n${quem}`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            setIsLoadingTicket(true);
            await atualizarTicket(ticket.serial, {
              titulo: ticket.titulo,
              prioridade: ticket.prioridade,
              descricao: ticket.descricao,
              idServico: ticket.servicoId,
              idStatus: 4,
              idUsuarioResolved: user!.id,
            });
            setIsLoadingTicket(false);
          }
        }
      ]
    );
  };

  // ==================== ESTILOS ====================

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Critica": return { bg: "#fee2e2", text: "#ef4444" };
      case "Alta": return { bg: "#ffedd5", text: "#f97316" };
      case "Media": return { bg: "#fef9c3", text: "#eab308" };
      default: return { bg: "#dcfce7", text: "#22c55e" };
    }
  };

  const getStatusInfo = (statusId: number) => {
    switch (statusId) {
      case 1: return { text: "Aberto", color: "#3b82f6", bg: "#eff6ff" };
      case 2: return { text: "Em Andamento", color: "#eab308", bg: "#fef9c3" };
      case 3: return { text: "Finalizado", color: "#64748b", bg: "#f1f5f9" };
      case 4: return { text: "Cancelado", color: "#ef4444", bg: "#fee2e2" };
      default: return { text: "Desconhecido", color: "#64748b", bg: "#f1f5f9" };
    }
  };

  const priorityStyle = getPriorityStyle(ticket.prioridade);
  const statusInfo = getStatusInfo(ticket.statusId);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/tickets")}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {ticket.serial}
            </Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg }]}>
            <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
              {ticket.prioridade}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Loading overlay durante ações */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        )}

        {/* Ticket Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.ticketTitle}>{ticket.titulo}</Text>

          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.text}
              </Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Serial:</Text>
              <Text style={styles.infoValue}>{ticket.serial}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Prioridade:</Text>
              <Text style={[styles.infoValue, { color: priorityStyle.text }]}>
                {ticket.prioridade}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Serviço:</Text>
              <Text style={styles.infoValue}>{ticket.servicoNome || `ID: ${ticket.servicoId}`}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Criado por:</Text>
              <Text style={styles.infoValue}>
                {isCreator ? "Você" : `ID: ${ticket.idUsuarioCreated}`}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Atribuído a:</Text>
              <Text style={[styles.infoValue, isAssignedToMe && { color: "#2563eb" }]}>
                {isNotAssigned ? "Não atribuído" : isAssignedToMe ? "Você" : `ID: ${ticket.idUsuarioResolved}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.descriptionText}>{ticket.descricao}</Text>
        </View>
      </ScrollView>

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionsRow}>
          {/* Botão Atribuir */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.assignButton,
              (!canAssign || buttonsDisabled) && styles.buttonDisabled,
            ]}
            onPress={handleAssign}
            disabled={!canAssign || buttonsDisabled || loading}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add-outline" size={18} color="#ffffff" />
            <Text style={styles.actionButtonText} numberOfLines={2}>
              {buttonsDisabled ? "Atribuir" : !isFromMyService ? "Atribuir" : "Atribuir"}
            </Text>
          </TouchableOpacity>

          {/* Botão Finalizar */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.finishButton,
              (!canFinish || buttonsDisabled) && styles.buttonDisabled,
            ]}
            onPress={handleFinish}
            disabled={!canFinish || buttonsDisabled || loading}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
            <Text style={styles.actionButtonText}>Finalizar</Text>
          </TouchableOpacity>

          {/* Botão Cancelar */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.cancelButton,
              (!canCancel || buttonsDisabled) && styles.buttonDisabled,
            ]}
            onPress={handleCancel}
            disabled={!canCancel || buttonsDisabled || loading}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={18} color="#ffffff" />
            <Text style={styles.actionButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        {/* Mensagens informativas */}
        {isClosed && (
          <View style={styles.noActionContainer}>
            <Ionicons name="information-circle-outline" size={18} color="#64748b" />
            <Text style={styles.noActionText}>
              {isFinished ? "Este ticket foi finalizado." : "Este ticket foi cancelado."}
            </Text>
          </View>
        )}

        {!isClosed && isNotAssigned && !isFromMyService && (
          <View style={styles.noActionContainer}>
            <Ionicons name="information-circle-outline" size={18} color="#64748b" />
            <Text style={styles.noActionText}>
              Apenas usuários do mesmo setor podem atribuir este ticket.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  backBtn: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: "#2563eb", borderRadius: 12 },
  backBtnText: { color: "#ffffff", fontWeight: "600" },
  header: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingTop: Platform.OS === "ios" ? 50 : 50, paddingBottom: 16, paddingHorizontal: 16 },
  headerTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  priorityBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  priorityText: { fontSize: 12, fontWeight: "700" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  loadingOverlay: { padding: 20, alignItems: "center" },
  infoCard: { backgroundColor: "#ffffff", borderRadius: 20, padding: 20, elevation: 2 },
  ticketTitle: { fontSize: 20, fontWeight: "700", color: "#0f172a", marginBottom: 12 },
  statusContainer: { marginBottom: 16 },
  statusBadge: { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 14, fontWeight: "700" },
  infoGrid: { gap: 10 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  infoLabel: { fontSize: 14, color: "#6b7280" },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#374151" },
  descriptionCard: { backgroundColor: "#ffffff", borderRadius: 20, padding: 20, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a", marginBottom: 12 },
  descriptionText: { fontSize: 15, color: "#374151", lineHeight: 24 },

  // Actions
  actionsRow: { flexDirection: 'row', gap: 8 },
  actionsContainer: { backgroundColor: "#ffffff", borderTopWidth: 1, borderTopColor: "#e5e7eb", padding: 16, paddingBottom: Platform.OS === "ios" ? 30 : 50, gap: 10 },
  actionButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 16, gap: 8 },
  assignButton: { backgroundColor: "#2563eb" },
  finishButton: { backgroundColor: "#22c55e" },
  cancelButton: { backgroundColor: "#ef4444" },
  buttonDisabled: { backgroundColor: "#d1d5db", opacity: 0.7 },
  actionButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "700", marginLeft:-5 },
  noActionContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 8, gap: 8, marginBottom: -10 },
  noActionText: { fontSize: 13, color: "#64748b", textAlign: "center" },
});