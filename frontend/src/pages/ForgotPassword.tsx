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
} from "react-native";

type Stage = "email" | "code" | "reset" | "done";

const stageLabels: Record<
  Exclude<Stage, "done">,
  { title: string; sub: string }
> = {
  email: { title: "Esqueci a senha", sub: "Informe o e-mail da sua conta" },
  code: {
    title: "Código de verificação",
    sub: "Enviamos um código de 6 dígitos para o seu e-mail",
  },
  reset: {
    title: "Nova senha",
    sub: "Escolha uma senha forte para sua conta",
  },
};

export default function ForgotPassword() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("email");

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

  useEffect(() => {
    if (stage === "code") {
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

  const submitEmail = () => {
    if (!validateEmail()) return;
    setResendTimer(60);
    setStage("code");
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

  const submitCode = () => {
    if (code.some((digit) => !digit)) {
      setCodeError("Preencha todos os 6 dígitos");
      return;
    }
    if (code.join("") !== "123456") {
      setCodeError("Código incorreto. Tente novamente.");
      return;
    }
    setCodeError("");
    setStage("reset");
  };

  const submitReset = () => {
    let valid = true;
    if (!password) {
      setPwError("Informe a nova senha");
      valid = false;
    } else if (password.length < 8) {
      setPwError("Mínimo 8 caracteres");
      valid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPwError("Use ao menos uma letra maiúscula");
      valid = false;
    } else if (!/[0-9]/.test(password)) {
      setPwError("Use ao menos um número");
      valid = false;
    } else {
      setPwError("");
    }

    if (!confirm) {
      setCfError("Confirme a senha");
      valid = false;
    } else if (password !== confirm) {
      setCfError("Senhas não conferem");
      valid = false;
    } else {
      setCfError("");
    }

    if (valid) {
      setStage("done");
    }
  };

  const current =
    stage === "done"
      ? { title: "Senha redefinida!", sub: "" }
      : stageLabels[stage];
  const stepIndex =
    stage === "email" ? 0 : stage === "code" ? 1 : stage === "reset" ? 2 : 2;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (stage === "email") router.push("/");
            else if (stage === "code") setStage("email");
            else setStage("code");
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.overline}>Recuperação de acesso</Text>
          <Text style={styles.headerTitle}>{current.title}</Text>
          <View style={styles.stepRow}>
            {[0, 1, 2].map((idx) => (
              <View
                key={idx}
                style={[
                  styles.stepDot,
                  idx === stepIndex
                    ? styles.stepDotActive
                    : styles.stepDotInactive,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardSubtitle}>{current.sub}</Text>

        {/* Stage: Email */}
        {stage === "email" && (
          <>
            <View style={styles.iconBox}>
              <Ionicons name="mail" size={28} color="#2563eb" />
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
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={submitEmail}>
              <Text style={styles.primaryButtonText}>
                Enviar código de verificação
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/")} style={styles.linkRow}>
              <Text style={styles.linkText}>Lembrou a senha?</Text>
              <Text style={styles.linkAction}> Voltar ao login</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Stage: Code */}
        {stage === "code" && (
          <>
            <View style={styles.iconBox}>
              <Ionicons name="key" size={28} color="#2563eb" />
            </View>
            <View style={styles.otpRow}>
              {code.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={(ref) => {
                    otpRefs.current[idx] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) => handleCodeChange(idx, value)}
                  keyboardType="number-pad"
                  maxLength={1}
                  returnKeyType={idx === 5 ? "done" : "next"}
                  onSubmitEditing={() => {
                    if (idx < 5) focusNextOtp(idx);
                    else submitCode();
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace" && !digit && idx > 0) {
                      focusPreviousOtp(idx);
                    }
                  }}
                  style={[
                    styles.otpInput,
                    codeError
                      ? styles.otpInputError
                      : digit
                        ? styles.otpInputFilled
                        : null,
                  ]}
                />
              ))}
            </View>
            {codeError ? (
              <Text style={styles.errorText}>{codeError}</Text>
            ) : null}
            <Text style={styles.otpHint}>Para testar, use o código 123456</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={submitCode}>
              <Text style={styles.primaryButtonText}>Verificar código</Text>
            </TouchableOpacity>
            {resendTimer > 0 ? (
              <Text style={styles.resendText}>Reenviar em {resendTimer}s</Text>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setCode(["", "", "", "", "", ""]);
                  setResendTimer(60);
                }}
              >
                <Text style={styles.linkAction}>Reenviar código</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Stage: Reset */}
        {stage === "reset" && (
          <>
            <View style={styles.iconBox}>
              <Ionicons name="lock-closed" size={28} color="#2563eb" />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Nova senha</Text>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setPwError("");
                  }}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPw}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowPw((prev) => !prev)}>
                  <Ionicons
                    name={showPw ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#64748b"
                  />
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
                  onChangeText={(value) => {
                    setConfirm(value);
                    setCfError("");
                  }}
                  placeholder="Repita a senha"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showCf}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowCf((prev) => !prev)}>
                  <Ionicons
                    name={showCf ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
              {cfError ? <Text style={styles.errorText}>{cfError}</Text> : null}
            </View>
            <View style={styles.requirementsBox}>
              {[
                { label: "Mínimo 8 caracteres", ok: password.length >= 8 },
                { label: "Uma letra maiúscula", ok: /[A-Z]/.test(password) },
                { label: "Um número", ok: /[0-9]/.test(password) },
                {
                  label: "Senhas coincidem",
                  ok: !!confirm && password === confirm,
                },
              ].map((item) => (
                <View key={item.label} style={styles.requirementRow}>
                  <Ionicons
                    name={item.ok ? "checkmark-circle" : "ellipse-outline"}
                    size={16}
                    color={item.ok ? "#22c55e" : "#cbd5e1"}
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      item.ok
                        ? styles.requirementTextActive
                        : styles.requirementTextInactive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={submitReset}>
              <Text style={styles.primaryButtonText}>Redefinir senha</Text>
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
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.primaryButtonText}>Ir para o login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  stepDot: {
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  stepDotActive: {
    width: 32,
    backgroundColor: "#ffffff",
  },
  stepDotInactive: {
    width: 8,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 32,
    padding: 24,
    minHeight: 520,
  },
  cardSubtitle: {
    color: "#475569",
    fontSize: 14,
    marginBottom: 22,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
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
    marginTop: 8,
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
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
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  otpInput: {
    width: 52,
    height: 60,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 18,
    textAlign: "center",
    fontSize: 20,
    color: "#0f172a",
  },
  otpInputError: {
    borderColor: "#f87171",
    backgroundColor: "#fef2f2",
  },
  otpInputFilled: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  otpHint: {
    color: "#64748b",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 18,
  },
  resendText: {
    color: "#475569",
    fontSize: 14,
    textAlign: "center",
    marginTop: 14,
  },
  requirementsBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 22,
    padding: 16,
    marginBottom: 20,
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