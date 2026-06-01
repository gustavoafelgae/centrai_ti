import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, Paperclip } from 'lucide-react-native';
import { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// Mantém a importação da sua página Web original
import { NewTicket as WebNewTicket } from '../../pages/NewTicket';

function NativeNewTicketScreen() {
  const router = useRouter();

  // Estados para capturar os dados do formulário criados pelo botão de enviar
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Média');
  const [description, setDescription] = useState('');

  // Função disparada ao clicar no botão "Criar Ticket"
  const handleSubmit = () => {
    console.log('Enviando Incidente:', {
      title,
      category,
      priority,
      description,
    });

    // Após salvar, redireciona o usuário de volta para a listagem
    router.push('/tickets' as any);
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color='#0f172a' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Ticket</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.card}>
          {/* Campo: Título */}
          <View style={styles.field}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              placeholder='Descreva o problema brevemente'
              placeholderTextColor='#94a3b8'
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Campo: Categoria */}
          <View style={styles.field}>
            <Text style={styles.label}>Categoria</Text>
            <TouchableOpacity style={styles.dropdown} activeOpacity={0.7}>
              <Text
                style={[styles.dropdownText, !category && { color: '#94a3b8' }]}
              >
                {category || 'Selecione uma categoria'}
              </Text>
              <ChevronDown size={20} color='#0f172a' />
            </TouchableOpacity>
          </View>

          {/* Campo: Prioridade */}
          <View style={styles.field}>
            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.priorityContainer}>
              {['Baixa', 'Média', 'Alta'].map(p => {
                const isActive = priority === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityButton,
                      isActive && p === 'Alta' && styles.priorityButtonAlta,
                      isActive && p === 'Média' && styles.priorityButtonMedia,
                      isActive && p === 'Baixa' && styles.priorityButtonBaixa,
                    ]}
                    onPress={() => setPriority(p)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        isActive && p === 'Alta' && styles.priorityTextAlta,
                        isActive && p === 'Média' && styles.priorityTextMedia,
                        isActive && p === 'Baixa' && styles.priorityTextBaixa,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Campo: Descrição */}
          <View style={styles.field}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.textArea}
              placeholder='Descreva o problema em detalhes...'
              placeholderTextColor='#94a3b8'
              multiline
              numberOfLines={5}
              textAlignVertical='top'
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Campo: Anexos */}
          <View style={styles.field}>
            <Text style={styles.label}>Anexos (opcional)</Text>
            <TouchableOpacity style={styles.uploadArea} activeOpacity={0.7}>
              <Paperclip size={24} color='#64748b' style={styles.uploadIcon} />
              <Text style={styles.uploadTitle}>
                Clique para anexar arquivos
              </Text>
              <Text style={styles.uploadSubtitle}>Máximo 10MB</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* O Botão para enviar a abertura do incidente */}
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Criar Ticket</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default function NewTicketPage() {
  if (Platform.OS === 'web') {
    return <WebNewTicket />;
  }

  return <NativeNewTicketScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
  },
  dropdownText: {
    fontSize: 15,
    color: '#0f172a',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  priorityButtonAlta: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  priorityTextAlta: {
    color: '#b91c1c',
    fontWeight: '600',
  },
  priorityButtonMedia: {
    borderColor: '#eab308',
    backgroundColor: '#fef9c3',
  },
  priorityTextMedia: {
    color: '#b45309',
    fontWeight: '600',
  },
  priorityButtonBaixa: {
    borderColor: '#64748b',
    backgroundColor: '#f8fafc',
  },
  priorityTextBaixa: {
    color: '#334155',
    fontWeight: '600',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    backgroundColor: '#ffffff',
    height: 120,
  },
  uploadArea: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  uploadIcon: {
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
