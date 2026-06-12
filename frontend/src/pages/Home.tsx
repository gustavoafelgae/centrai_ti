// app/home.tsx
import { useRouter, usePathname } from "expo-router";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTickets } from "../hooks/context/TicketContext";
import { useUser } from "../hooks/context/UserContext";
import { useServicos } from "../hooks/useLists";
import { useState, useEffect } from "react";
import { BottomNav } from '../components/BottomNav';

// Mapeamento de cores
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

export default function Home() {
  const router = useRouter();
  const { user, logout } = useUser();
  const pathname = usePathname();
  const { tickets } = useTickets();
  const { servicos, loading: loadingServicos, error, recarregar } = useServicos();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user]);

  const recentTickets = tickets.slice(0, 3);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Crítica': return { bg: '#fee2e2', text: '#ef4444' };
      case 'Alta': return { bg: '#ffedd5', text: '#f97316' };
      case 'Média': return { bg: '#fef9c3', text: '#eab308' };
      default: return { bg: '#dcfce7', text: '#22c55e' };
    }
  };

  // Logout
  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    router.replace('/');
  };

  // Loading
  if (loadingServicos) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  // Erro
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Erro ao carregar</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={recarregar}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              Olá, {user?.nome?.split(' ')[0] || "Usuário"}
            </Text>
            <Text style={styles.subtitle}>O que você precisa hoje?</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications" size={20} color="#ffffff" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}
              onPress={() => setShowProfileMenu(!showProfileMenu)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.nome?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ... dropdown com ícones corrigidos ... */}
        <View style={styles.dropdownActions}>
          <TouchableOpacity
            style={[styles.dropdownAction, styles.logoutAction]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#f81414d5" />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Banner */}
        {user?.idCargo !== 5 && (
          <TouchableOpacity
            style={styles.analystBanner}
            onPress={() => router.push("/analyst" as any)}  // ← ADICIONE ESTA LINHA
            activeOpacity={0.7}
          >
            <View style={styles.analystBannerLeft}>
              <View style={styles.analystIcon}>
                <MaterialCommunityIcons name="view-dashboard" size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.analystTitle}>Console do Analista</Text>
                <Text style={styles.analystSubtitle}>Gerenciar fila de chamados</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}

        {/* Serviços */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Serviços</Text>
          </View>

          {servicos.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="apps-outline" size={32} color="#94a3b8" />
              <Text style={styles.emptyStateText}>Nenhum serviço disponível</Text>
            </View>
          ) : (
            <View style={styles.servicesGrid}>
              {servicos.map((service) => {
                const colorHex = getColorHex(service.color);
                const iconName = (service.icon as string) || "apps-outline";
                return (
                  <TouchableOpacity
                    key={service.id}
                    style={styles.serviceCard}
                    activeOpacity={0.7}
                    onPress={() => router.push({
                      pathname: '/tickets/new',
                      params: { servicoId: service.id }
                    } as any)}
                  >
                    <View style={[styles.serviceIcon, { backgroundColor: `${colorHex}18` }]}>
                      <Ionicons
                        name={iconName as any}
                        size={24}
                        color={colorHex}
                      />
                    </View>
                    <Text style={styles.serviceName} numberOfLines={2}>
                      {service.name || service.name || 'Serviço'}
                    </Text>
                    {service.description && (
                      <Text style={styles.serviceDescription} numberOfLines={2}>
                        {service.description}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

// ========== ESTILOS ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Header
  header: {
    backgroundColor: "#2563eb",
    paddingTop: Platform.OS === "ios" ? 60 : 60,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 14,
    color: "#dbeafe",
    marginTop: 4,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },

  // Dropdown
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -500,
    zIndex: 100,
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dropdownContent: {
    position: 'absolute',
    top: Platform.OS === "ios" ? 120 : 90,
    right: 20,
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  dropdownAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  dropdownUserInfo: {
    flex: 1,
  },
  dropdownUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  dropdownUserEmail: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  dropdownSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  dropdownInfo: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  planBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  dropdownActions: {
    padding: 8,
  },
  dropdownAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  dropdownActionText: {
    fontSize: 15,
    color: '#c6c4c4',
    fontWeight: '500',
  },
  logoutAction: {
    marginTop: 4,
  },
  logoutText: {
    fontSize: 15,
    color: '#ef4444',
    fontWeight: '500',
  },

  // Conteúdo
  content: {
    padding: 20,
    paddingBottom: 100,
  },

  // Banner Analista
  analystBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  analystBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  analystIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analystTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  analystSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },

  // Seções
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },

  // Grid de Serviços
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  serviceCard: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    lineHeight: 20,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 16,
  },

  // Tickets
  ticketsList: {
    gap: 12,
  },
  ticketCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 1,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
    marginRight: 12,
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketId: {
    fontSize: 13,
    fontWeight: "600",
    color: "#60a5fa",
  },
  ticketBadges: {
    flexDirection: "row",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadge: {
    backgroundColor: '#f1f5f9',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // Empty State
  emptyState: {
    padding: 32,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderStyle: "dashed",
    gap: 8,
  },
  emptyStateText: {
    color: "#94a3b8",
    fontSize: 14,
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingVertical: Platform.OS === "ios" ? 20 : 10,
    paddingHorizontal: 10,
    paddingBottom: 50,
    justifyContent: "space-around",
    elevation: 50,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
    paddingVertical: 4,
  },
  navText: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  navTextActive: {
    color: "#2563eb",
  },
});