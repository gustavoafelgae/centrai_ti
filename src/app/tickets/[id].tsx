import { Text } from "react-native";
import { NativeRouteFallback } from "../../components/NativeRouteFallback";
import { TicketDetail } from "../../pages/TicketDetail";

export default function TicketDetailPage() {
  return (
    <NativeRouteFallback
      web={<TicketDetail />}
      title="Detalhes do Ticket"
      description="Acompanhe o status do seu ticket."
      actions={[
        { label: "Voltar aos tickets", path: "/tickets" },
        { label: "Novo ticket", path: "/tickets/new" },
      ]}
    >
      <Text style={{ color: "#cbd5e1", marginTop: 12 }}>
        Detalhes completos são exibidos na versão web.
      </Text>
    </NativeRouteFallback>
  );
}
