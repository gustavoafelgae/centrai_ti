import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTickets } from '../hooks/TicketContext';

type Priority = 'Crítica' | 'Alta' | 'Média' | 'Baixa';
type Status = 'Aberto' | 'Em Andamento' | 'Aguardando' | 'Resolvido';
type Tab = 'dashboard' | 'incidents';

const STATUS_FILTERS: (Status | 'Todos')[] = [
  'Todos',
  'Aberto',
  'Em Andamento',
  'Aguardando',
  'Resolvido',
];

const getNativePriorityStyle = (priority: Priority) => {
  switch (priority) {
    case 'Crítica':
      return { bg: '#fee2e2', text: '#ef4444', dot: '#ef4444' };
    case 'Alta':
      return { bg: '#ffedd5', text: '#f97316', dot: '#f97316' };
    case 'Média':
      return { bg: '#fef9c3', text: '#eab308', dot: '#eab308' };
    case 'Baixa':
      return { bg: '#dcfce7', text: '#22c55e', dot: '#22c55e' };
  }
};

const getNativeStatusStyle = (status: Status) => {
  switch (status) {
    case 'Aberto':
      return { bg: '#eff6ff', text: '#3b82f6' };
    case 'Em Andamento':
      return { bg: '#f3e8ff', text: '#a855f7' };
    case 'Aguardando':
      return { bg: '#fef9c3', text: '#eab308' };
    case 'Resolvido':
      return { bg: '#f1f5f9', text: '#64748b' };
  }
};

export function AnalystConsole() {
  const router = useRouter();
  const { tickets } = useTickets();

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState<Status | 'Todos'>('Todos');
  const [activePriority, setActivePriority] = useState<Priority | 'Todas'>('Todas');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = tickets.filter(inc => {
    const matchesSearch =
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.requester.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = activeStatus === 'Todos' || inc.status === activeStatus;
    const matchesPriority = activePriority === 'Todas' || inc.priority === activePriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openCount = tickets.filter(i => i.status === 'Aberto').length;
  const inProgressCount = tickets.filter(i => i.status === 'Em Andamento').length;
  const breachedCount = tickets.filter(i => i.slaBreached).length;
  const criticalCount = tickets.filter(i => i.priority === 'Crítica').length;

  // ==============================
  // VERSÃO MOBILE (React Native)
  // ==============================
  return (
    <View style={styles.container}>
      {/* Cabeçalho Fixo */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Console do Analista</Text>
            <Text style={styles.subtitle}>Carteira de incidentes</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="refresh" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Cards de Métricas */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#60a5fa' }]}>
              {openCount}
            </Text>
            <Text style={styles.metricLabel}>Abertos</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#c084fc' }]}>
              {inProgressCount}
            </Text>
            <Text style={styles.metricLabel}>Andamento</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#f87171' }]}>
              {criticalCount}
            </Text>
            <Text style={styles.metricLabel}>Críticos</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#f87171' }]}>
              {breachedCount}
            </Text>
            <Text style={styles.metricLabel}>SLA viol.</Text>
          </View>
        </View>

        {/* Barra de Pesquisa */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por ID, título ou solicitante..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <Ionicons
              name="filter"
              size={18}
              color={showFilters ? '#3b82f6' : '#64748b'}
            />
          </TouchableOpacity>
        </View>

        {/* Filtros de Prioridade */}
        {showFilters && (
          <View style={styles.priorityFiltersWrapper}>
            <Text style={styles.priorityFilterLabel}>Prioridade</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
            >
              {(['Todas', 'Crítica', 'Alta', 'Média', 'Baixa'] as const).map(p => {
                const isActive = activePriority === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                    onPress={() => setActivePriority(p)}
                  >
                    <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Filtros de Status */}
        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {STATUS_FILTERS.map(s => {
              const isActive = activeStatus === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setActiveStatus(s)}
                >
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Lista de Incidentes */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={32} color="#64748b" />
            <Text style={styles.emptyText}>Nenhum incidente encontrado.</Text>
          </View>
        )}

        {filtered.map(inc => {
          const pStyle = getNativePriorityStyle(inc.priority);
          const sStyle = getNativeStatusStyle(inc.status);

          return (
            <TouchableOpacity
              key={inc.id}
              style={styles.incidentCard}
              activeOpacity={0.7}
              onPress={() => router.push(`/tickets/${inc.id}` as any)}
            >
              {/* Título */}
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleArea}>
                  {inc.slaBreached ? (
                    <Ionicons name="flame" size={16} color="#ef4444" style={styles.alertIcon} />
                  ) : inc.priority === 'Crítica' ? (
                    <Ionicons name="warning" size={16} color="#ef4444" style={styles.alertIcon} />
                  ) : null}
                  <Text style={styles.incidentTitle} numberOfLines={1}>
                    {inc.title}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#475569" />
              </View>

              {/* ID e Categoria */}
              <View style={styles.metaRow}>
                <Text style={styles.incidentId}>{inc.id}</Text>
                <Text style={styles.metaDot}> · </Text>
                <Text style={styles.incidentCategory}>{inc.category}</Text>
              </View>

              {/* Badges */}
              <View style={styles.badgesRow}>
                <View style={[styles.badge, { backgroundColor: pStyle.bg }]}>
                  <View style={[styles.priorityDot, { backgroundColor: pStyle.dot }]} />
                  <Text style={[styles.badgeText, { color: pStyle.text }]}>
                    {inc.priority}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: sStyle.bg }]}>
                  <Text style={[styles.badgeText, { color: sStyle.text }]}>
                    {inc.status}
                  </Text>
                </View>
                {inc.slaBreached && (
                  <View style={[styles.badge, styles.badgeSlaViolated]}>
                    <Text style={[styles.badgeText, { color: '#ef4444' }]}>
                      SLA violado
                    </Text>
                  </View>
                )}
              </View>

              {/* Rodapé */}
              <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                  <Ionicons name="person" size={14} color="#64748b" />
                  <Text style={[styles.footerText, !inc.assignee && { color: '#f97316' }]}>
                    {inc.assignee ?? 'Não atribuído'}
                  </Text>
                </View>
                <View style={styles.footerItem}>
                  <Ionicons
                    name="time"
                    size={14}
                    color={inc.slaBreached ? '#ef4444' : '#64748b'}
                  />
                  <Text style={[styles.footerText, inc.slaBreached && { color: '#ef4444' }]}>
                    {inc.sla}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Resumo final */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons name="chart-bar" size={16} color="#60a5fa" />
            <View>
              <Text style={styles.summaryText}>
                {filtered.length} de {tickets.length} incidentes
              </Text>
              <Text style={styles.summarySubtext}>
                {tickets.filter(i => i.status === 'Resolvido').length} resolvidos hoje
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Estilos Mobile
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitles: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    fontSize: 14,
  },
  filtersWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    paddingBottom: 12,
  },
  priorityFiltersWrapper: {
    paddingBottom: 16,
  },
  priorityFilterLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    gap: 8,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
  incidentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 16,
  },
  alertIcon: {
    marginRight: 8,
  },
  incidentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  incidentId: {
    fontSize: 13,
    color: '#60a5fa',
    fontWeight: '600',
  },
  metaDot: {
    color: '#475569',
    fontSize: 13,
  },
  incidentCategory: {
    fontSize: 13,
    color: '#64748b',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeSlaViolated: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ffffff',
    paddingTop: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  summarySubtext: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
});