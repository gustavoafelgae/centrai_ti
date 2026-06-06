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
  const { user, setUser } = useUser();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [company] = useState(user.company);

  // Estado para armazenar erros
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    let newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) newErrors.name = "O nome é obrigatório.";
    if (!email.includes("@")) newErrors.email = "E-mail inválido.";
    if (phone.length < 10) newErrors.phone = "Telefone inválido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      setUser({ ...user, name, email, phone });
      router.back();
    }
  };

  // Componente de Campo Reutilizável com Validação
  const InputField = ({ label, icon: Icon, value, onChange, placeholder, error, keyboardType = 'default' }: any) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <Icon color={error ? '#ef4444' : '#94a3b8'} size={20} style={styles.fieldIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          keyboardType={keyboardType}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color='#0f172a' />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <User size={48} color='#2563eb' strokeWidth={1.5} />
              <TouchableOpacity style={styles.cameraButton} activeOpacity={0.8}>
                <Camera size={16} color='#ffffff' />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formContainer}>
            <InputField label="Nome Completo" icon={User} value={name} onChange={setName} error={errors.name} />
            <InputField label="E-mail Profissional" icon={Mail} value={email} onChange={setEmail} error={errors.email} keyboardType="email-address" />
            <InputField label="Telefone" icon={Phone} value={phone} onChange={setPhone} error={errors.phone} keyboardType="phone-pad" />
            
            <View style={styles.field}>
              <Text style={styles.label}>Empresa</Text>
              <View style={[styles.inputWrapper, styles.inputDisabled]}>
                <Building2 color='#94a3b8' size={20} style={styles.fieldIcon} />
                <TextInput style={[styles.input, { color: '#64748b' }]} value={company} editable={false} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 50 : 20, 
    paddingBottom: 16, 
    backgroundColor: '#ffffff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9' 
  },
  backButton: { 
    marginRight: 16, 
    padding: 4 
  },
  title: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#0f172a' 
  },
  content: { 
    padding: 24, 
    paddingBottom: 40 
  },
  avatarSection: { 
    alignItems: 'center', 
    marginBottom: 32 
  },
  avatarContainer: { 
    width: 96, 
    height: 96, 
    borderRadius: 48, 
    backgroundColor: '#dbeafe', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12, 
    position: 'relative' 
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
    borderColor: '#ffffff' 
  },
  formContainer: {
    gap: 20 
  },
  field: { 
    marginBottom: 4 
  },
  label: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#334155', 
    marginBottom: 8, 
    marginLeft: 4 
  },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    backgroundColor: '#f8fafc', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    height: 52 
  },
  inputDisabled: { 
    backgroundColor: '#f1f5f9', 
    borderColor: '#e2e8f0' 
  },
  fieldIcon: { 
    marginRight: 12 
  },
  input: { 
    flex: 1, 
    color: '#0f172a', 
    fontSize: 15, 
    height: '100%' 
  },
  footer: { 
    padding: 20, 
    paddingBottom: Platform.OS === 'ios' ? 32 : 20, 
    backgroundColor: '#ffffff', 
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9' 
  },
  saveButton: { 
    backgroundColor: '#2563eb', 
    borderRadius: 16, 
    paddingVertical: 16, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  saveButtonText: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: '700' 
  },
});