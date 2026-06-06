import { useRouter } from "expo-router";
import { ArrowLeft, ChevronDown } from "lucide-react-native";
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

// Importa a versão Web (ajustado de acordo com a sua estrutura de pastas)
import { NewTicket as WebNewTicket } from "../../pages/NewTicket";

function NativeNewTicketScreen() {
  const router = useRouter();
  
  // Traz a função de adicionar ticket e os dados do usuário logado
  const { addTicket } = useTickets();
  const { user } = useUser();

  // Estados para capturar os dados do formulário
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Média");
  const [description, setDescription] = useState("");
  
  // Estados e opções da Categoria
  const [showCategories, setShowCategories] = useState(false);
  const CATEGORIES = ["Hardware", "Software", "Rede", "Infraestrutura", "Backup", "E-mail", "Acesso"];
  
  // Opções de Prioridade
  const PRIORITIES = ["Baixa", "Média", "Alta", "Crítica"];

  const handleSubmit = () => {
    // Verificação de segurança
    if (!title || !category || !description) return;

    // Salva o ticket globalmente na memória do app
    addTicket({
      title,
      category,
      priority: priority as any,
      description,
      requester: user.name, // Puxa dinamicamente o nome do usuário logado ("João Silva")
    });
    
    // Volta para a tela anterior após abrir o ticket
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Novo Ticket</Text>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          
          <View style={styles.formContainer}>
            
            {/* Campo: Título */}
            <View style={styles.field}>
              <Text style={styles.label}>Título do Problema</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Impressora sem tinta"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* Campo: Categoria (Com Dropdown Flutuante) */}
            <View style={styles.field}>
              <Text style={styles.label}>Categoria</Text>
              <TouchableOpacity 
                style={[styles.dropdown, showCategories && { borderColor: "#2563eb" }]} 
                activeOpacity={0.7}
                onPress={() => setShowCategories(!showCategories)}
              >
                <Text style={[styles.dropdownText, !category && { color: "#94a3b8" }]}>
                  {category || "Selecione uma categoria"}
                </Text>
                <ChevronDown size={20} color={showCategories ? "#2563eb" : "#94a3b8"} />
              </TouchableOpacity>

              {/* Lista suspensa (Dropdown) que aparece ao clicar */}
              {showCategories && (
                <View style={styles.optionsContainer}>
                  {CATEGORIES.map((cat, index) => {
                    const isSelected = category === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.optionItem,
                          index === CATEGORIES.length - 1 && { borderBottomWidth: 0 }
                        ]}
                        activeOpacity={0.7}
                        onPress={() => {
                          setCategory(cat);
                          setShowCategories(false); // Fecha o menu ao selecionar
                        }}
                      >
                        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Campo: Prioridade */}
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

            {/* Campo: Descrição */}
            <View style={styles.field}>
              <Text style={styles.label}>Descrição Detalhada</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Descreva o problema com o máximo de detalhes possível..."
                placeholderTextColor="#94a3b8"
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Rodapé Fixo: Botão de Envio */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (!title || !category || !description) && styles.submitButtonDisabled
          ]} 
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={!title || !category || !description} // Desativa se faltar preencher
        >
          <Text style={styles.submitButtonText}>Abrir Ticket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function NewTicketPage() {
  if (Platform.OS === "web") {
    // Renderiza a versão Web (React.js + Tailwind)
    return <WebNewTicket />;
  }

  // Renderiza a versão Nativa (Celular)
  return <NativeNewTicketScreen />;
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#ffffff" 
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: "#2563eb", 
    borderBottomWidth: 1, 
    borderBottomColor: "#f1f5f9" 
  },
  backButton: { 
    marginRight: 16,
    padding: 4,
  },
  title: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#ffffff" 
  },
  content: { 
    padding: 24,
    paddingBottom: 40,
  },
  formContainer: {
    gap: 20,
  },
  field: {
    marginBottom: 4,
    zIndex: 10, // Importante para o dropdown sobrepor os campos abaixo
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
    marginLeft: 4,
  },
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
  textArea: {
    height: 120,
    paddingTop: 16,
    paddingBottom: 16,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  dropdownText: {
    fontSize: 15,
    color: "#0f172a",
  },
  optionsContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  optionText: {
    fontSize: 15,
    color: "#475569",
  },
  optionTextSelected: {
    color: "#2563eb",
    fontWeight: "700",
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
  },
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
  priorityPillSelected: {
    backgroundColor: "#eff6ff",
    borderColor: "#2563eb",
  },
  priorityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  priorityTextSelected: {
    color: "#2563eb",
  },
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
  submitButtonDisabled: {
    backgroundColor: "#93c5fd", // Um azul mais claro para indicar que está inativo
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});