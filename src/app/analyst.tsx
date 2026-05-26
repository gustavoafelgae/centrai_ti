import { Platform } from "react-native";
import { NativeRouteFallback } from "../components/NativeRouteFallback";
import { AnalystConsole } from "../pages/AnalystConsole";

export default function AnalystPage() {
  // Na web, mantém o comportamento de exibir o Fallback como um "menu" em volta da página
  if (Platform.OS === "web") {
    return (
      <NativeRouteFallback
        web={<AnalystConsole />}
        title="Painel do Analista"
        description="Acompanhe incidentes e portfólio do TI."
        actions={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Serviços", path: "/services" },
          { label: "Tickets", path: "/tickets" },
        ]}
      />
    );
  }

  // No mobile, ignora o Fallback e renderiza a tela nativa diretamente
  return <AnalystConsole />;
}
