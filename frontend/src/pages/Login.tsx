import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';


export default function Login() {
  const router = useRouter();
  const { loading, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validarCampos = (): boolean => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    let hasError = false;

    setEmailError('');
    setPasswordError('');

    if (!trimmedEmail) {
      setEmailError('Informe seu email');
      hasError = true;
    } else if (!isValidEmail(trimmedEmail)) {
      setEmailError('Email inválido');
      hasError = true;
    }

    if (!trimmedPassword) {
      setPasswordError('Informe sua senha');
      hasError = true;
    } else if (trimmedPassword.length < 8) {
      setPasswordError('Senha deve ter no mínimo 8 caracteres');
      hasError = true;
    }

    return !hasError;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validarCampos()) {
      return;
    }

    const sucesso = await login(email, password);

    if (sucesso) {
      router.replace('/home');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior='padding'
      keyboardVerticalOffset={20}
    >
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Capa com imagem de fundo */}
        <ImageBackground
          source={require('../../assets/images/image_tela_login.png')}
          style={styles.cover}
          resizeMode="cover"
        ></ImageBackground>

        {/* Formulário */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Bem-vindo</Text>
          <Text style={styles.subtitle}>
            Entre para acessar seus serviços de TI
          </Text>

          {/* Campo Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={emailError ? '#ef4444' : '#94a3b8'}
              />
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          {/* Campo Senha */}
          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>
            <View style={[styles.inputWrapper, passwordError ? styles.inputError : null]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={passwordError ? '#ef4444' : '#94a3b8'}
              />
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          {/* Esqueceu a senha */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push('/forgot-password')}
            disabled={loading}
          >
            <Text style={styles.link}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          {/* Botão Entrar */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.loginButtonText}>Entrando...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.loginButtonText}>Entrar</Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Link para cadastro */}
          <View style={styles.registerRow}>
            <Text style={styles.bottomText}>Não tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => router.push('/register')}
              disabled={loading}
            >
              <Text style={styles.link}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  // Capa
  cover: {
    height: 260,
    width: '100%'
  },
  coverGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  coverContent: {
    marginBottom: 20,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
  },
  coverSubtitle: {
    fontSize: 16,
    color: '#dbeafe',
    marginTop: 4,
  },
  // Formulário
  formContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 15,
    marginBottom: 32,
  },
  // Campos
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  input: {
    flex: 1,
    color: '#0f172a',
    fontSize: 15,
    height: 52,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  // Esqueceu senha
  forgotPassword: {
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 24,
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
  },
  // Botão
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Cadastro
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40
  },
  bottomText: {
    color: '#475569',
    fontSize: 14,
  },
});