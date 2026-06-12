// app/forgot-password.tsx
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from '@/hooks/useAuth';
import SHA256 from "crypto-js/sha256";

type Stage = "email" | "reset" | "done";

export default function ForgotPassword() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("email");
  const [sendingCode, setSendingCode] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<Array<TextInput | null>>([]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [pwError, setPwError] = useState("");
  const [cfError, setCfError] = useState("");

  const { solicitarRecuperacao, confirmarResetSenha, loading } = useAuth();

  useEffect(() => {
    if (stage === "reset") {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [stage]);

  useEffect(() => {
    if (resendTimer <= 0) return undefined;
    const id = setInterval(
      () => setResendTimer((prev) => Math.max(prev - 1, 0)),
      1000,
    );
    return () => clearInterval(id);
  }, [resendTimer]);

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Informe seu e-mail");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("E-mail inválido");
      return false;
    }
    setEmailError("");
    return true;
  };

  const submitEmail = async () => {
    if (!validateEmail()) return;

    setSendingCode(true);
    try {
      await solicitarRecuperacao(email);
      setResendTimer(60);
      setStage("reset");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao solicitar recuperação";
      setEmailError(msg);
    } finally {
      setSendingCode(false);
    }
  };

  const resendCode = async () => {
    setCode(["", "", "", "", "", ""]);
    setCodeError("");
    setResendTimer(60);
    try {
      await solicitarRecuperacao(email);
    } catch (error: any) {
      setCodeError("Erro ao reenviar código");
    }
  };

  const focusNextOtp = (idx: number) => {
    otpRefs.current[idx + 1]?.focus();
  };

  const focusPreviousOtp = (idx: number) => {
    otpRefs.current[idx - 1]?.focus();
  };

  const handleCodeChange = (idx: number, value: string) => {
    const digits = value.replace(/[^0-9]/g, "");
    if (digits.length > 1) return;
    const next = [...code];
    next[idx] = digits;
    setCode(next);
    setCodeError("");
    if (digits && idx < 5) focusNextOtp(idx);
  };

  const getResetError = (password: string, confirm: string) => {
    if (!password) return "Informe a nova senha";
    if (password.length < 8) return "Mínimo 8 caracteres";
    if (!/[A-Z]/.test(password)) return "Use uma letra maiúscula";
    if (!/[0-9]/.test(password)) return "Use um número";
    if (password !== confirm) return "As senhas não conferem";
    return null;
  };

  const submitReset = async () => {
    if (code.some((digit) => !digit)) {
      setCodeError("Preencha todos os 6 dígitos");
      return;
    }

    const errorMessage = getResetError(password, confirm);
    if (errorMessage) {
      errorMessage.includes("senhas") ? setCfError(errorMessage) : setPwError(errorMessage);
      return;
    }

    setPwError("");
    setCfError("");
    setCodeError("");

    try {
      const hashedPass = SHA256(password).toString();
      await confirmarResetSenha(email, code.join(""), hashedPass);
      setStage("done");
    } catch (err: any) {
      const mensagem = err.message || "Erro desconhecido";

      if (mensagem.includes("inválido") || mensagem.includes("expirado")) {
        setCode(["", "", "", "", "", ""]);
        setPassword("");
        setConfirm("");
        setCodeError("Código inválido ou expirado. Tente novamente.");
        setPwError("");
        setCfError("");
      } else {
        setCode(["", "", "", "", "", ""]);
        setPassword("");
        setConfirm("");
        setCodeError("Erro ao redefinir senha. Tente novamente.");
        setPwError("");
        setCfError("");
      }
    }
  };

  const stageInfo = {
    email: { title: "Esqueci a senha", sub: "Informe o e-mail da sua conta" },
    reset: { title: "Código de verificação", sub: "Enviamos um código de 6 dígitos para o seu e-mail" },
  };

  const current = stage === "done" ? { title: "Senha redefinida!", sub: "" } : stageInfo[stage];

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior='padding'
      keyboardVerticalOffset={20}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (stage === "email" || stage === "done") router.replace("/");
              else setStage("email");
            }}
          >
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.overline}>Recuperação de acesso</Text>
            <Text style={styles.headerTitle}>{current.title}</Text>
          </View>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Stage: Email */}
          {stage === "email" && (
            <>
              {/* Ícone + subtítulo na mesma linha */}
              <View style={styles.subtitleRow}>
                <Ionicons name="mail-outline" size={20} color="#2563eb" />
                <Text style={styles.cardSubtitle}>{stageInfo.email.sub}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>E-mail</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="mail-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      setEmailError("");
                    }}
                    placeholder="seu@email.com"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    editable={!sendingCode}
                  />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, sendingCode && styles.primaryButtonDisabled]}
                onPress={submitEmail}
                disabled={sendingCode}
                activeOpacity={0.8}
              >
                {sendingCode ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text style={styles.primaryButtonText}>Enviando...</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryButtonText}>Enviar código de verificação</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.replace("/")} style={styles.linkRow}>
                <Text style={styles.linkText}>Lembrou a senha?</Text>
                <Text style={styles.linkAction}> Voltar ao login</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Stage: Reset (Código + Senha) */}
          {stage === "reset" && (
            <>
              {/* Ícone + subtítulo na mesma linha */}
              <View style={styles.subtitleRow}>
                <Ionicons name="key-outline" size={20} color="#2563eb" />
                <Text style={styles.cardSubtitle}>{stageInfo.reset.sub}</Text>
              </View>

              {/* Código OTP */}
              <Text style={styles.label}>Código de verificação</Text>
              <View style={styles.otpRow}>
                {code.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={(ref) => { otpRefs.current[idx] = ref; }}
                    value={digit}
                    onChangeText={(value) => handleCodeChange(idx, value)}
                    keyboardType="number-pad"
                    maxLength={1}
                    returnKeyType={idx === 5 ? "done" : "next"}
                    onSubmitEditing={() => {
                      if (idx < 5) focusNextOtp(idx);
                    }}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === "Backspace" && !digit && idx > 0) {
                        focusPreviousOtp(idx);
                      }
                    }}
                    style={[
                      styles.otpInput,
                      codeError ? styles.otpInputError : digit ? styles.otpInputFilled : null,
                    ]}
                  />
                ))}
              </View>
              {codeError ? <Text style={styles.errorText}>{codeError}</Text> : null}

              {/* Reenviar código centralizado */}
              {resendTimer > 0 ? (
                <Text style={styles.resendText}>Reenviar em {resendTimer}s</Text>
              ) : (
                <TouchableOpacity onPress={resendCode} style={styles.resendButton}>
                  <Text style={styles.linkAction}>Reenviar código</Text>
                </TouchableOpacity>
              )}

              {/* Campos de senha */}
              <View style={styles.field}>
                <Text style={styles.label}>Nova senha</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    value={password}
                    onChangeText={(value) => { setPassword(value); setPwError(""); }}
                    placeholder="Mínimo 8 caracteres"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPw}
                    style={styles.input}
                  />
                  <TouchableOpacity onPress={() => setShowPw((prev) => !prev)}>
                    <Ionicons name={showPw ? "eye-off-outline" : "eye-outline"} size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>
                {pwError ? <Text style={styles.errorText}>{pwError}</Text> : null}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Confirmar nova senha</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    value={confirm}
                    onChangeText={(value) => { setConfirm(value); setCfError(""); }}
                    placeholder="Repita a senha"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showCf}
                    style={styles.input}
                  />
                  <TouchableOpacity onPress={() => setShowCf((prev) => !prev)}>
                    <Ionicons name={showCf ? "eye-off-outline" : "eye-outline"} size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>
                {cfError ? <Text style={styles.errorText}>{cfError}</Text> : null}
              </View>

              {/* Requisitos */}
              <View style={styles.requirementsBox}>
                {[
                  { label: "Mínimo 8 caracteres", ok: password.length >= 8 },
                  { label: "Uma letra maiúscula", ok: /[A-Z]/.test(password) },
                  { label: "Um número", ok: /[0-9]/.test(password) },
                  { label: "Senhas coincidem", ok: !!confirm && password === confirm },
                ].map((item) => (
                  <View key={item.label} style={styles.requirementRow}>
                    <Ionicons
                      name={item.ok ? "checkmark-circle" : "ellipse-outline"}
                      size={16}
                      color={item.ok ? "#22c55e" : "#cbd5e1"}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={[styles.requirementText, item.ok ? styles.requirementTextActive : styles.requirementTextInactive]}>
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Botão Salvar Senha */}
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                onPress={submitReset}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text style={styles.primaryButtonText}>Salvando...</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryButtonText}>Salvar nova senha</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Stage: Done */}
          {stage === "done" && (
            <View style={styles.successBox}>
              <View style={styles.successIconBox}>
                <Ionicons name="checkmark-circle" size={40} color="#22c55e" />
              </View>
              <Text style={styles.successTitle}>Senha redefinida!</Text>
              <Text style={styles.successSubtitle}>
                Sua senha foi alterada com sucesso. Use-a no próximo acesso.
              </Text>
              <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace("/")}>
                <Text style={styles.primaryButtonText}>Ir para o login</Text>
              </TouchableOpacity>
            </View>
          )}
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
    backgroundColor: "#1d4ed8",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    backgroundColor: "#2563eb",
    borderRadius: 32,
    padding: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  headerText: {
    marginBottom: 8,
  },
  overline: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    marginBottom: 4,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 32,
    padding: 24,
    minHeight: 400,
  },
  // Ícone + subtítulo na mesma linha
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  cardSubtitle: {
    color: "#475569",
    fontSize: 14,
    flex: 1,
  },
  field: {
    marginBottom: 16,
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
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#0f172a",
    fontSize: 15,
    height: 52,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: '80%'
  },
  primaryButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  linkText: {
    color: "#64748b",
    fontSize: 14,
  },
  linkAction: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "700",
  },
  // OTP
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 10,
    marginLeft: -18
  },
  otpInput: {
    width: 45,
    height: 56,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 16,
    textAlign: "center",
    fontSize: 20,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
  },
  otpInputError: {
    borderColor: "#f87171",
    backgroundColor: "#fef2f2",
  },
  otpInputFilled: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  // Reenviar centralizado
  resendText: {
    color: "#64748b",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 16,
  },
  resendButton: {
    alignItems: "center",
    marginBottom: 16,
  },
  // Requisitos
  requirementsBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  requirementText: {
    fontSize: 13,
    color: "#475569",
  },
  requirementTextActive: {
    color: "#0f172a",
  },
  requirementTextInactive: {
    color: "#94a3b8",
  },
  // Sucesso
  successBox: {
    alignItems: "center",
    paddingVertical: 20,
  },
  successIconBox: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 10,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
});