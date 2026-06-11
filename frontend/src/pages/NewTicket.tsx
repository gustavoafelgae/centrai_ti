import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import { useUser } from "../hooks/context/UserContext";
import { useCurrentTicket } from "@/hooks/context/TicketContext";
import { useTicket } from "@/hooks/useTicket";
import { useServicos } from "@/hooks/useLists";

const PRIORITIES = ["Baixa", "Media", "Alta", "Critica"];

export default function NewTicket() {

  const router = useRouter();
  const params = useLocalSearchParams();
  const { ticket, setTicket } = useCurrentTicket();
  const { criarTicket } = useTicket();
  const { user } = useUser();
  const { servicos, loading: loadingServicos } = useServicos();

  const [title, setTitle] = useState("");
  const [selectedService, setSelectedService] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [priority, setPriority] = useState("Baixa");
  const [description, setDescription] = useState("");
  const [showServices, setShowServices] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const servicoId = params.servicoId ? Number(params.servicoId) : null;

  // Seleciona o serviço padrão da Home
  useEffect(() => {
    if (!loadingServicos && servicos.length > 0 && servicoId && !isInitialized) {
      const servicoEncontrado = servicos.find(s => s.id === servicoId);
      if (servicoEncontrado) {
        setSelectedService({
          id: servicoEncontrado.id,
          name: servicoEncontrado.name || '',
        });
        setIsInitialized(true);
      }
    }
  }, [loadingServicos, servicos, servicoId, isInitialized]);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "Critica": return { bg: "#fee2e2", text: "#ef4444", border: "#fecaca" };
      case "Alta": return { bg: "#ffedd5", text: "#f97316", border: "#fed7aa" };
      case "Media": return { bg: "#fef9c3", text: "#eab308", border: "#fde68a" };
      default: return { bg: "#dcfce7", text: "#22c55e", border: "#bbf7d0" };
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Erro", "Informe o título do problema");
      return;
    }
    if (!selectedService) {
      Alert.alert("Erro", "Selecione um serviço");
      return;
    }
    if (!priority) {
      Alert.alert("Erro", "Selecione uma prioridade");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Erro", "Descreva o problema");
      return;
    }
    if (!user?.id) {
      Alert.alert("Erro", "Usuário não identificado");
      return;
    }

    setLoadingSubmit(true);

    try {
      const dados = {
        idUsuario: user.id,
        titulo: title.trim(),
        prioridade: priority,
        descricao: description.trim(),
        idServico: selectedService.id,
      };
      console.log('Enviando ticket:', dados);
      const ticketCriado = await criarTicket(dados);

      if (ticketCriado) {
        Alert.alert(
          "Sucesso",
          `Ticket ${ticketCriado.serial} criado com sucesso!`,
          [{
            text: "OK",
            onPress: () => {
              router.replace({
                pathname: '/tickets/[id]',
                params: { id: ticketCriado.serial }
              });
            }
          }]
        );
      }
    } catch (error: any) {
      console.error('Erro ao criar ticket:', error);
      const mensagem = error.message || error.mensagem || 'Erro ao criar ticket';
      Alert.alert("Erro", mensagem);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Loading enquanto carrega serviços
  if (loadingServicos) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Ticket</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, color: '#64748b' }}>Carregando...</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Ticket</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Formulário */}
        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Título */}
          <View style={styles.field}>
            <Text style={styles.label}>Título do Problema</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Impressora sem tinta"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              editable={!loadingSubmit}
            />
          </View>

          {/* Serviço */}
          <View style={styles.field}>
            <Text style={styles.label}>Serviço</Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                selectedService && styles.selectButtonFilled,
              ]}
              onPress={() => setShowServices(true)}
              activeOpacity={0.7}
              disabled={loadingSubmit}
            >
              <Text style={selectedService ? styles.selectText : styles.selectPlaceholder}>
                {selectedService?.name || "Selecione um serviço"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#94a3b8" />
            </TouchableOpacity>

            {servicoId && selectedService && (
              <Text style={styles.categoryHint}>
                Serviço selecionado automaticamente
              </Text>
            )}
          </View>

          {/* Prioridade */}
          <View style={styles.field}>
            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map((p) => {
                const isActive = priority === p;
                const colors = getPriorityColor(p);
                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityButton,
                      isActive && {
                        backgroundColor: colors.bg,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setPriority(p)}
                    activeOpacity={0.7}
                    disabled={loadingSubmit}
                  >
                    <Text style={[styles.priorityText, isActive && { color: colors.text }]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Descrição */}
          <View style={styles.field}>
            <Text style={styles.label}>Descrição Detalhada</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva o problema com o máximo de detalhes possível..."
              placeholderTextColor="#94a3b8"
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!loadingSubmit}
            />
          </View>

          {/* Botão Submit */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!title || !selectedService || !priority || !description || loadingSubmit) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!title || !selectedService || !priority || !description || loadingSubmit}
            activeOpacity={0.8}
          >
            {loadingSubmit ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.submitButtonText}>Criando ticket...</Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="send" size={18} color="#ffffff" />
                <Text style={styles.submitButtonText}>Abrir Ticket</Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Modal de Serviços */}
        <Modal
          visible={showServices}
          transparent
          animationType="slide"
          onRequestClose={() => setShowServices(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowServices(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Selecione um Serviço</Text>
                <TouchableOpacity onPress={() => setShowServices(false)}>
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={servicos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const serviceName = item.name || '';
                  const isSelected = selectedService?.id === item.id;

                  return (
                    <TouchableOpacity
                      style={[
                        styles.categoryOption,
                        isSelected && styles.categoryOptionActive,
                      ]}
                      onPress={() => {
                        setSelectedService({
                          id: item.id,
                          name: serviceName,
                        });
                        setShowServices(false);
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[
                          styles.categoryOptionText,
                          isSelected && styles.categoryOptionTextActive,
                        ]}>
                          {serviceName}
                        </Text>
                        {item.description && (
                          <Text style={styles.serviceDescription} numberOfLines={1}>
                            {item.description}
                          </Text>
                        )}
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color="#2563eb" />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 16,
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
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginRight: 40,
  },
  headerSpacer: {
    width: 40,
  },
  // estilo para o select preenchido
  selectButtonFilled: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },

  // para o texto de dica
  categoryHint: {
    fontSize: 11,
    color: "#2563eb",
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Formulário
  formContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 24,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
  },
  textArea: {
    minHeight: 140,
    paddingTop: 14,
  },
  // Select
  selectButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 15,
    color: "#0f172a",
    flex: 1,
  },
  selectPlaceholder: {
    fontSize: 15,
    color: "#94a3b8",
    flex: 1,
  },
  // Prioridade
  priorityRow: {
    flexDirection: "row",
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7280",
  },
  // Submit
  submitButton: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#94a3b8",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  categoryOptionActive: {
    backgroundColor: "#eff6ff",
  },
  categoryOptionText: {
    fontSize: 16,
    color: "#374151",
  },
  categoryOptionTextActive: {
    color: "#2563eb",
    fontWeight: "600",
  },
  serviceDescription: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
});