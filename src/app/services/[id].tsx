import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Star,
  Users,
} from "lucide-react-native";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import WebServiceDetail from "../../pages/ServiceDetail";

// --- Banco de Dados Local (Mock) ---
// Usamos o ID do serviço como chave para buscar os detalhes corretos
const SERVICES_DATA: Record<string, any> = {
  "1": {
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
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1080&auto=format&fit=crop",
  },
  "2": {
    name: "Segurança Cibernética",
    rating: 4.9,
    reviews: 84,
    description:
      "Proteção avançada contra ameaças digitais, garantindo a integridade e confidencialidade dos dados da sua empresa contra ataques cibernéticos.",
    features: [
      "Firewall avançado e IDS/IPS",
      "Antivírus corporativo gerenciado",
      "Auditoria de vulnerabilidades",
      "Proteção contra ransomware",
      "Treinamento de equipe em segurança",
      "Resposta a incidentes 24/7",
    ],
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1080&auto=format&fit=crop",
  },
  "3": {
    name: "Cloud Computing",
    rating: 4.7,
    reviews: 92,
    description:
      "Soluções em nuvem escaláveis e seguras para modernizar a infraestrutura da sua empresa, reduzindo custos com hardware físico.",
    features: [
      "Migração segura para nuvem",
      "Arquitetura escalável (AWS/Azure/GCP)",
      "Otimização de custos mensais",
      "Alta disponibilidade (99.9% uptime)",
      "Balanceamento de carga",
      "Suporte a contêineres e Kubernetes",
    ],
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1080&auto=format&fit=crop",
  },
  "4": {
    name: "Backup & Recovery",
    rating: 4.9,
    reviews: 156,
    description:
      "Sistemas de backup automático e recuperação de desastres para garantir que você nunca perca dados críticos do seu negócio.",
    features: [
      "Backup automático em nuvem e local",
      "Criptografia de dados de ponta a ponta",
      "Testes periódicos de restauração",
      "Versionamento de arquivos",
      "Plano de Recuperação de Desastres (DRP)",
      "Retenção customizável de dados",
    ],
    image:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=1080&auto=format&fit=crop",
  },
  "5": {
    name: "Suporte Técnico",
    rating: 4.6,
    reviews: 210,
    description:
      "Suporte de TI abrangente para sua equipe. Resolvemos problemas de hardware e software rapidamente para manter a produtividade alta.",
    features: [
      "Helpdesk disponível 24/7",
      "Acesso remoto para soluções rápidas",
      "Suporte a Windows, Mac e Linux",
      "Manutenção preventiva de estações",
      "Gestão de inventário de TI",
      "Atendimento local sob demanda",
    ],
    image:
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=1080&auto=format&fit=crop",
  },
  "6": {
    name: "Infraestrutura de Rede",
    rating: 4.8,
    reviews: 65,
    description:
      "Projeto, configuração e otimização de redes corporativas (cabeamento estruturado e Wi-Fi) para máxima velocidade e estabilidade.",
    features: [
      "Projeto e instalação de redes",
      "Configuração de roteadores e switches",
      "Gestão de Wi-Fi corporativo",
      "Cabeamento estruturado certificado",
      "Redundância de links de internet",
      "Monitoramento de tráfego em tempo real",
    ],
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1080&auto=format&fit=crop",
  },
  "7": {
    name: "Gestão de Banco de Dados",
    rating: 4.9,
    reviews: 43,
    description:
      "Administração, otimização e monitoramento de bancos de dados relacionais e NoSQL para garantir consultas rápidas e dados seguros.",
    features: [
      "Otimização de queries pesadas",
      "Monitoramento de gargalos (Bottlenecks)",
      "Gestão de permissões de acesso",
      "Migração e replicação de dados",
      "Atualizações de versão sem downtime",
      "Suporte a PostgreSQL, MySQL, SQL Server",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1080&auto=format&fit=crop",
  },
  "8": {
    name: "Email Corporativo",
    rating: 4.5,
    reviews: 312,
    description:
      "Criação e gestão de contas de email profissionais com o domínio da sua empresa, incluindo filtros de spam avançados.",
    features: [
      "Emails com domínio personalizado",
      "Filtro anti-spam e anti-phishing",
      "Sincronização em múltiplos dispositivos",
      "Assinaturas de email padronizadas",
      "Migração de provedores antigos",
      "Painel de administração simplificado",
    ],
    image:
      "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=1080&auto=format&fit=crop",
  },
};

function NativeServiceDetailScreen() {
  const router = useRouter();

  // 1. Lemos os parâmetros da rota
  const params = useLocalSearchParams();

  // 2. Extraímos o ID de forma segura (garantindo que é uma string e não um array)
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const currentId = rawId ? String(rawId) : "1";

  // 3. Buscamos os dados corretos no banco de dados local com base no ID
  const service = SERVICES_DATA[currentId] || SERVICES_DATA["1"];

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        {/* Imagem de Capa e Botão Voltar */}
        <View style={styles.imageContainer}>
          <ImageWithFallback
            src={service.image}
            alt={service.name}
            style={styles.coverImage}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Conteúdo do Serviço */}
        <View style={styles.contentContainer}>
          {/* Cabeçalho: Título e Preço */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{service.name}</Text>
            <Text style={styles.price}>{service.price}</Text>
          </View>

          {/* Avaliação */}
          <View style={styles.ratingRow}>
            <Star size={16} color="#eab308" fill="#eab308" />
            <Text style={styles.ratingText}>
              <Text style={styles.ratingNumber}>{service.rating}</Text> •{" "}
              {service.reviews} avaliações
            </Text>
          </View>

          {/* Cards de Estatísticas */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Clock size={20} color="#2563eb" style={styles.statIcon} />
              <Text style={styles.statText}>Resposta em{"\n"}30min</Text>
            </View>
            <View style={styles.statCard}>
              <Users size={20} color="#2563eb" style={styles.statIcon} />
              <Text style={styles.statText}>500+ clientes</Text>
            </View>
            <View style={styles.statCard}>
              <CheckCircle size={20} color="#2563eb" style={styles.statIcon} />
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
              {service.features.map((feature: string, index: number) => (
                <View key={index} style={styles.featureItem}>
                  <CheckCircle size={20} color="#22c55e" />
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
            <Text style={styles.ctaButtonText}>Solicitar Serviço</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default function ServiceDetailPage() {
  if (Platform.OS === "web") {
    return <WebServiceDetail />;
  }

  return <NativeServiceDetailScreen />;
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
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2563eb",
    marginTop: 2,
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
