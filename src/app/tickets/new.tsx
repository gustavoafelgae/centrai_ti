import { useRouter } from "expo-router";
import { ArrowLeft, ChevronDown, Paperclip } from "lucide-react-native";
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
import { NewTicket } from "../../pages/NewTicket";

function NativeNewTicketScreen() {
  const router = useRouter();
  const [priority, setPriority] = useState("Média");

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Ticket</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {/* Título */}
          <View style={styles.field}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              placeholder="Descreva o problema brevemente"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Categoria */}
          <View style={styles.field}>
            <Text style={styles.label}>Categoria</Text>
            <TouchableOpacity style={styles.dropdown} activeOpacity={0.7}>
              <Text style={styles.dropdownText}>Selecione uma categoria</Text>
              <ChevronDown size={20} color="#0f172a" />
            </TouchableOpacity>
          </View>

          {/* Prioridade */}
          <View style={styles.field}>
            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.priorityContainer}>
              {["Baixa", "Média", "Alta"].map((p) => {
                const isActive = priority === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityButton,
                      isActive && styles.priorityButtonActive,
                    ]}
                    onPress={() => setPriority(p)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        isActive && styles.priorityTextActive,
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
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Descreva o problema em detalhes..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={5}
              textAlignVertical="top" // Garante o alinhamento no topo para Android
            />
          </View>

          {/* Anexos */}
          <View style={styles.field}>
            <Text style={styles.label}>Anexos (opcional)</Text>
            <TouchableOpacity style={styles.uploadArea} activeOpacity={0.7}>
              <Paperclip size={24} color="#64748b" style={styles.uploadIcon} />
              <Text style={styles.uploadTitle}>
                Clique para anexar arquivos
              </Text>
              <Text style={styles.uploadSubtitle}>Máximo 10MB</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function NewTicketPage() {
  if (Platform.OS === "web") {
    return <NewTicket />;
  }

  return <NativeNewTicketScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
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
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
    backgroundColor: "#ffffff",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
  },
  dropdownText: {
    fontSize: 15,
    color: "#0f172a",
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  priorityButtonActive: {
    borderColor: "#eab308", // Borda amarela da opção "Média"
    backgroundColor: "#fef9c3", // Fundo amarelo claro
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
  },
  priorityTextActive: {
    color: "#b45309", // Texto laranja/marrom para destacar
    fontWeight: "600",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
    backgroundColor: "#ffffff",
    height: 120, // Altura maior para a área de texto
  },
  uploadArea: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  uploadIcon: {
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
  },
});
