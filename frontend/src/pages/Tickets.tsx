import { useRouter } from "expo-router";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { useState } from "react";
import { BottomNav } from "../components/BottomNav";

export function Tickets() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "open" | "closed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tickets = [
    {
      id: 1,
      title: "Lentidão no sistema ERP",
      status: "Em andamento",
      priority: "Alta",
      time: "2h atrás",
      category: "Performance",
      statusColor: "bg-yellow-100 text-yellow-700",
    },
    {
      id: 2,
      title: "Resetar senha de usuário",
      status: "Aguardando",
      priority: "Baixa",
      time: "4h atrás",
      category: "Acesso",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      id: 3,
      title: "Instalação do Microsoft Office",
      status: "Resolvido",
      priority: "Média",
      time: "1d atrás",
      category: "Software",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      id: 4,
      title: "Problema na conexão VPN",
      status: "Em andamento",
      priority: "Alta",
      time: "3h atrás",
      category: "Rede",
      statusColor: "bg-yellow-100 text-yellow-700",
    },
    {
      id: 5,
      title: "Backup não está funcionando",
      status: "Aguardando",
      priority: "Alta",
      time: "5h atrás",
      category: "Backup",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      id: 6,
      title: "Solicitar novo notebook",
      status: "Resolvido",
      priority: "Média",
      time: "2d atrás",
      category: "Hardware",
      statusColor: "bg-green-100 text-green-700",
    },
  ];

  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === "open" && ticket.status === "Resolvido") return false;
    if (activeTab === "closed" && ticket.status !== "Resolvido") return false;
    if (
      searchQuery &&
      !ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.push("/home")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl">Tickets</h1>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar tickets..."
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveTab("open")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === "open"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Abertos
          </button>
          <button
            onClick={() => setActiveTab("closed")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === "closed"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Fechados
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="px-6 py-6 space-y-3">
        {filteredTickets.map((ticket) => (
          <button
            key={ticket.id}
            onClick={() => router.push(`/tickets/${ticket.id}`)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="mb-1">{ticket.title}</div>
                <div className="text-xs text-gray-500">{ticket.category}</div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  ticket.priority === "Alta"
                    ? "bg-red-100 text-red-700"
                    : ticket.priority === "Média"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {ticket.priority}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-xs px-2 py-1 rounded-full ${ticket.statusColor}`}
              >
                {ticket.status}
              </span>
              <span className="text-xs text-gray-400">{ticket.time}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => router.push("/tickets/new")}
        className="fixed bottom-24 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-20"
      >
        <Plus size={24} />
      </button>

      <BottomNav />
    </div>
  );
}
