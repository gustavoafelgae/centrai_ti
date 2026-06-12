// app/servicos/index.tsx
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useServicos, useCargos } from "@/hooks/useLists";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { BottomNav } from "@/components/BottomNav";

function getColorHex(colorClass: string): string {
  const colorMap: Record<string, string> = {
    'bg-violet-500': '#8b5cf6',
    'bg-purple-500': '#a855f7',
    'bg-blue-500': '#3b82f6',
    'bg-cyan-500': '#06b6d4',
    'bg-green-500': '#22c55e',
    'bg-orange-500': '#f97316',
    'bg-teal-500': '#14b8a6',
    'bg-pink-500': '#ec4899',
    'bg-indigo-500': '#6366f1',
    'bg-red-500': '#ef4444',
    'bg-yellow-500': '#eab308',
  };
  return colorMap[colorClass] || '#6b7280';
}

export default function Services() {
  const router = useRouter();
  const { servicos, loading, error, recarregar } = useServicos();
  const { cargos } = useCargos();

  const cargoMap = new Map(cargos.map(c => [c.id, c.nome]));

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando serviços...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="warning-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={recarregar}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Serviços</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {servicos.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="apps-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>Nenhum serviço disponível</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {servicos.map((service) => {
              const cargoNome = cargoMap.get(service.cargoId) || 'Não definido';

              return (
                <TouchableOpacity
                  key={service.id}
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={() => router.push({
                    pathname: '/tickets/new',
                    params: { servicoId: service.id }
                  } as any)}
                >
                  {/* Linha principal: Ícone + Info */}
                  <View style={styles.cardRow}>
                    {/* Ícone */}
                    <View style={[styles.iconContainer, { backgroundColor: getColorHex(service.color) + '18' }]}>
                      <Ionicons
                        name={service.icon as any}
                        size={28}
                        color={getColorHex(service.color)}
                      />
                    </View>

                    {/* Informações */}
                    <View style={styles.cardInfo}>
                      <Text style={styles.serviceName} numberOfLines={1}>
                        {service.name}
                      </Text>
                      <Text style={styles.serviceDescription} numberOfLines={2}>
                        {service.description}
                      </Text>

                      {/* Cargo + Preço na mesma linha */}
                      <View style={styles.cardFooter}>
                        <View style={styles.cargoBadge}>
                          <Ionicons name="person-outline" size={12} color="#64748b" />
                          <Text style={styles.cargoText} numberOfLines={1}>
                            {cargoNome}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.cardFooter}>
                        {service.price && (
                          <Text style={styles.priceText}>{service.price}</Text>
                        )}
                      </View>
                    </View>

                    {/* Seta */}
                    <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  errorText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    color: '#0f172a',
  },
  // Conteúdo
  content: {
    padding: 16,
    paddingBottom: 150
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  // Lista (1 por linha)
  list: {
    gap: 12,
  },
  // Card horizontal
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  // Ícone
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Informações
  cardInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cargoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cargoText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
    paddingVertical: 7,
  },
});