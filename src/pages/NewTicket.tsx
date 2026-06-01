import { useRouter } from 'expo-router';
import { ArrowLeft, Paperclip } from 'lucide-react';
import { useState } from 'react';

export function NewTicket() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'Média',
    description: '',
  });

  const categories = [
    'Performance',
    'Acesso',
    'Software',
    'Hardware',
    'Rede',
    'Backup',
    'Email',
    'Outro',
  ];

  const priorities = ['Baixa', 'Média', 'Alta'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    router.push('/tickets');
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white px-6 py-4 border-b sticky top-0 z-10'>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => router.push('/tickets')}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className='text-xl'>Novo Ticket</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className='px-6 py-6'>
        <div className='bg-white rounded-2xl p-6 shadow-sm space-y-6'>
          {/* Title */}
          <div>
            <label className='block text-sm mb-2'>Título</label>
            <input
              type='text'
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Descreva o problema brevemente'
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className='block text-sm mb-2'>Categoria</label>
            <select
              value={formData.category}
              onChange={e =>
                setFormData({ ...formData, category: e.target.value })
              }
              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            >
              <option value=''>Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className='block text-sm mb-2'>Prioridade</label>
            <div className='flex gap-2'>
              {priorities.map(priority => (
                <button
                  key={priority}
                  type='button'
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    formData.priority === priority
                      ? priority === 'Alta'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : priority === 'Média'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-500 bg-gray-50 text-gray-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm mb-2'>Descrição</label>
            <textarea
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
              rows={6}
              placeholder='Descreva o problema em detalhes...'
              required
            />
          </div>

          {/* Attachment */}
          <div>
            <label className='block text-sm mb-2'>Anexos (opcional)</label>
            <button
              type='button'
              className='w-full border-2 border-dashed border-gray-300 rounded-xl py-8 hover:bg-gray-50 transition-colors'
            >
              <Paperclip className='mx-auto mb-2 text-gray-400' size={24} />
              <div className='text-sm text-gray-600'>
                Clique para anexar arquivos
              </div>
              <div className='text-xs text-gray-400 mt-1'>Máximo 10MB</div>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-4 rounded-xl mt-6 hover:bg-blue-700 transition-colors'
        >
          Criar Ticket
        </button>
      </form>
    </div>
  );
}
