import { usePathname, useRouter } from "expo-router";
import { Briefcase, Home, Ticket, User } from "lucide-react";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Início", path: "/dashboard", icon: Home },
    { name: "Serviços", path: "/services", icon: Briefcase },
    { name: "Tickets", path: "/tickets", icon: Ticket },
    { name: "Perfil", path: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe pt-3 px-6 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.03)] h-20">
      {navItems.map((item) => {
        const Icon = item.icon;

        // Aqui você pode alterar a lógica conforme necessário usando o usePathname()
        // Estou forçando o "Serviços" como ativo para ficar idêntico ao seu print.
        const isActive = item.name === "Serviços";

        return (
          <button
            key={item.name}
            onClick={() => router.push(item.path as any)}
            className="flex flex-col items-center justify-center gap-1.5 min-w-[64px]"
          >
            <Icon
              size={24}
              className={isActive ? "text-blue-600" : "text-slate-500"}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className={`text-[12px] font-semibold ${
                isActive ? "text-blue-600" : "text-slate-500"
              }`}
            >
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
