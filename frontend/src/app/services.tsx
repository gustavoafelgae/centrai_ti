import { useRouter } from "expo-router";
import {
    ArrowLeft,
    Briefcase,
    Cloud,
    Database,
    HardDrive,
    Home,
    Mail,
    Monitor,
    Server,
    ShieldCheck,
    Ticket as TicketIcon,
    User,
    Wifi,
} from "lucide-react-native";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Services } from "../pages/Services";

const servicesList = [
  {
    id: 1,
    title: "Manutenção de Servidor",
    description: "Monitoramento e manutenção de servidores",
    icon: Server,
    color: "#a855f7",
  },
  {
    id: 2,
    title: "Segurança Cibernética",
    description: "Proteção avançada contra ameaças",
    icon: ShieldCheck,
    color: "#3b82f6",
  },
  {
    id: 3,
    title: "Cloud Computing",
    description: "Soluções em nuvem escaláveis",
    icon: Cloud,
    color: "#38bdf8",
  },
  {
    id: 4,
    title: "Backup & Recovery",
    description: "Backup automático e recuperação",
    icon: HardDrive,
    color: "#4ade80",
  },
  {
    id: 5,
    title: "Suporte Técnico",
    description: "Suporte 24/7 para sua empresa",
    icon: Monitor,
    color: "#f97316",
  },
  {
    id: 6,
    title: "Infraestrutura de Rede",
    description: "Configuração e otimização de rede",
    icon: Wifi,
    color: "#ec4899",
  },
  {
    id: 7,
    title: "Gestão de Banco de Dados",
    description: "Administração e otimização de BD",
    icon: Database,
    color: "#6366f1",
  },
  {
    id: 8,
    title: "Email Corporativo",
    description: "Contas de email profissionais",
    icon: Mail,
    color: "#2dd4bf",
  },
];

const navItems = [
  { label: "Início", path: "/home", icon: Home },
  { label: "Serviços", path: "/services", icon: Briefcase },
  { label: "Tickets", path: "/tickets", icon: TicketIcon },
  { label: "Perfil", path: "/profile", icon: User },
];

function NativeServicesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        {/* <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity> */}
        <View>
          <Text style={styles.headerTitle}>Serviços</Text>
          <Text style={styles.headerSubtitle}>
            Explore nossos serviços mais pedidos
          </Text>
        </View>
      </View>

      {/* Lista de Serviços */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {servicesList.map((service) => {
          const Icon = service.icon;
          return (
            <TouchableOpacity
              key={service.id}
              style={styles.card}
              onPress={() => router.push(`/services/${service.id}` as any)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: service.color },
                ]}
              >
                <Icon size={24} color="#ffffff" strokeWidth={2} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{service.title}</Text>
                <Text style={styles.cardDescription}>
                  {service.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Rodapé de Navegação */}
      <View style={styles.navbar}>
        {navItems.map((item) => {
          const Icon = item.icon;
          // Marcando a aba "Serviços" como ativa
          const isActive = item.label === "Serviços";

          return (
            <TouchableOpacity
              key={item.path}
              onPress={() => router.push(item.path as any)}
              style={styles.navButton}
            >
              <Icon
                size={24}
                color={isActive ? "#2563eb" : "#64748b"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text
                style={[
                  styles.navButtonText,
                  isActive && styles.navButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function ServicesPage() {
  if (Platform.OS === "web") {
    return <Services />;
  }

  return <NativeServicesScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1e40af",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e2e8f0",
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  navbar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingVertical: Platform.OS === "ios" ? 20 : 12,
    paddingHorizontal: 8,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
  },
  navButtonText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  navButtonTextActive: {
    color: "#2563eb",
  },
});
