import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Building2,
  Camera,
  Mail,
  Phone,
  User,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '../../hooks/UserContext';

export default function ProfileEditScreen() {
  const router = useRouter();
  const { user, setUser } = useUser(); // Pegamos o usuário global

  // Preenchemos os inputs com os dados globais atuais
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [company, setCompany] = useState(user.company);

  const handleSave = () => {
    // Atualiza o estado global com os novos dados digitados!
    setUser({ ...user, name, email, phone });
    router.back();
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
        <Text style={styles.title}>Editar Perfil</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          {/* Edição de Foto (Avatar) */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <User size={48} color='#2563eb' strokeWidth={1.5} />
              <TouchableOpacity style={styles.cameraButton} activeOpacity={0.8}>
                <Camera size={16} color='#ffffff' />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarText}>Alterar foto de perfil</Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {/* Campo: Nome */}
            <View style={styles.field}>
              <Text style={styles.label}>Nome Completo</Text>
              <View style={styles.inputWrapper}>
                <User color='#94a3b8' size={20} style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder='Seu nome'
                  placeholderTextColor='#94a3b8'
                />
              </View>
            </View>

            {/* Campo: E-mail */}
            <View style={styles.field}>
              <Text style={styles.label}>E-mail Profissional</Text>
              <View style={styles.inputWrapper}>
                <Mail color='#94a3b8' size={20} style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  placeholder='seu@email.com'
                  placeholderTextColor='#94a3b8'
                />
              </View>
            </View>

            {/* Campo: Telefone */}
            <View style={styles.field}>
              <Text style={styles.label}>Telefone / Celular</Text>
              <View style={styles.inputWrapper}>
                <Phone color='#94a3b8' size={20} style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType='phone-pad'
                  placeholder='(00) 00000-0000'
                  placeholderTextColor='#94a3b8'
                />
              </View>
            </View>

            {/* Campo: Empresa */}
            <View style={styles.field}>
              <Text style={styles.label}>Empresa</Text>
              <View style={[styles.inputWrapper, styles.inputDisabled]}>
                <Building2 color='#94a3b8' size={20} style={styles.fieldIcon} />
                <TextInput
                  style={[styles.input, { color: '#64748b' }]}
                  value={company}
                  editable={false} // Empresa geralmente não é editável pelo próprio usuário
                />
              </View>
              <Text style={styles.helperText}>
                A empresa só pode ser alterada pelo administrador.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Rodapé Fixo: Botão Salvar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fundo branco para destacar os inputs cinzas
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563eb',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  avatarText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  formContainer: {
    gap: 20,
  },
  field: {
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  fieldIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#0f172a',
    fontSize: 15,
    height: '100%',
  },
  helperText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
    marginLeft: 4,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
