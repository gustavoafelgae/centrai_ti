import { useRouter } from "expo-router";
import {
    ArrowLeft,
    Cloud,
    Database,
    HardDrive,
    Mail,
    Monitor,
    Server,
    Shield,
    Wifi,
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";

export function Services() {
  const router = useRouter();

  const services = [
    {
      id: 1,
      name: "Manutenção de Servidor",
      icon: Server,
      color: "bg-purple-500",
      description: "Monitoramento e manutenção de servidores",
      price: "A partir de R$ 500/mês",
    },
    {
      id: 2,
      name: "Segurança Cibernética",
      icon: Shield,
      color: "bg-blue-500",
      description: "Proteção avançada contra ameaças",
      price: "A partir de R$ 800/mês",
    },
    {
      id: 3,
      name: "Cloud Computing",
      icon: Cloud,
      color: "bg-cyan-500",
      description: "Soluções em nuvem escaláveis",
      price: "A partir de R$ 600/mês",
    },
    {
      id: 4,
      name: "Backup & Recovery",
      icon: HardDrive,
      color: "bg-green-500",
      description: "Backup automático e recuperação",
      price: "A partir de R$ 400/mês",
    },
    {
      id: 5,
      name: "Suporte Técnico",
      icon: Monitor,
      color: "bg-orange-500",
      description: "Suporte 24/7 para sua empresa",
      price: "A partir de R$ 350/mês",
    },
    {
      id: 6,
      name: "Infraestrutura de Rede",
      icon: Wifi,
      color: "bg-pink-500",
      description: "Configuração e otimização de rede",
      price: "A partir de R$ 700/mês",
    },
    {
      id: 7,
      name: "Gestão de Banco de Dados",
      icon: Database,
      color: "bg-indigo-500",
      description: "Administração e otimização de BD",
      price: "A partir de R$ 650/mês",
    },
    {
      id: 8,
      name: "Email Corporativo",
      icon: Mail,
      color: "bg-teal-500",
      description: "Contas de email profissionais",
      price: "A partir de R$ 250/mês",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl">Serviços</h1>
        </div>
      </div>

      {/* Services List */}
      <div className="px-6 py-6 space-y-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => router.push(`/services/${service.id}`)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm text-left hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              <div
                className={`${service.color} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                <service.icon size={28} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-1">{service.name}</div>
                <p className="text-sm text-gray-600 mb-2">
                  {service.description}
                </p>
                <div className="text-sm text-blue-600">{service.price}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
