// app/tickets/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";

export function TicketDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const ticket = {
    id: Number(id),
    title: "Lentidão no sistema ERP",
    status: "Em andamento",
    priority: "Alta",
    category: "Performance",
    createdAt: "19/03/2026 10:30",
    assignedTo: "Carlos Silva",
    description:
      "O sistema ERP está apresentando lentidão significativa ao carregar relatórios de vendas. O problema começou hoje pela manhã e está afetando toda a equipe comercial.",
  };

  const messages = [
    {
      id: 1,
      sender: "Você",
      text: "O sistema ERP está apresentando lentidão significativa ao carregar relatórios de vendas.",
      time: "10:30",
      isOwn: true,
    },
    {
      id: 2,
      sender: "Carlos Silva",
      text: "Obrigado pelo relato. Vou verificar os logs do servidor agora mesmo.",
      time: "10:45",
      isOwn: false,
    },
    {
      id: 3,
      sender: "Carlos Silva",
      text: "Identifiquei o problema. Estamos com alto uso de CPU no servidor de banco de dados. Já estou otimizando as consultas.",
      time: "11:20",
      isOwn: false,
    },
    {
      id: 4,
      sender: "Você",
      text: "Ótimo! Quanto tempo deve levar para resolver?",
      time: "11:25",
      isOwn: true,
    },
  ];

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Crítica":
        return { bg: "#fee2e2", text: "#ef4444" };
      case "Alta":
        return { bg: "#ffedd5", text: "#f97316" };
      case "Média":
        return { bg: "#fef9c3", text: "#eab308" };
      default:
        return { bg: "#dcfce7", text: "#22c55e" };
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      // Aqui você adicionaria a lógica de envio
      console.log("Enviando mensagem:", message);
      setMessage("");
      // Rolar para o final
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const priorityStyle = getPriorityStyle(ticket.priority);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/tickets")}
          >
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Ticket #{ticket.id}
            </Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg }]}>
            <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
              {ticket.priority}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
        }}
      >
        {/* Ticket Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.ticketTitle}>{ticket.title}</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={[styles.infoValue, { color: "#eab308" }]}>
                {ticket.status}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categoria:</Text>
              <Text style={styles.infoValue}>{ticket.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Atribuído a:</Text>
              <Text style={styles.infoValue}>{ticket.assignedTo}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Criado em:</Text>
              <Text style={styles.infoValue}>{ticket.createdAt}</Text>
            </View>
          </View>
        </View>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageWrapper,
                msg.isOwn ? styles.messageOwn : styles.messageOther,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  msg.isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther,
                ]}
              >
                {!msg.isOwn && (
                  <Text style={styles.messageSender}>{msg.sender}</Text>
                )}
                <Text
                  style={[
                    styles.messageText,
                    msg.isOwn ? styles.messageTextOwn : styles.messageTextOther,
                  ]}
                >
                  {msg.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    msg.isOwn ? styles.messageTimeOwn : styles.messageTimeOther,
                  ]}
                >
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach" size={24} color="#6b7280" />
          </TouchableOpacity>
          <TextInput
            value={message}
            onChangeText={setMessage}
            style={styles.textInput}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#94a3b8"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="send"
              size={20}
              color={message.trim() ? "#ffffff" : "#94a3b8"}
            />
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "700",
  },
  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  // Info Card
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
  },
  infoGrid: {
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  // Messages
  messagesContainer: {
    gap: 12,
    paddingBottom: 8,
  },
  messageWrapper: {
    flexDirection: "row",
  },
  messageOwn: {
    justifyContent: "flex-end",
  },
  messageOther: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubbleOwn: {
    backgroundColor: "#2563eb",
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  messageSender: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  messageTextOwn: {
    color: "#ffffff",
  },
  messageTextOther: {
    color: "#0f172a",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 6,
    textAlign: "right",
  },
  messageTimeOwn: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  messageTimeOther: {
    color: "#94a3b8",
  },
  // Input
  inputContainer: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 30 : 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0f172a",
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#e5e7eb",
  },
});