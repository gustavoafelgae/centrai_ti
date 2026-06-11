// app/register.tsx
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useCargos } from "@/hooks/useLists";
import SHA256 from "crypto-js/sha256";
import { usuarioService } from "@/services/usuarioService";

type Step = 1 | 2;

interface FormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export default function Register() {
  const router = useRouter();
  const { cargos, loading: loadingCargos } = useCargos();
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState<{ id: number; nome: string } | null>(null);

  const cargosNomes = Array.isArray(cargos) ? cargos.map(cargo => cargo.nome) : [];

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = (field: keyof FormData) => (value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleCargoSelect = (cargoNome: string) => {
    const cargoEncontrado = cargos.find(c => c.nome === cargoNome);
    if (cargoEncontrado) {
      setSelectedCargo(cargoEncontrado);
      set("role")(cargoNome);
      setErrors((prev) => ({ ...prev, role: undefined }));
    }
  };

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Nome obrigatório";
    else if (form.name.trim().split(" ").length < 2) e.name = "Informe nome e sobrenome";
    if (!form.email.trim()) e.email = "E-mail obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail inválido";
    if (!form.phone.trim()) e.phone = "Telefone obrigatório";
    else if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Telefone inválido";
    if (!form.role) e.role = "Selecione um cargo";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: typeof errors = {};
    if (!form.password) e.password = "Senha obrigatória";
    else if (form.password.length < 8) e.password = "Mínimo de 8 caracteres";
    else if (!/[A-Z]/.test(form.password)) e.password = "Use ao menos uma letra maiúscula";
    else if (!/[0-9]/.test(form.password)) e.password = "Use ao menos um número";
    if (!form.confirmPassword) e.confirmPassword = "Confirme a senha";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Senhas não conferem";
    if (!form.terms) e.terms = "Você precisa aceitar os termos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCadastro = async () => {
    if (!selectedCargo) {
      Alert.alert('Erro', 'Selecione um cargo válido');
      return false;
    }

    setLoadingSubmit(true);

    try {
      const dadosCadastro = {
        nome: form.name.trim(),
        email: form.email.trim(),
        telefone: form.phone.replace(/\D/g, ""),
        senha: SHA256(form.password).toString(),
        idCargo: selectedCargo.id
      };

      await usuarioService.cadastrar(dadosCadastro);
      return true;
    } catch (error: any) {
      const mensagem = error.message || 'Erro ao realizar cadastro';
      Alert.alert('Erro no Cadastro', mensagem);
      return false;
    } finally {
      setLoadingSubmit(false);
    }
  };

  const next = async () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) {
      const sucesso = await handleCadastro();
      if (sucesso) setSubmitted(true);
    }
  };

  const back = () => {
    if (step === 1) router.push("/");
    else setStep((s) => (s - 1) as Step);
  };

  const phoneFormat = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: "Fraca", color: "#ef4444", width: "25%" };
    if (score === 2) return { label: "Razoável", color: "#f97316", width: "50%" };
    if (score === 3) return { label: "Boa", color: "#eab308", width: "75%" };
    return { label: "Forte", color: "#22c55e", width: "100%" };
  };

  const strength = passwordStrength();

  // Tela de sucesso
  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <View style={styles.successIconBox}>
            <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
          </View>
          <Text style={styles.successTitle}>Conta criada!</Text>
          <Text style={styles.successText}>
            Seu cadastro foi realizado com sucesso. Um e-mail de confirmação foi enviado para
          </Text>
          <Text style={styles.successEmail}>{form.email}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.primaryButtonText}>Ir para o login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={back}>
          <Ionicons name="arrow-back" size={20} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.smallLabel}>Cadastro</Text>
          <Text style={styles.pageTitle}>
            {step === 1 ? "Dados pessoais" : "Acesso"}
          </Text>
        </View>
      </View>

      {/* Card */}
      <View style={styles.card}>
        {/* Progresso */}
        <View style={styles.progressRow}>
          {[1, 2].map((s) => (
            <View key={s} style={styles.progressStep}>
              <View style={[styles.progressCircle, step >= s && styles.progressCircleActive]}>
                {step > s ? (
                  <Ionicons name="checkmark" size={14} color="#ffffff" />
                ) : (
                  <Text style={[styles.progressCircleText, step >= s && styles.progressCircleTextActive]}>
                    {s}
                  </Text>
                )}
              </View>
              {s < 2 && (
                <View style={[styles.progressLine, step > s && styles.progressLineActive]} />
              )}
            </View>
          ))}
        </View>

        <Text style={styles.sectionSubtitle}>
          {step === 1 ? "Preencha suas informações básicas" : "Defina sua senha de acesso"}
        </Text>

        {/* Step 1 */}
        {step === 1 && (
          <View style={styles.fieldsContainer}>
            {/* Nome */}
            <View style={styles.field}>
              <Text style={styles.label}>Nome completo</Text>
              <View style={[styles.inputRow, errors.name && styles.inputError]}>
                <Ionicons name="person-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  value={form.name}
                  onChangeText={(v) => { set("name")(v); setErrors(p => ({ ...p, name: undefined })); }}
                  placeholder="Seu nome completo"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>E-mail corporativo</Text>
              <View style={[styles.inputRow, errors.email && styles.inputError]}>
                <Ionicons name="mail-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  value={form.email}
                  onChangeText={(v) => { set("email")(v); setErrors(p => ({ ...p, email: undefined })); }}
                  placeholder="seu@email.com"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Telefone */}
            <View style={styles.field}>
              <Text style={styles.label}>Telefone</Text>
              <View style={[styles.inputRow, errors.phone && styles.inputError]}>
                <Ionicons name="call-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  value={form.phone}
                  onChangeText={(v) => set("phone")(phoneFormat(v))}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Cargo */}
            <View style={styles.field}>
              <Text style={styles.label}>Cargo / Função</Text>
              <TouchableOpacity
                style={[styles.inputRow, errors.role && styles.inputError]}
                onPress={() => setRoleOpen(!roleOpen)}
              >
                <Ionicons name="briefcase-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                <Text style={[styles.input, !form.role && styles.placeholderText]}>
                  {form.role || (loadingCargos ? "Carregando..." : "Selecione o cargo")}
                </Text>
                <Ionicons name={roleOpen ? "chevron-up" : "chevron-down"} size={16} color="#94a3b8" />
              </TouchableOpacity>
              {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
              {roleOpen && (
                <View style={styles.dropdown}>
                  {cargosNomes.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownOption}
                      onPress={() => {
                        handleCargoSelect(option);
                        setRoleOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <View style={styles.fieldsContainer}>
            {/* Senha */}
            <View style={styles.field}>
              <Text style={styles.label}>Senha</Text>
              <View style={[styles.inputRow, errors.password && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  value={form.password}
                  onChangeText={(v) => { set("password")(v); setErrors(p => ({ ...p, password: undefined })); }}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              {strength && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <View style={[styles.strengthFill, { width: strength.width as any, backgroundColor: strength.color }]} />
                  </View>
                  <Text style={styles.strengthLabel}>Senha {strength.label}</Text>
                </View>
              )}
            </View>

            {/* Confirmar Senha */}
            <View style={styles.field}>
              <Text style={styles.label}>Confirmar senha</Text>
              <View style={[styles.inputRow, errors.confirmPassword && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  value={form.confirmPassword}
                  onChangeText={(v) => { set("confirmPassword")(v); setErrors(p => ({ ...p, confirmPassword: undefined })); }}
                  placeholder="Repita a senha"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* Termos */}
            <TouchableOpacity style={styles.termsRow} onPress={() => set("terms")(!form.terms)}>
              <View style={[styles.checkbox, form.terms && styles.checkboxChecked]}>
                {form.terms && <Ionicons name="checkmark" size={12} color="#ffffff" />}
              </View>
              <Text style={styles.termsText}>
                Li e aceito os <Text style={styles.termsLink}>Termos de Uso</Text> e a{" "}
                <Text style={styles.termsLink}>Política de Privacidade</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
          </View>
        )}

        {/* Botão */}
        <TouchableOpacity
          style={[styles.primaryButton, loadingSubmit && styles.primaryButtonDisabled]}
          onPress={next}
          disabled={loadingSubmit}
        >
          <Text style={styles.primaryButtonText}>
            {loadingSubmit ? "Processando..." : step === 2 ? "Criar conta" : "Continuar"}
          </Text>
          {!loadingSubmit && <Ionicons name="arrow-forward" size={20} color="#ffffff" />}
        </TouchableOpacity>

        {step === 1 && (
          <TouchableOpacity onPress={() => router.push("/")} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>
              Já tem uma conta? <Text style={styles.loginLinkAction}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 32,
    backgroundColor: "#1d4ed8",
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    gap: 14,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  smallLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginBottom: 2,
  },
  pageTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  // Progresso
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  progressCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e2e8f0",
  },
  progressCircleActive: {
    backgroundColor: "#2563eb",
  },
  progressCircleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94a3b8",
  },
  progressCircleTextActive: {
    color: "#fff",
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#e2e8f0",
    marginHorizontal: 8,
    borderRadius: 1,
  },
  progressLineActive: {
    backgroundColor: "#2563eb",
  },
  sectionSubtitle: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 20,
  },
  // Campos
  fieldsContainer: {
    gap: 4,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 8,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 22,
    paddingHorizontal: 16,
    height: 52,
  },
  inputError: {
    borderColor: "#f87171",
    backgroundColor: "#fef2f2",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#0f172a",
    fontSize: 15,
    height: 52,
  },
  placeholderText: {
    color: "#94a3b8",
  },
  errorText: {
    color: "#ef4444",
    marginTop: 8,
    fontSize: 13,
  },
  // Dropdown
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 18,
    marginTop: 8,
    overflow: "hidden",
  },
  dropdownOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  dropdownOptionText: {
    fontSize: 15,
    color: "#0f172a",
  },
  // Força da senha
  strengthContainer: {
    marginTop: 12,
  },
  strengthBar: {
    height: 6,
    borderRadius: 6,
    backgroundColor: "#e2e8f0",
    overflow: "hidden",
  },
  strengthFill: {
    height: 6,
    borderRadius: 6,
  },
  strengthLabel: {
    marginTop: 6,
    color: "#64748b",
    fontSize: 12,
  },
  // Termos
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  termsText: {
    flex: 1,
    color: "#475569",
    fontSize: 13,
    lineHeight: 20,
  },
  termsLink: {
    color: "#2563eb",
  },
  // Botão principal
  primaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    gap: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  // Link login
  loginLink: {
    marginTop: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  loginLinkText: {
    color: "#64748b",
    fontSize: 14,
  },
  loginLinkAction: {
    color: "#2563eb",
    fontWeight: "700",
  },
  // Sucesso
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1d4ed8",
    padding: 24,
  },
  successCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    alignItems: "center",
    width: "100%",
  },
  successIconBox: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  successText: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },
  successEmail: {
    color: "#0f172a",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    fontSize: 15,
  },
});