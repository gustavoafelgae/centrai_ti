// app/tickets/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
  const { loading, atualizarTicket } = useTicket();

  console.log("->"+id)

  if (!ticket) {
    return (
      <View style={styles.centered}>
        <Ionicons name="ticket-outline" size={48} color="#94a3b8" />
        <Text style={styles.emptyTitle}>Ticket não encontrado</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isCreator = user?.id === ticket.idUsuarioCreated;
  const isAssignedToMe = ticket.idUsuarioResolved === user?.id;
  const isNotAssigned = ticket.idUsuarioResolved === 0;

  const canAssign = isNotAssigned && !isCreator;
  const canResolve = isAssignedToMe && ticket.statusId !== 3 && ticket.statusId !== 4;
  const canCancel = isAssignedToMe && ticket.statusId !== 3 && ticket.statusId !== 4;

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
      case 3: return { text: "Finalizado", color: "#22c55e", bg: "#dcfce7" };
      case 4: return { text: "Cancelado", color: "#ef4444", bg: "#fee2e2" };
      default: return { text: "Desconhecido", color: "#64748b", bg: "#f1f5f9" };
    }
  };

  const handleAssign = async () => {
    Alert.alert(
      "Atribuir Ticket",
      "Deseja atribuir este ticket para você?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Atribuir",
          onPress: async () => {
            const sucesso = await atualizarTicket(ticket.serial, {
              idUsuarioResolved: user!.id,
              idStatus: 2, // Em Andamento
            });

            if (sucesso) {
              Alert.alert("Sucesso", "Ticket atribuído com sucesso!");
            }
          }
        }
      ]
    );
  };

  const handleResolve = async () => {
    Alert.alert(
      "Resolver Ticket",
      "Confirmar que este ticket foi resolvido?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resolver",
          onPress: async () => {
            const sucesso = await atualizarTicket(ticket.serial, {
              idStatus: 3, // Finalizado
            });

            if (sucesso) {
              Alert.alert("Sucesso", "Ticket resolvido com sucesso!");
            }
          }
        }
      ]
    );
  };

  const handleCancel = async () => {
    Alert.alert(
      "Cancelar Ticket",
      "Tem certeza que deseja cancelar este ticket?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            const sucesso = await atualizarTicket(ticket.serial, {
              idStatus: 4, // Cancelado
            });

            if (sucesso) {
              Alert.alert("Sucesso", "Ticket cancelado com sucesso!");
            }
          }
        }
      ]
    );
  };

  const priorityStyle = getPriorityStyle(ticket.prioridade);
  const statusInfo = getStatusInfo(ticket.statusId);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
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
        {/* Loading overlay */}
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
              <Text style={styles.infoValue}>{ticket.servicoNome}</Text>
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
        {canAssign && (
          <TouchableOpacity
            style={[styles.actionButton, styles.assignButton]}
            onPress={handleAssign}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add-outline" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Atribuir para mim</Text>
          </TouchableOpacity>
        )}

        {canResolve && (
          <TouchableOpacity
            style={[styles.actionButton, styles.resolveButton]}
            onPress={handleResolve}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Solucionar</Text>
          </TouchableOpacity>
        )}

        {canCancel && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleCancel}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}

        {!canAssign && !canResolve && !canCancel && (
          <View style={styles.noActionContainer}>
            <Ionicons name="information-circle-outline" size={20} color="#64748b" />
            <Text style={styles.noActionText}>
              {ticket.statusId === 3
                ? "Este ticket já foi finalizado."
                : ticket.statusId === 4
                  ? "Este ticket foi cancelado."
                  : isCreator
                    ? "Você criou este ticket. Aguarde um analista atribuí-lo."
                    : "Nenhuma ação disponível no momento."}
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
  actionsContainer: { backgroundColor: "#ffffff", borderTopWidth: 1, borderTopColor: "#e5e7eb", padding: 16, paddingBottom: Platform.OS === "ios" ? 30 : 16, gap: 10 },
  actionButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 14, gap: 8 },
  assignButton: { backgroundColor: "#2563eb" },
  resolveButton: { backgroundColor: "#22c55e" },
  cancelButton: { backgroundColor: "#ef4444" },
  actionButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  noActionContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, gap: 8, paddingBottom: 40 },
  noActionText: { fontSize: 14, color: "#64748b", textAlign: "center" },
});