import { useRouter } from "expo-router";
import { Briefcase, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import { BottomNav } from "../components/BottomNav";

// Importa o contexto global para ler os tickets dinâmicos
import { useTickets } from "../hooks/TicketContext";

const services = [
  {
    id: 1,
    name: "Manutenção de Servidor",
    icon: Briefcase,
    color: "bg-violet-500",
  },
  {
    id: 2,
    name: "Segurança Cibernética",
    icon: ShieldCheck,
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Cloud Computing",
    icon: Sparkles,
    color: "bg-cyan-500",
  },
  {
    id: 4,
    name: "Backup & Recovery",
    icon: Ticket,
    color: "bg-green-500",
  },
];

export function Home() {
  const router = useRouter();
  
  // Puxa a lista de tickets viva/dinâmica da memória do aplicativo
  const { tickets } = useTickets();

  // Filtra pegando apenas os 3 primeiros (mais recentes)
  const recentTickets = tickets.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Bem-vindo de volta
            </p>

            <h1 className="text-3xl font-semibold text-gray-900">Serviços</h1>
          </div>

          <button
            onClick={() => router.push("/services")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Ver todos
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {services.slice(0, 4).map((service) => {
            const Icon = service.icon;

            return (
              <button
                key={service.id}
                onClick={() => router.push(`/services/${service.id}`)}
                className="group rounded-3xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md text-left"
              >
                <div
                  className={`w-14 h-14 rounded-3xl flex items-center justify-center ${service.color} text-white mb-4`}
                >
                  <Icon size={22} />
                </div>

                <div className="text-base font-semibold text-gray-900">
                  {service.name}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold text-gray-900">
            Tickets Recentes
          </h2>

          <button
            onClick={() => router.push("/tickets")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Ver todos
          </button>
        </div>

        <div className="space-y-3">
          {recentTickets.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
              Nenhum ticket aberto recentemente.
            </div>
          ) : (
            recentTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => router.push(`/tickets/${ticket.id}`)}
                className="w-full rounded-3xl bg-white p-4 shadow-sm text-left transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {ticket.title}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">{ticket.status}</p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                      ticket.priority === "Crítica"
                        ? "bg-red-100 text-red-700"
                        : ticket.priority === "Alta"
                          ? "bg-orange-100 text-orange-700"
                          : ticket.priority === "Média"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}