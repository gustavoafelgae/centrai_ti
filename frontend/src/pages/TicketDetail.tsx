import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Paperclip, Send } from "lucide-react";
import { useState } from "react";

export function TicketDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState("");

  const ticket = {
    id: Number(id),
    title: "Lentidão no sistema ERP",
    status: "Em andamento",
    priority: "Alta",
    category: "Performance",
    createdAt: "19/03/2026 10:30",
    assignedTo: "Carlos Silva",
    description:
      "O sistema ERP está apresentando lentidão significativa ao carregar relatórios de vendas. O problema começou hoje pela manhã e está afetando toda a equipe comercial.",
  };

  const messages = [
    {
      id: 1,
      sender: "Você",
      text: "O sistema ERP está apresentando lentidão significativa ao carregar relatórios de vendas.",
      time: "10:30",
      isOwn: true,
    },
    {
      id: 2,
      sender: "Carlos Silva",
      text: "Obrigado pelo relato. Vou verificar os logs do servidor agora mesmo.",
      time: "10:45",
      isOwn: false,
    },
    {
      id: 3,
      sender: "Carlos Silva",
      text: "Identifiquei o problema. Estamos com alto uso de CPU no servidor de banco de dados. Já estou otimizando as consultas.",
      time: "11:20",
      isOwn: false,
    },
    {
      id: 4,
      sender: "Você",
      text: "Ótimo! Quanto tempo deve levar para resolver?",
      time: "11:25",
      isOwn: true,
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Add message logic here
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={() => router.push("/tickets")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg truncate">Ticket #{ticket.id}</h1>
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

        {/* Ticket Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h2 className="mb-2">{ticket.title}</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-yellow-600">{ticket.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Categoria:</span>
              <span>{ticket.category}</span>
            </div>
            <div className="flex justify-between">
              <span>Atribuído a:</span>
              <span>{ticket.assignedTo}</span>
            </div>
            <div className="flex justify-between">
              <span>Criado em:</span>
              <span>{ticket.createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] ${msg.isOwn ? "bg-blue-600 text-white" : "bg-white"} rounded-2xl px-4 py-3 shadow-sm`}
            >
              {!msg.isOwn && (
                <div className="text-xs mb-1 opacity-70">{msg.sender}</div>
              )}
              <div className="text-sm">{msg.text}</div>
              <div
                className={`text-xs mt-1 ${msg.isOwn ? "text-blue-100" : "text-gray-500"}`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex items-end gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip size={24} className="text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Digite sua mensagem..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
          <button
            onClick={handleSend}
            className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!message.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
