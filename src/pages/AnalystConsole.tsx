import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Unificamos as importações para usar lucide-react-native (funciona perfeitamente em Web e Mobile)
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BarChart2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cloud,
  Filter,
  Flame,
  HardDrive,
  LayoutDashboard,
  List,
  RefreshCw,
  Search,
  Server,
  Shield,
  Ticket,
  User,
} from "lucide-react-native";

type Priority = "Crítica" | "Alta" | "Média" | "Baixa";
type Status = "Aberto" | "Em Andamento" | "Aguardando" | "Resolvido";
type Tab = "dashboard" | "incidents";

interface Incident {
  id: string;
  title: string;
  requester: string;
  assignee: string | null;
  priority: Priority;
  status: Status;
  category: string;
  createdAt: string;
  updatedAt: string;
  sla: string;
  slaBreached: boolean;
}

const INCIDENTS: Incident[] = [
  {
    id: "INC-0041",
    title: "Servidor de produção fora do ar",
    requester: "Carlos Menezes",
    assignee: "Ana Souza",
    priority: "Crítica",
    status: "Em Andamento",
    category: "Infraestrutura",
    createdAt: "21/05/2026 08:14",
    updatedAt: "21/05/2026 09:02",
    sla: "2h restantes",
    slaBreached: false,
  },
  {
    id: "INC-0040",
    title: "VPN sem acesso para equipe remota",
    requester: "Beatriz Lima",
    assignee: null,
    priority: "Alta",
    status: "Aberto",
    category: "Rede",
    createdAt: "21/05/2026 07:50",
    updatedAt: "21/05/2026 07:50",
    sla: "30min restantes",
    slaBreached: false,
  },
  {
    id: "INC-0039",
    title: "Falha no backup noturno",
    requester: "TI Automático",
    assignee: "Pedro Alves",
    priority: "Alta",
    status: "Em Andamento",
    category: "Backup",
    createdAt: "21/05/2026 06:00",
    updatedAt: "21/05/2026 08:45",
    sla: "SLA violado",
    slaBreached: true,
  },
  {
    id: "INC-0038",
    title: "Impressora do RH não imprime",
    requester: "Márcia Ferreira",
    assignee: "João Costa",
    priority: "Média",
    status: "Aguardando",
    category: "Hardware",
    createdAt: "20/05/2026 15:30",
    updatedAt: "21/05/2026 08:00",
    sla: "4h restantes",
    slaBreached: false,
  },
  {
    id: "INC-0037",
    title: "E-mail institucional bloqueado",
    requester: "Rafael Nunes",
    assignee: "Ana Souza",
    priority: "Média",
    status: "Em Andamento",
    category: "E-mail",
    createdAt: "20/05/2026 14:10",
    updatedAt: "20/05/2026 17:00",
    sla: "1h restante",
    slaBreached: false,
  },
  {
    id: "INC-0036",
    title: "Software de contabilidade travando",
    requester: "Luciana Dias",
    assignee: null,
    priority: "Baixa",
    status: "Aberto",
    category: "Software",
    createdAt: "20/05/2026 11:20",
    updatedAt: "20/05/2026 11:20",
    sla: "8h restantes",
    slaBreached: false,
  },
  {
    id: "INC-0035",
    title: "Reset de senha — diretoria",
    requester: "Fernanda Castro",
    assignee: "Pedro Alves",
    priority: "Alta",
    status: "Resolvido",
    category: "Acesso",
    createdAt: "20/05/2026 09:00",
    updatedAt: "20/05/2026 09:45",
    sla: "Resolvido",
    slaBreached: false,
  },
  {
    id: "INC-0034",
    title: "Monitor com tela piscando",
    requester: "Thiago Barbosa",
    assignee: "João Costa",
    priority: "Baixa",
    status: "Resolvido",
    category: "Hardware",
    createdAt: "19/05/2026 16:00",
    updatedAt: "20/05/2026 10:30",
    sla: "Resolvido",
    slaBreached: false,
  },
];

const PRIORITY_META: Record<
  Priority,
  { color: string; bg: string; dot: string }
> = {
  Crítica: { color: "text-red-700", bg: "bg-red-100", dot: "bg-red-500" },
  Alta: { color: "text-orange-700", bg: "bg-orange-100", dot: "bg-orange-500" },
  Média: {
    color: "text-yellow-700",
    bg: "bg-yellow-100",
    dot: "bg-yellow-400",
  },
  Baixa: { color: "text-green-700", bg: "bg-green-100", dot: "bg-green-400" },
};

const STATUS_META: Record<Status, { color: string; bg: string }> = {
  Aberto: { color: "text-blue-700", bg: "bg-blue-100" },
  "Em Andamento": { color: "text-purple-700", bg: "bg-purple-100" },
  Aguardando: { color: "text-yellow-700", bg: "bg-yellow-100" },
  Resolvido: { color: "text-gray-600", bg: "bg-gray-100" },
};

const STATUS_FILTERS: (Status | "Todos")[] = [
  "Todos",
  "Aberto",
  "Em Andamento",
  "Aguardando",
  "Resolvido",
];

// Auxiliares de cor para a versão Mobile Nativa
const getNativePriorityStyle = (priority: Priority) => {
  switch (priority) {
    case "Crítica":
      return { bg: "#fee2e2", text: "#ef4444", dot: "#ef4444" };
    case "Alta":
      return { bg: "#ffedd5", text: "#f97316", dot: "#f97316" };
    case "Média":
      return { bg: "#fef9c3", text: "#eab308", dot: "#eab308" };
    case "Baixa":
      return { bg: "#dcfce7", text: "#22c55e", dot: "#22c55e" };
  }
};

const getNativeStatusStyle = (status: Status) => {
  switch (status) {
    case "Aberto":
      return { bg: "#eff6ff", text: "#3b82f6" };
    case "Em Andamento":
      return { bg: "#f3e8ff", text: "#a855f7" };
    case "Aguardando":
      return { bg: "#fef9c3", text: "#eab308" };
    case "Resolvido":
      return { bg: "#f1f5f9", text: "#64748b" };
  }
};

export function AnalystConsole() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<Status | "Todos">("Todos");
  const [activePriority, setActivePriority] = useState<Priority | "Todas">(
    "Todas",
  );
  const [showFilters, setShowFilters] = useState(false);

  const filtered = INCIDENTS.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.requester.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      activeStatus === "Todos" || inc.status === activeStatus;
    const matchesPriority =
      activePriority === "Todas" || inc.priority === activePriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openCount = INCIDENTS.filter((i) => i.status === "Aberto").length;
  const inProgressCount = INCIDENTS.filter(
    (i) => i.status === "Em Andamento",
  ).length;
  const breachedCount = INCIDENTS.filter((i) => i.slaBreached).length;
  const criticalCount = INCIDENTS.filter(
    (i) => i.priority === "Crítica",
  ).length;
  const resolvedCount = INCIDENTS.filter(
    (i) => i.status === "Resolvido",
  ).length;

  const stats = [
    {
      label: "Tickets Abertos",
      value: openCount.toString(),
      icon: Ticket,
      color: "bg-blue-500",
    },
    {
      label: "Urgentes",
      value: criticalCount.toString(),
      icon: AlertCircle,
      color: "bg-red-500",
    },
    {
      label: "Resolvidos",
      value: resolvedCount.toString(),
      icon: CheckCircle2,
      color: "bg-green-500",
    },
    {
      label: "Em Andamento",
      value: inProgressCount.toString(),
      icon: Clock,
      color: "bg-yellow-500",
    },
  ];

  const services = [
    {
      id: 1,
      name: "Manutenção de Servidor",
      icon: Server,
      color: "bg-purple-500",
    },
    {
      id: 2,
      name: "Segurança Cibernética",
      icon: Shield,
      color: "bg-blue-500",
    },
    { id: 3, name: "Cloud Computing", icon: Cloud, color: "bg-cyan-500" },
    {
      id: 4,
      name: "Backup & Recovery",
      icon: HardDrive,
      color: "bg-green-500",
    },
  ];

  const recentTickets = INCIDENTS.slice(0, 3).map((inc) => ({
    id: inc.id,
    title: inc.title,
    status: inc.status,
    priority: inc.priority,
    time: inc.createdAt,
  }));

  // ==============================
  // VERSÃO WEB (HTML + Tailwind)
  // ==============================
  if (Platform.OS === "web") {
    return (
      <div className="min-h-screen bg-gray-950 pb-20">
        <div className="bg-gray-900 border-b border-gray-800 px-4 pt-12 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.push("/services")}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 text-gray-300 active:bg-gray-700"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1">
              <h1 className="text-white text-lg leading-tight">
                Console do Analista
              </h1>
              <p className="text-gray-400 text-xs">
                {activeTab === "dashboard"
                  ? "Visão geral"
                  : "Carteira de incidentes"}
              </p>
            </div>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 text-gray-400 active:bg-gray-700">
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-colors ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab("incidents")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-colors ${
                activeTab === "incidents"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              <List size={16} /> Incidentes
            </button>
          </div>

          {activeTab === "incidents" && (
            <>
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-gray-800 rounded-xl p-3 text-center">
                  <div className="text-blue-400 text-xl font-bold leading-tight">
                    {openCount}
                  </div>
                  <div className="text-gray-400 text-[10px] mt-0.5 leading-tight">
                    Abertos
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-3 text-center">
                  <div className="text-purple-400 text-xl font-bold leading-tight">
                    {inProgressCount}
                  </div>
                  <div className="text-gray-400 text-[10px] mt-0.5 leading-tight">
                    Andamento
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-3 text-center">
                  <div className="text-red-400 text-xl font-bold leading-tight">
                    {criticalCount}
                  </div>
                  <div className="text-gray-400 text-[10px] mt-0.5 leading-tight">
                    Críticos
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-3 text-center">
                  <div
                    className={`text-xl font-bold leading-tight ${breachedCount > 0 ? "text-red-500" : "text-green-400"}`}
                  >
                    {breachedCount}
                  </div>
                  <div className="text-gray-400 text-[10px] mt-0.5 leading-tight">
                    SLA viol.
                  </div>
                </div>
              </div>

              <div className="relative mb-3">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Buscar por ID, título ou solicitante..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-800 text-gray-200 placeholder-gray-500 text-sm pl-9 pr-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${showFilters ? "text-blue-400" : "text-gray-500"}`}
                >
                  <Filter size={15} />
                </button>
              </div>

              {showFilters && (
                <div className="mb-2">
                  <p className="text-gray-500 text-xs mb-1.5">Prioridade</p>
                  <div className="flex gap-2 flex-wrap">
                    {(
                      ["Todas", "Crítica", "Alta", "Média", "Baixa"] as const
                    ).map((p) => (
                      <button
                        key={p}
                        onClick={() => setActivePriority(p)}
                        className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                          activePriority === p
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-700 text-gray-400"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {STATUS_FILTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveStatus(s)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors ${
                      activeStatus === s
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {activeTab === "dashboard" ? (
          <div className="px-4 pt-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-4"
                >
                  <div
                    className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-2`}
                  >
                    <stat.icon size={20} className="text-white" />
                  </div>
                  <div className="text-white text-2xl mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-lg">Serviços</h2>
                <button
                  onClick={() => router.push("/services")}
                  className="text-blue-400 text-sm"
                >
                  Ver todos
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => router.push(`/services/${service.id}`)}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-left active:border-blue-600 transition-colors"
                  >
                    <div
                      className={`${service.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}
                    >
                      <service.icon size={24} className="text-white" />
                    </div>
                    <div className="text-sm text-gray-200">{service.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-lg">Tickets Recentes</h2>
                <button
                  onClick={() => setActiveTab("incidents")}
                  className="text-blue-400 text-sm"
                >
                  Ver todos
                </button>
              </div>
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-left active:border-blue-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm text-white">{ticket.title}</div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          ticket.priority === "Crítica"
                            ? "bg-red-950 text-red-400 border border-red-800"
                            : ticket.priority === "Alta"
                              ? "bg-orange-950 text-orange-400 border border-orange-800"
                              : ticket.priority === "Média"
                                ? "bg-yellow-950 text-yellow-400 border border-yellow-800"
                                : "bg-green-950 text-green-400 border border-green-800"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {ticket.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {ticket.time}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="px-4 pt-4 space-y-3">
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-600 text-sm">
                  Nenhum incidente encontrado.
                </div>
              )}
              {filtered.map((inc) => {
                const pm = PRIORITY_META[inc.priority];
                const sm = STATUS_META[inc.status];
                return (
                  <button
                    key={inc.id}
                    onClick={() => router.push(`/tickets/${inc.id}`)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-left active:border-blue-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {inc.slaBreached && (
                          <Flame
                            size={14}
                            className="text-red-500 flex-shrink-0"
                          />
                        )}
                        {inc.priority === "Crítica" && !inc.slaBreached && (
                          <AlertTriangle
                            size={14}
                            className="text-red-400 flex-shrink-0"
                          />
                        )}
                        <span className="text-white text-sm font-medium leading-snug truncate">
                          {inc.title}
                        </span>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-600 flex-shrink-0 mt-0.5"
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-blue-400 text-xs font-mono">
                        {inc.id}
                      </span>
                      <span className="text-gray-600 text-xs">·</span>
                      <span className="text-gray-500 text-xs">
                        {inc.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${pm.bg} ${pm.color}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${pm.dot}`}
                        />
                        {inc.priority}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${sm.bg} ${sm.color}`}
                      >
                        {inc.status}
                      </span>
                      {inc.slaBreached && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800">
                          SLA violado
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-gray-600" />
                        <span className="text-gray-500 text-xs">
                          {inc.assignee ?? (
                            <span className="text-orange-400">
                              Não atribuído
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock
                          size={12}
                          className={
                            inc.slaBreached ? "text-red-500" : "text-gray-600"
                          }
                        />
                        <span
                          className={`text-xs ${inc.slaBreached ? "text-red-400" : "text-gray-500"}`}
                        >
                          {inc.sla}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-4 pt-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                  <BarChart2 size={16} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-white text-sm">
                    {filtered.length} de {INCIDENTS.length} incidentes
                  </div>
                  <div className="text-gray-500 text-xs">
                    {INCIDENTS.filter((i) => i.status === "Resolvido").length}{" "}
                    resolvidos hoje
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

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
            <ArrowLeft size={20} color="#94a3b8" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Console do Analista</Text>
            <Text style={styles.subtitle}>Carteira de incidentes</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <RefreshCw size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Cards de Métricas */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: "#60a5fa" }]}>
              {openCount}
            </Text>
            <Text style={styles.metricLabel}>Abertos</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: "#c084fc" }]}>
              {inProgressCount}
            </Text>
            <Text style={styles.metricLabel}>Andamento</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: "#f87171" }]}>
              {criticalCount}
            </Text>
            <Text style={styles.metricLabel}>Críticos</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: "#f87171" }]}>
              {breachedCount}
            </Text>
            <Text style={styles.metricLabel}>SLA viol.</Text>
          </View>
        </View>

        {/* Barra de Pesquisa */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por ID, título ou solicitante..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity>
            <Filter size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Filtros de Status */}
        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {STATUS_FILTERS.map((s) => {
              const isActive = activeStatus === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.filterChip,
                    isActive && styles.filterChipActive,
                  ]}
                  onPress={() => setActiveStatus(s)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      isActive && styles.filterTextActive,
                    ]}
                  >
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
        {filtered.map((inc) => {
          const pStyle = getNativePriorityStyle(inc.priority);
          const sStyle = getNativeStatusStyle(inc.status);

          return (
            <TouchableOpacity
              key={inc.id}
              style={styles.incidentCard}
              activeOpacity={0.7}
            >
              {/* Título */}
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleArea}>
                  {inc.slaBreached ? (
                    <Flame size={16} color="#ef4444" style={styles.alertIcon} />
                  ) : inc.priority === "Crítica" ? (
                    <AlertTriangle
                      size={16}
                      color="#ef4444"
                      style={styles.alertIcon}
                    />
                  ) : null}
                  <Text style={styles.incidentTitle} numberOfLines={1}>
                    {inc.title}
                  </Text>
                </View>
                <ChevronRight size={18} color="#475569" />
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
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: pStyle.dot },
                    ]}
                  />
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
                    <Text style={[styles.badgeText, { color: "#ef4444" }]}>
                      SLA violado
                    </Text>
                  </View>
                )}
              </View>

              {/* Rodapé do Card */}
              <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                  <User size={14} color="#64748b" />
                  <Text
                    style={[
                      styles.footerText,
                      !inc.assignee && { color: "#f97316" },
                    ]}
                  >
                    {inc.assignee ?? "Não atribuído"}
                  </Text>
                </View>
                <View style={styles.footerItem}>
                  <Clock
                    size={14}
                    color={inc.slaBreached ? "#ef4444" : "#64748b"}
                  />
                  <Text
                    style={[
                      styles.footerText,
                      inc.slaBreached && { color: "#ef4444" },
                    ]}
                  >
                    {inc.sla}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// Estilos Mobile
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    backgroundColor: "#111827",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitles: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
  },
  subtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#f8fafc",
    fontSize: 14,
  },
  filtersWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    paddingBottom: 12,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: "#3b82f6",
  },
  filterText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#ffffff",
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  incidentCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitleArea: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 16,
  },
  alertIcon: {
    marginRight: 8,
  },
  incidentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#f8fafc",
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  incidentId: {
    fontSize: 13,
    color: "#60a5fa",
    fontWeight: "600",
  },
  metaDot: {
    color: "#475569",
    fontSize: 13,
  },
  incidentCategory: {
    fontSize: 13,
    color: "#64748b",
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "700",
  },
  badgeSlaViolated: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    paddingTop: 12,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
});
