import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
} from "lucide-react";
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

export function ForgotPassword() {
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
    if (stage === "code" && Platform.OS !== "web") {
      otpRefs.current[0]?.focus();
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
    if (Platform.OS === "web") {
      const nextInput = document.getElementById(
        `otp-${idx + 1}`,
      ) as HTMLInputElement | null;
      nextInput?.focus();
    } else {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const focusPreviousOtp = (idx: number) => {
    if (Platform.OS === "web") {
      const prevInput = document.getElementById(
        `otp-${idx - 1}`,
      ) as HTMLInputElement | null;
      prevInput?.focus();
    } else {
      otpRefs.current[idx - 1]?.focus();
    }
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

  const handleCodeKeyDown = (idx: number, e: any) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      focusPreviousOtp(idx);
    }
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

  const passwordStrength = () => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { label: "Fraca", color: "#fb7185", width: "25%" };
    if (score === 2)
      return { label: "Razoável", color: "#f59e0b", width: "50%" };
    if (score === 3) return { label: "Boa", color: "#facc15", width: "75%" };
    return { label: "Forte", color: "#22c55e", width: "100%" };
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

  const strength = passwordStrength();
  const current =
    stage === "done"
      ? { title: "Senha redefinida!", sub: "" }
      : stageLabels[stage];
  const stepIndex =
    stage === "email" ? 0 : stage === "code" ? 1 : stage === "reset" ? 2 : 2;

  if (Platform.OS === "web") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
            <div className="bg-blue-600 px-6 py-8">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => {
                    if (stage === "email") router.push("/");
                    else if (stage === "code") setStage("email");
                    else setStage("code");
                  }}
                  className="w-11 h-11 rounded-2xl bg-white/15 text-white flex items-center justify-center"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <p className="text-sm text-blue-100">Recuperação de acesso</p>
                  <h1 className="text-xl font-semibold text-white">
                    {current.title}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === stepIndex ? "w-12 bg-white" : "w-2.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="bg-white px-6 pb-8 pt-8">
              <p className="text-sm text-slate-500 mb-6">{current.sub}</p>
              {stage === "email" && (
                <>
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                    <Mail size={28} className="text-blue-600" />
                  </div>
                  <div className="space-y-4 mb-6">
                    <label className="block text-sm font-medium text-slate-700">
                      E-mail
                    </label>
                    <div className="relative rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && submitEmail()}
                        placeholder="seu@email.com"
                        className="w-full bg-transparent pl-11 text-sm text-slate-950 outline-none"
                      />
                    </div>
                    {emailError && (
                      <p className="text-sm text-red-500">{emailError}</p>
                    )}
                  </div>
                  <button
                    onClick={submitEmail}
                    className="w-full rounded-3xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition"
                  >
                    Enviar código de verificação
                  </button>
                  <p className="text-center text-sm text-slate-500 mt-5">
                    Lembrou a senha?{" "}
                    <button
                      onClick={() => router.push("/")}
                      className="text-blue-600 font-semibold"
                    >
                      Voltar ao login
                    </button>
                  </p>
                </>
              )}
              {stage === "code" && (
                <>
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                    <KeyRound size={28} className="text-blue-600" />
                  </div>
                  <div className="flex justify-center gap-3 mb-3">
                    {code.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(idx, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                        className="w-14 h-14 rounded-2xl border border-slate-200 text-center text-xl font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
                      />
                    ))}
                  </div>
                  {codeError && (
                    <p className="text-sm text-red-500 text-center mb-4">
                      {codeError}
                    </p>
                  )}
                  <p className="text-center text-sm text-slate-400 mb-6">
                    Para testar, use o código{" "}
                    <span className="font-mono text-blue-600">123456</span>
                  </p>
                  <button
                    onClick={submitCode}
                    className="w-full rounded-3xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition mb-4"
                  >
                    Verificar código
                  </button>
                  {resendTimer > 0 ? (
                    <p className="text-center text-sm text-slate-500">
                      Reenviar em{" "}
                      <span className="font-semibold text-slate-900">
                        {resendTimer}s
                      </span>
                    </p>
                  ) : (
                    <button
                      onClick={() => {
                        setCode(["", "", "", "", "", ""]);
                        setResendTimer(60);
                      }}
                      className="mx-auto text-sm font-semibold text-blue-600"
                    >
                      Reenviar código
                    </button>
                  )}
                </>
              )}
              {stage === "reset" && (
                <>
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                    <Lock size={28} className="text-blue-600" />
                  </div>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nova senha
                      </label>
                      <div className="relative rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          size={18}
                        />
                        <input
                          type={showPw ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setPwError("");
                          }}
                          placeholder="Mínimo 8 caracteres"
                          className="w-full bg-transparent pl-11 pr-11 text-sm text-slate-950 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {pwError && (
                        <p className="text-sm text-red-500 mt-2">{pwError}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Confirmar nova senha
                      </label>
                      <div className="relative rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          size={18}
                        />
                        <input
                          type={showCf ? "text" : "password"}
                          value={confirm}
                          onChange={(e) => {
                            setConfirm(e.target.value);
                            setCfError("");
                          }}
                          placeholder="Repita a senha"
                          className="w-full bg-transparent pl-11 pr-11 text-sm text-slate-950 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCf((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showCf ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {cfError && (
                        <p className="text-sm text-red-500 mt-2">{cfError}</p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 space-y-3 mb-6">
                    {[
                      {
                        label: "Mínimo 8 caracteres",
                        ok: password.length >= 8,
                      },
                      {
                        label: "Uma letra maiúscula",
                        ok: /[A-Z]/.test(password),
                      },
                      { label: "Um número", ok: /[0-9]/.test(password) },
                      {
                        label: "Senhas coincidem",
                        ok: !!confirm && password === confirm,
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span
                          className={`text-sm ${item.ok ? "text-blue-600" : "text-slate-300"}`}
                        >
                          •
                        </span>
                        <span
                          className={`text-sm ${item.ok ? "text-slate-800" : "text-slate-400"}`}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={submitReset}
                    className="w-full rounded-3xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition"
                  >
                    Redefinir senha
                  </button>
                </>
              )}
              {stage === "done" && (
                <div className="bg-slate-50 rounded-3xl p-8 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={36} />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-950 mb-3">
                    Senha redefinida!
                  </h2>
                  <p className="text-sm text-slate-500 mb-8">
                    Sua senha foi alterada com sucesso. Use-a no próximo acesso.
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="w-full rounded-3xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white hover:bg-blue-700 transition"
                  >
                    Ir para o login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (stage === "email") router.push("/");
            else if (stage === "code") setStage("email");
            else setStage("code");
          }}
        >
          <Text style={styles.backArrow}>←</Text>
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
      <View style={styles.card}>
        <Text style={styles.cardSubtitle}>{current.sub}</Text>
        {stage === "email" && (
          <>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>✉️</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputRow}>
                <Text style={styles.inputIcon}>✉️</Text>
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
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={submitEmail}
            >
              <Text style={styles.primaryButtonText}>
                Enviar código de verificação
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/")}
              style={styles.linkRow}
            >
              <Text style={styles.linkText}>Lembrou a senha?</Text>
              <Text style={styles.linkAction}> Voltar ao login</Text>
            </TouchableOpacity>
          </>
        )}
        {stage === "code" && (
          <>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>🔑</Text>
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
        {stage === "reset" && (
          <>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>🔒</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Nova senha</Text>
              <View style={styles.inputRow}>
                <Text style={styles.inputIcon}>🔒</Text>
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
                  <Text style={styles.eyeText}>{showPw ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
              </View>
              {pwError ? <Text style={styles.errorText}>{pwError}</Text> : null}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Confirmar nova senha</Text>
              <View style={styles.inputRow}>
                <Text style={styles.inputIcon}>🔒</Text>
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
                  <Text style={styles.eyeText}>{showCf ? "🙈" : "👁️"}</Text>
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
                  <Text
                    style={[
                      styles.requirementBullet,
                      item.ok
                        ? styles.requirementBulletActive
                        : styles.requirementBulletInactive,
                    ]}
                  >
                    •
                  </Text>
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
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={submitReset}
            >
              <Text style={styles.primaryButtonText}>Redefinir senha</Text>
            </TouchableOpacity>
          </>
        )}
        {stage === "done" && (
          <View style={styles.successBox}>
            <View style={styles.successIconBox}>
              <Text style={styles.successIcon}>✔️</Text>
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
  backArrow: {
    color: "#ffffff",
    fontSize: 22,
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
  iconText: {
    fontSize: 28,
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
    color: "#94a3b8",
    fontSize: 18,
  },
  input: {
    flex: 1,
    color: "#0f172a",
    fontSize: 15,
    height: 52,
  },
  eyeText: {
    fontSize: 18,
    color: "#64748b",
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
  requirementBullet: {
    marginRight: 10,
    fontSize: 12,
  },
  requirementBulletActive: {
    color: "#22c55e",
  },
  requirementBulletInactive: {
    color: "#cbd5e1",
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
  successIcon: {
    fontSize: 32,
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
