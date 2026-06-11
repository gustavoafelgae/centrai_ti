// app/tickets/new.tsx
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
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useTickets } from "../hooks/TicketContext";
import { useUser } from "../hooks/UserContext";

const CATEGORIES = [
  "Hardware",
  "Software",
  "Rede",
  "Infraestrutura",
  "Backup",
  "E-mail",
  "Acesso",
];

const PRIORITIES = ["Baixa", "Média", "Alta", "Crítica"];

export function NewTicket() {
  const router = useRouter();
  const { addTicket } = useTickets();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Média");
  const [description, setDescription] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "Crítica": return { bg: "#fee2e2", text: "#ef4444", border: "#fecaca" };
      case "Alta": return { bg: "#ffedd5", text: "#f97316", border: "#fed7aa" };
      case "Média": return { bg: "#fef9c3", text: "#eab308", border: "#fde68a" };
      default: return { bg: "#dcfce7", text: "#22c55e", border: "#bbf7d0" };
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Erro", "Informe o título do problema");
      return;
    }
    if (!category) {
      Alert.alert("Erro", "Selecione uma categoria");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Erro", "Descreva o problema");
      return;
    }

    addTicket({
      title: title.trim(),
      category,
      priority: priority as any,
      description: description.trim(),
      requester: user?.nome || "Anônimo",
    });

    Alert.alert("Sucesso", "Ticket criado com sucesso!", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
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
          />
        </View>

        {/* Categoria */}
        <View style={styles.field}>
          <Text style={styles.label}>Categoria</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowCategories(true)}
            activeOpacity={0.7}
          >
            <Text style={category ? styles.selectText : styles.selectPlaceholder}>
              {category || "Selecione uma categoria"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#94a3b8" />
          </TouchableOpacity>
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
                >
                  <Text
                    style={[
                      styles.priorityText,
                      isActive && { color: colors.text },
                    ]}
                  >
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
          />
        </View>

        {/* Botão Submit */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!title || !category || !description) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!title || !category || !description}
          activeOpacity={0.8}
        >
          <Ionicons name="send" size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.submitButtonText}>Abrir Ticket</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Categorias */}
      <Modal
        visible={showCategories}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategories(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategories(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione uma Categoria</Text>
              <TouchableOpacity onPress={() => setShowCategories(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryOption,
                    category === item && styles.categoryOptionActive,
                  ]}
                  onPress={() => {
                    setCategory(item);
                    setShowCategories(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      category === item && styles.categoryOptionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {category === item && (
                    <Ionicons name="checkmark" size={20} color="#2563eb" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
});