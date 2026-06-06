import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  ArrowLeft, 
  Clock, 
  Cloud, 
  HardDrive, 
  Server, 
  Shield, 
  ShieldCheck 
} from "lucide-react-native";
import { 
  Platform, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from "react-native";

// Importa a versão Web correspondente do seu projeto
import WebServiceDetail from "../../pages/ServiceDetail";
// Banco de dados local com as opções de serviço do seu sistema
const SERVICES_DATA: Record<
  string, 
  { name: string; description: string; icon: any; color: string; sla: string; department: string }
> = {
  "1": {
    name: "Manutenção de Servidor",
    description: "Suporte especializado para toda a infraestrutura de servidores locais e virtuais. Inclui atualizações de sistema, patches de segurança, monitoramento de recursos, correção de falhas críticas de hardware e otimização de performance.",
    icon: Server,
    color: "#a855f7", // Roxo
    sla: "Até 2h (Incidentes Críticos)",
    department: "Infraestrutura de TI",
  },
  "2": {
    name: "Segurança Cibernética",
    description: "Análise proativa de vulnerabilidades, gerenciamento de firewalls, bloqueio de acessos suspeitos e auditoria de credenciais. Atendimento imediato em caso de suspeita de invasão ou vazamento de dados corporativos.",
    icon: Shield,
    color: "#3b82f6", // Azul
    sla: "Imediato (Alta Prioridade)",
    department: "Segurança da Informação",
  },
  "3": {
    name: "Cloud Computing",
    description: "Configuração, gerenciamento e provisionamento de ambientes em nuvem (AWS, Azure e Google Cloud). Suporte para escalabilidade de instâncias, criação de VPCs e manutenção preventiva de serviços integrados.",
    icon: Cloud,
    color: "#06b6d4", // Ciano
    sla: "Até 4h úteis",
    department: "Arquitetura Cloud",
  },
  "4": {
    name: "Backup & Recovery",
    description: "Monitoramento e auditoria das rotinas automáticas de backups noturnos. Suporte completo para recuperação emergencial de arquivos perdidos, restauração de bancos de dados corrompidos e testes de integridade.",
    icon: HardDrive,
    color: "#22c55e", // Verde
    sla: "Até 1h (Solicitações de Restauração)",
    department: "Data Management",
  },
};

function NativeServiceDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Garante que o ID capturado seja uma string simples
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const currentId = rawId ? String(rawId) : "1";

  // Busca o serviço correspondente ou usa o 1 como fallback de segurança
  const service = SERVICES_DATA[currentId] || SERVICES_DATA["1"];
  const IconComponent = service.icon;

  const handleRequestService = () => {
    // Redireciona para a nova tela de ticket enviando o nome do serviço por parâmetro
    router.push({
      pathname: "/tickets/new-service",
      params: { serviceName: service.name }
    } as any);
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Serviço</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Bloco de Apresentação */}
        <View style={styles.presentationCard}>
          <View style={[styles.iconBox, { backgroundColor: `${service.color}15` }]}>
            <IconComponent size={36} color={service.color} />
          </View>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.departmentText}>{service.department}</Text>
          
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Disponível / Ativo</Text>
          </View>
        </View>

        {/* Informações Detalhadas */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Descrição do Serviço</Text>
          <View style={styles.detailsCard}>
            <Text style={styles.descriptionText}>{service.description}</Text>
          </View>
        </View>

        {/* SLA e Prazos */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Acordo de Nível de Serviço (SLA)</Text>
          <View style={styles.slaCard}>
            <View style={styles.slaRow}>
              <Clock size={20} color="#64748b" />
              <View style={styles.slaTextGroup}>
                <Text style={styles.slaLabel}>Tempo Estimado de Resolução</Text>
                <Text style={styles.slaValue}>{service.sla}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.slaRow}>
              <ShieldCheck size={20} color="#22c55e" />
              <View style={styles.slaTextGroup}>
                <Text style={styles.slaLabel}>Disponibilidade do Suporte</Text>
                <Text style={styles.slaValue}>24h por dia, 7 dias por semana</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Rodapé Fixo com o Botão de Solicitação */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.requestButton} 
          activeOpacity={0.8}
          onPress={handleRequestService}
        >
          <Text style={styles.requestButtonText}>Solicitar este Serviço</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ServiceDetailPage() {
  // Mantém a separação da arquitetura Web/Mobile do seu projeto
  if (Platform.OS === "web") {
    return <WebServiceDetail />;
  }

  return <NativeServiceDetailScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  presentationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 24,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 4,
  },
  departmentText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22c55e",
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#16a34a",
    fontWeight: "600",
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 10,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  descriptionText: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 24,
  },
  slaCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    gap: 14,
  },
  slaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  slaTextGroup: {
    marginLeft: 14,
    flex: 1,
  },
  slaLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 2,
  },
  slaValue: {
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginLeft: 34,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  requestButton: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  requestButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});