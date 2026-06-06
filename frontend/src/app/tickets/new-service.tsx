import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Briefcase } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Importa os nossos contextos globais
import { useTickets } from "../../hooks/TicketContext";
import { useUser } from "../../hooks/UserContext";

export default function NewServiceTicketScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { addTicket } = useTickets();
  const { user } = useUser();
  
  const serviceName = params.serviceName ? String(params.serviceName) : "Serviço Geral";

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Média");
  const [description, setDescription] = useState("");
  
  const PRIORITIES = ["Baixa", "Média", "Alta", "Crítica"];

  const handleSubmit = () => {
    if (!title || !description) return;

    addTicket({
      title,
      category: serviceName,
      priority: priority as any,
      description,
      requester: user.name,
    });
    
    // Redireciona para a tela de tickets substituindo a rota atual
    router.replace("/tickets");
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho Azul */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Solicitar Serviço</Text>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          
          <View style={styles.formContainer}>
            
            <View style={styles.field}>
              <Text style={styles.label}>Serviço Selecionado</Text>
              <View style={[styles.input, styles.disabledInput]}>
                <Briefcase size={20} color="#64748b" style={styles.fieldIcon} />
                <Text style={styles.disabledText}>{serviceName}</Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Resumo da Solicitação</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Instalação de novo software"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Prioridade</Text>
              <View style={styles.priorityRow}>
                {PRIORITIES.map((p) => {
                  const isSelected = priority === p;
                  return (
                    <TouchableOpacity
                      key={p}
                      style={[styles.priorityPill, isSelected && styles.priorityPillSelected]}
                      onPress={() => setPriority(p)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.priorityText, isSelected && styles.priorityTextSelected]}>
                        {p}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Detalhes do Pedido</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Descreva o que você precisa detalhadamente..."
                placeholderTextColor="#94a3b8"
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (!title || !description) && styles.submitButtonDisabled
          ]} 
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={!title || !description}
        >
          <Text style={styles.submitButtonText}>Confirmar Solicitação</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: "#2563eb", // Azul aplicado
    borderBottomWidth: 0, 
  },
  backButton: { marginRight: 16, padding: 4 },
  title: { fontSize: 18, fontWeight: "700", color: "#ffffff" }, // Texto branco
  content: { padding: 24, paddingBottom: 40 },
  formContainer: { gap: 20 },
  field: { marginBottom: 4 },
  label: { fontSize: 14, fontWeight: "600", color: "#334155", marginBottom: 8, marginLeft: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    color: "#0f172a",
    fontSize: 15,
  },
  disabledInput: {
    backgroundColor: "#f1f5f9",
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
  },
  disabledText: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "500",
  },
  fieldIcon: {
    marginRight: 12,
  },
  textArea: { height: 120, paddingTop: 16, paddingBottom: 16 },
  priorityRow: { flexDirection: "row", gap: 8 },
  priorityPill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "transparent",
  },
  priorityPillSelected: { backgroundColor: "#eff6ff", borderColor: "#2563eb" },
  priorityText: { fontSize: 13, fontWeight: "600", color: "#64748b" },
  priorityTextSelected: { color: "#2563eb" },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: { backgroundColor: "#93c5fd" },
  submitButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
});