import { useRouter } from "expo-router";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";

// Importa os nossos contextos globais!
import { useTickets } from "../hooks/TicketContext";
import { useUser } from "../hooks/UserContext";

export function NewTicket() {
  const router = useRouter();
  
  // Traz a função de adicionar ticket e os dados do usuário logado
  const { addTicket } = useTickets();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Média");
  const [description, setDescription] = useState("");

  const [showCategories, setShowCategories] = useState(false);

  const CATEGORIES = [
    "Hardware",
    "Software",
    "Rede",
    "Infraestrutura",
    "Backup",
    "E-mail",
    "Acesso",
  ];
  
  const PRIORITIES = ["Baixa", "Média", "Alta", "Crítica"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento padrão da página na web

    if (!title || !category || !description) return;

    // Salva o ticket globalmente na memória do app
    addTicket({
      title,
      category,
      priority: priority as any,
      description,
      requester: user.name, // Puxa dinamicamente
    });

    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Novo Ticket</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        
        {/* Título */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Título do Problema
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Impressora sem tinta"
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Categoria */}
        <div className="space-y-1.5 relative">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Categoria
          </label>
          <button
            type="button"
            onClick={() => setShowCategories(!showCategories)}
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <span className={category ? "text-gray-900" : "text-gray-400"}>
              {category || "Selecione uma categoria"}
            </span>
            <ChevronDown size={18} className="text-gray-400" />
          </button>

          {showCategories && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden z-20">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setShowCategories(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                    category === cat
                      ? "text-blue-600 font-semibold bg-blue-50/50"
                      : "text-gray-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Prioridade */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Prioridade
          </label>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  priority === p
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Descrição Detalhada
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o problema com o máximo de detalhes possível..."
            rows={5}
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!title || !category || !description}
          className="w-full bg-blue-600 text-white font-semibold text-sm py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 active:bg-blue-800 transition-colors mt-8"
        >
          Abrir Ticket
        </button>
      </form>
    </div>
  );
}