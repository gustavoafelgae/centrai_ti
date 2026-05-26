import { useRouter } from "expo-router";

import { Briefcase, ShieldCheck, Sparkles, Ticket } from "lucide-react";

import { BottomNav } from "../components/BottomNav";

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

const recentTickets = [
  {
    id: "INC-0041",

    title: "Servidor de produção fora do ar",

    status: "Em Andamento",

    priority: "Crítica",
  },

  {
    id: "INC-0040",

    title: "VPN sem acesso para equipe remota",

    status: "Aberto",

    priority: "Alta",
  },

  {
    id: "INC-0039",

    title: "Falha no backup noturno",

    status: "Em Andamento",

    priority: "Alta",
  },
];

export function Dashboard() {
  const router = useRouter();

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
                className="group rounded-3xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
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
          {recentTickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => router.push(`/tickets/${ticket.id}`)}
              className="w-full rounded-3xl bg-white p-4 shadow-sm text-left transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-gray-900">
                    {ticket.title}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">{ticket.status}</p>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    ticket.priority === "Crítica"
                      ? "bg-red-100 text-red-700"
                      : ticket.priority === "Alta"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {ticket.priority}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
