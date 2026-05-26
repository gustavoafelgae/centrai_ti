import { useRouter } from "expo-router";
import {
    Bell,
    Building,
    ChevronRight,
    HelpCircle,
    LogOut,
    Mail,
    Phone,
    Shield,
    User,
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";

export function Profile() {
  const router = useRouter();

  const user = {
    name: "João Silva",
    email: "joao.silva@empresa.com.br",
    phone: "+55 11 98765-4321",
    company: "Empresa LTDA",
    plan: "Premium",
  };

  const menuItems = [
    { icon: Bell, label: "Notificações", badge: "3" },
    { icon: Shield, label: "Privacidade e Segurança" },
    { icon: HelpCircle, label: "Ajuda e Suporte" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 pt-12 pb-24 rounded-b-3xl">
        <h1 className="text-2xl mb-1">Perfil</h1>
        <p className="text-blue-100">Gerencie suas informações</p>
      </div>

      {/* Profile Card */}
      <div className="px-6 -mt-16">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={40} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl mb-1">{user.name}</h2>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                Plano {user.plan}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={20} className="text-gray-400" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone size={20} className="text-gray-400" />
              <span className="text-sm">{user.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Building size={20} className="text-gray-400" />
              <span className="text-sm">{user.company}</span>
            </div>
          </div>

          <button className="w-full mt-4 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors">
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
            >
              <item.icon size={24} className="text-gray-600" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-6 mt-6">
        <button
          onClick={() => router.push("/")}
          className="w-full flex items-center justify-center gap-2 bg-white text-red-600 py-4 rounded-2xl shadow-sm hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
