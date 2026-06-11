// app/services/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ServiceDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Mock de dados do serviço
  const service = {
    name: "Manutenção de Servidor",
    rating: 4.8,
    reviews: 127,
    description:
      "Oferecemos serviços completos de manutenção e monitoramento de servidores para garantir que sua infraestrutura de TI funcione sem interrupções.",
    features: [
      "Monitoramento 24/7",
      "Atualizações automáticas de segurança",
      "Backup diário automatizado",
      "Relatórios mensais de performance",
      "Suporte técnico prioritário",
      "Tempo de resposta: 30 minutos",
    ],
    image:
      "https://images.unsplash.com/photo-1711721399281-02806b65d91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwc2VydmVyJTIwZGF0YWNlbnRlcnxlbnwxfHx8fDE3NzM5MjIyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  };

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        {/* Imagem de Capa e Botão Voltar */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: service.image }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Conteúdo do Serviço */}
        <View style={styles.contentContainer}>
          {/* Cabeçalho: Título */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{service.name}</Text>
          </View>

          {/* Avaliação */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#eab308" />
            <Text style={styles.ratingText}>
              <Text style={styles.ratingNumber}>{service.rating}</Text> •{" "}
              {service.reviews} avaliações
            </Text>
          </View>

          {/* Cards de Estatísticas */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="time-outline" size={20} color="#2563eb" style={styles.statIcon} />
              <Text style={styles.statText}>Resposta em{"\n"}30min</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={20} color="#2563eb" style={styles.statIcon} />
              <Text style={styles.statText}>500+ clientes</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#2563eb" style={styles.statIcon} />
              <Text style={styles.statText}>99.9% uptime</Text>
            </View>
          </View>

          {/* Descrição */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.descriptionText}>{service.description}</Text>
          </View>

          {/* O que está incluso */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>O que está incluso</Text>
            <View style={styles.featuresList}>
              {service.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Botão de Ação */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/tickets/new" as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.ctaButtonText}>Solicitar Serviço</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    backgroundColor: "#ffffff",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  contentContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginRight: 16,
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  ratingText: {
    fontSize: 14,
    color: "#475569",
    marginLeft: 6,
  },
  ratingNumber: {
    fontWeight: "600",
    color: "#334155",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  statIcon: {
    marginBottom: 8,
  },
  statText: {
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
    lineHeight: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    fontSize: 15,
    color: "#334155",
    marginLeft: 12,
    flex: 1,
  },
  ctaButton: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  ctaButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});