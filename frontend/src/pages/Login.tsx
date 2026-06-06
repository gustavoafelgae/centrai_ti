import { useRouter } from 'expo-router';
import { ArrowRight, Lock, Mail } from 'lucide-react-native';
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
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1768633647910-7e6fb53e5b0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJVCUyMHN1cHBvcnQlMjB0ZWNobmljaWFuJTIwaGVscGluZ3xlbnwxfHx8fDE3NzM5MjIyNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = (e?: any) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    let hasError = false;

    if (!trimmedEmail) {
      setEmailError('Informe seu email');
      hasError = true;
    }

    if (!trimmedPassword) {
      setPasswordError('Informe sua senha');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setEmailError('');
    setPasswordError('');
    router.push('/home');
  };

  if (Platform.OS === 'web') {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='w-full max-w-md'>
          <div className='overflow-hidden bg-white'>
            <div className='relative h-60 overflow-hidden bg-slate-900'>
              <ImageWithFallback
                src={IMAGE_URL}
                alt='IT support'
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-blue-900/40 mix-blend-multiply' />
            </div>

            <div className='px-6 pb-8 pt-8 bg-white'>
              <h1 className='text-3xl font-semibold text-slate-950'>
                Bem-vindo
              </h1>
              <p className='mt-2 text-sm text-slate-500'>
                Entre para acessar seus serviços de TI
              </p>

              <form onSubmit={handleLogin} className='mt-8 space-y-5'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-3'>
                    Email
                  </label>
                  <div className={`relative rounded-xl border px-4 py-3 focus-within:border-blue-500 ${emailError ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}`}>
                    <Mail
                      className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                      size={18}
                    />
                    <input
                      type='email'
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      className='w-full bg-transparent pl-11 text-sm text-slate-900 outline-none'
                      placeholder='seu@email.com'
                    />
                  </div>
                  {emailError ? (
                    <p className='mt-2 text-sm text-red-500'>{emailError}</p>
                  ) : null}
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-3'>
                    Senha
                  </label>
                  <div className={`relative rounded-xl border px-4 py-3 focus-within:border-blue-500 ${passwordError ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}`}>
                    <Lock
                      className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                      size={18}
                    />
                    <input
                      type='password'
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      className='w-full bg-transparent pl-11 text-sm text-slate-900 outline-none'
                      placeholder='••••••••'
                    />
                  </div>
                  {passwordError ? (
                    <p className='mt-2 text-sm text-red-500'>{passwordError}</p>
                  ) : null}
                </div>

                <div className='flex justify-start'>
                  <button
                    type='button'
                    onClick={() => router.push('/forgot-password')}
                    className='text-sm font-semibold text-blue-600 hover:underline'
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <button
                  type='submit'
                  className='mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700'
                >
                  Entrar
                  <ArrowRight size={18} color='#ffffff' />
                </button>
              </form>

              <p className='mt-6 text-center text-sm text-slate-500'>
                Não tem uma conta?{' '}
                <button
                  type='button'
                  onClick={() => router.push('/register')}
                  className='text-blue-600 font-semibold hover:underline'
                >
                  Cadastre-se
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollView bounces={false} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.cover}>
          <ImageWithFallback
            src={IMAGE_URL}
            alt='IT support'
            style={styles.coverImage}
          />
          <View style={styles.coverOverlay} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Bem-vindo</Text>
          <Text style={styles.subtitle}>
            Entre para acessar seus serviços de TI
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
              <Mail color='#94a3b8' size={20} style={styles.fieldIcon} />
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                style={styles.input}
                placeholder='seu@email.com'
                placeholderTextColor='#94a3b8'
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>
            <View style={[styles.inputWrapper, passwordError ? styles.inputError : null]}>
              <Lock color='#94a3b8' size={20} style={styles.fieldIcon} />
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                style={styles.input}
                placeholder='••••••••'
                placeholderTextColor='#94a3b8'
                secureTextEntry
              />
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={styles.link}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Entrar</Text>
            <ArrowRight color='#ffffff' size={20} style={styles.buttonIcon} />
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.bottomText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.link}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff', // Fundo agora é branco
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    // Removidas as bordas arredondadas e sombras para preencher a tela toda
  },
  cover: {
    height: 260, // Aumentado um pouco para ficar mais proporcional à tela cheia
    width: '100%',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 58, 138, 0.4)',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 32, // Um respiro maior após a imagem
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
    marginBottom: 32, // Margem aumentada levemente
  },
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
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  fieldIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#0f172a',
    fontSize: 15,
    height: 52,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 12,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 6,
    fontSize: 12,
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  bottomText: {
    color: '#475569',
    fontSize: 14,
  },
});
