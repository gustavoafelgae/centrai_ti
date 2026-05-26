import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Step = 1 | 2 | 3;

interface FormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const DEPARTMENTS = [
  "TI",
  "Recursos Humanos",
  "Financeiro",
  "Comercial",
  "Operações",
  "Jurídico",
  "Marketing",
  "Diretoria",
];

const ROLES = [
  "Colaborador",
  "Supervisor",
  "Gerente",
  "Diretor",
  "Analista de TI",
  "Outro",
];

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {([1, 2, 3] as Step[]).map((s) => (
        <div key={s} className="flex items-center gap-2 flex-1">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 transition-colors ${
              step > s
                ? "bg-blue-600 text-white"
                : step === s
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            {step > s ? <CheckCircle2 size={14} /> : s}
          </div>
          {s < 3 && (
            <div
              className={`flex-1 h-0.5 rounded-full transition-colors ${
                step > s ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
}

function InputField({
  label,
  icon: Icon,
  error,
  ...props
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          {...props}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
          } ${props.className ?? ""}`}
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}

function SelectField({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  icon: React.ElementType;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={18}
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-8 py-3 border rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors ${
            error ? "border-red-400 bg-red-50" : "border-gray-300"
          } ${!value ? "text-gray-400" : "text-gray-900"}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}

export function Register() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const set = (field: keyof FormData) => (value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Nome obrigatório";
    else if (form.name.trim().split(" ").length < 2)
      e.name = "Informe nome e sobrenome";
    if (!form.email.trim()) e.email = "E-mail obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "E-mail inválido";
    if (!form.phone.trim()) e.phone = "Telefone obrigatório";
    else if (form.phone.replace(/\D/g, "").length < 10)
      e.phone = "Telefone inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: typeof errors = {};
    if (!form.department) e.department = "Selecione um departamento";
    if (!form.role) e.role = "Selecione um cargo";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: typeof errors = {};
    if (!form.password) e.password = "Senha obrigatória";
    else if (form.password.length < 8) e.password = "Mínimo de 8 caracteres";
    else if (!/[A-Z]/.test(form.password))
      e.password = "Use ao menos uma letra maiúscula";
    else if (!/[0-9]/.test(form.password))
      e.password = "Use ao menos um número";
    if (!form.confirmPassword) e.confirmPassword = "Confirme a senha";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Senhas não conferem";
    if (!form.terms) e.terms = "Você precisa aceitar os termos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
    if (step === 3 && validateStep3()) setSubmitted(true);
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
    if (score <= 1)
      return { label: "Fraca", color: "bg-red-500", width: "w-1/4" };
    if (score === 2)
      return { label: "Razoável", color: "bg-orange-400", width: "w-2/4" };
    if (score === 3)
      return { label: "Boa", color: "bg-yellow-400", width: "w-3/4" };
    return { label: "Forte", color: "bg-green-500", width: "w-full" };
  };

  if (submitted && Platform.OS === "web") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Conta criada!</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Seu cadastro foi realizado com sucesso. Um e-mail de confirmação foi
            enviado para <strong>{form.email}</strong>.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Ir para o login
          </button>
        </div>
      </div>
    );
  }

  if (Platform.OS !== "web") {
    const nativeStepTitles: Record<Step, { title: string; sub: string }> = {
      1: { title: "Dados pessoais", sub: "Preencha suas informações básicas" },
      2: { title: "Departamento", sub: "Onde você trabalha?" },
      3: { title: "Acesso", sub: "Defina sua senha de acesso" },
    };

    const strength = passwordStrength();

    const renderNativeTextInput = ({
      label,
      placeholder,
      value,
      onChangeText,
      secureTextEntry,
      error,
      keyboardType,
      autoCapitalize,
      suffix,
    }: {
      label: string;
      placeholder: string;
      value: string;
      onChangeText: (text: string) => void;
      secureTextEntry?: boolean;
      error?: string;
      keyboardType?: string;
      autoCapitalize?: "none" | "sentences" | "words" | "characters";
      suffix?: React.ReactNode;
    }) => (
      <View style={nativeStyles.field}>
        <Text style={nativeStyles.label}>{label}</Text>
        <View
          style={[
            nativeStyles.inputRow,
            error ? nativeStyles.inputError : null,
          ]}
        >
          <Text style={nativeStyles.inputIcon}>•</Text>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
            style={nativeStyles.input}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType as any}
            autoCapitalize={autoCapitalize as any}
          />
          {suffix ? <View style={nativeStyles.suffix}>{suffix}</View> : null}
        </View>
        {error ? <Text style={nativeStyles.errorText}>{error}</Text> : null}
      </View>
    );

    const renderNativeSelect = ({
      label,
      value,
      placeholder,
      open,
      setOpen,
      options,
      onSelect,
      error,
    }: {
      label: string;
      value: string;
      placeholder: string;
      open: boolean;
      setOpen: (open: boolean) => void;
      options: string[];
      onSelect: (value: string) => void;
      error?: string;
    }) => (
      <View style={nativeStyles.field}>
        <Text style={nativeStyles.label}>{label}</Text>
        <TouchableOpacity
          onPress={() => setOpen(!open)}
          style={[
            nativeStyles.inputRow,
            error ? nativeStyles.inputError : null,
          ]}
        >
          <Text style={nativeStyles.inputIcon}>⌄</Text>
          <Text
            style={[
              nativeStyles.input,
              !value ? nativeStyles.placeholderText : null,
            ]}
          >
            {value || placeholder}
          </Text>
        </TouchableOpacity>
        {error ? <Text style={nativeStyles.errorText}>{error}</Text> : null}
        {open ? (
          <View style={nativeStyles.dropdown}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  onSelect(option);
                  setOpen(false);
                }}
                style={nativeStyles.dropdownOption}
              >
                <Text style={nativeStyles.dropdownOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    );

    if (submitted) {
      return (
        <ScrollView contentContainerStyle={nativeStyles.nativeContainer}>
          <View style={nativeStyles.nativeCard}>
            <View style={nativeStyles.successBadge}>
              <Text style={nativeStyles.successIcon}>✔️</Text>
            </View>
            <Text style={nativeStyles.nativeTitle}>Conta criada!</Text>
            <Text style={nativeStyles.nativeDescription}>
              Seu cadastro foi realizado com sucesso. Um e-mail de confirmação
              foi enviado para
            </Text>
            <Text style={nativeStyles.emailText}>{form.email}</Text>
            <TouchableOpacity
              onPress={() => router.push("/")}
              style={nativeStyles.primaryButton}
            >
              <Text style={nativeStyles.primaryButtonText}>
                Ir para o login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView contentContainerStyle={nativeStyles.nativeContainer}>
        <View style={nativeStyles.nativeHeader}>
          <TouchableOpacity style={nativeStyles.backButton} onPress={back}>
            <Text style={nativeStyles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={nativeStyles.nativeHeaderText}>
            <Text style={nativeStyles.smallLabel}>Cadastro</Text>
            <Text style={nativeStyles.pageTitle}>
              {nativeStepTitles[step].title}
            </Text>
          </View>
        </View>

        <View style={nativeStyles.nativeCard}>
          <View style={nativeStyles.progressRow}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={nativeStyles.progressStep}>
                <View
                  style={[
                    nativeStyles.progressCircle,
                    step >= s
                      ? nativeStyles.progressCircleActive
                      : nativeStyles.progressCircleInactive,
                  ]}
                >
                  <Text
                    style={[
                      nativeStyles.progressCircleText,
                      step >= s
                        ? nativeStyles.progressCircleTextActive
                        : nativeStyles.progressCircleTextInactive,
                    ]}
                  >
                    {step > s ? "✔" : s}
                  </Text>
                </View>
                {s < 3 ? (
                  <View
                    style={[
                      nativeStyles.progressLine,
                      step > s
                        ? nativeStyles.progressLineActive
                        : nativeStyles.progressLineInactive,
                    ]}
                  />
                ) : null}
              </View>
            ))}
          </View>

          <Text style={nativeStyles.sectionSubtitle}>
            {nativeStepTitles[step].sub}
          </Text>

          {step === 1 ? (
            <View>
              {renderNativeTextInput({
                label: "Nome completo",
                placeholder: "João da Silva",
                value: form.name,
                onChangeText: (value) => {
                  set("name")(value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                },
                error: errors.name,
                keyboardType: "default",
                autoCapitalize: "words",
              })}
              {renderNativeTextInput({
                label: "E-mail corporativo",
                placeholder: "joao@empresa.com",
                value: form.email,
                onChangeText: (value) => {
                  set("email")(value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                },
                error: errors.email,
                keyboardType: "email-address",
                autoCapitalize: "none",
              })}
              {renderNativeTextInput({
                label: "Telefone",
                placeholder: "(00) 00000-0000",
                value: form.phone,
                onChangeText: (value) => set("phone")(phoneFormat(value)),
                error: errors.phone,
                keyboardType: "phone-pad",
              })}
            </View>
          ) : null}

          {step === 2 ? (
            <View>
              {renderNativeSelect({
                label: "Departamento",
                value: form.department,
                placeholder: "Selecione o departamento",
                open: departmentOpen,
                setOpen: setDepartmentOpen,
                options: DEPARTMENTS,
                onSelect: set("department"),
                error: errors.department,
              })}
              {renderNativeSelect({
                label: "Cargo / Função",
                value: form.role,
                placeholder: "Selecione o cargo",
                open: roleOpen,
                setOpen: setRoleOpen,
                options: ROLES,
                onSelect: set("role"),
                error: errors.role,
              })}
              {form.department && form.role ? (
                <View style={nativeStyles.profileSummary}>
                  <Text style={nativeStyles.summaryTitle}>
                    Resumo do perfil
                  </Text>
                  <Text style={nativeStyles.summaryName}>
                    {form.name || "Usuário"}
                  </Text>
                  <Text style={nativeStyles.summaryRole}>
                    {form.role} · {form.department}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {step === 3 ? (
            <View>
              {renderNativeTextInput({
                label: "Senha",
                placeholder: "Mínimo 8 caracteres",
                value: form.password,
                onChangeText: (value) => {
                  set("password")(value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                },
                error: errors.password,
                secureTextEntry: !showPassword,
                keyboardType: "default",
                autoCapitalize: "none",
                suffix: (
                  <TouchableOpacity
                    onPress={() => setShowPassword((value) => !value)}
                  >
                    <Text style={nativeStyles.eyeToggle}>
                      {showPassword ? "🙈" : "👁️"}
                    </Text>
                  </TouchableOpacity>
                ),
              })}
              {strength ? (
                <View style={nativeStyles.strengthBarContainer}>
                  <View style={nativeStyles.strengthBarBackground}>
                    <View
                      style={[
                        nativeStyles.strengthBarFill,
                        strength.width === "w-full"
                          ? nativeStyles.strengthFull
                          : strength.width === "w-3/4"
                            ? nativeStyles.strengthThreeQuarters
                            : strength.width === "w-2/4"
                              ? nativeStyles.strengthHalf
                              : nativeStyles.strengthQuarter,
                      ]}
                    />
                  </View>
                  <Text style={nativeStyles.strengthLabel}>
                    Senha {strength.label}
                  </Text>
                </View>
              ) : null}
              {renderNativeTextInput({
                label: "Confirmar senha",
                placeholder: "Repita a senha",
                value: form.confirmPassword,
                onChangeText: (value) => {
                  set("confirmPassword")(value);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                },
                error: errors.confirmPassword,
                secureTextEntry: !showConfirm,
                keyboardType: "default",
                autoCapitalize: "none",
                suffix: (
                  <TouchableOpacity
                    onPress={() => setShowConfirm((value) => !value)}
                  >
                    <Text style={nativeStyles.eyeToggle}>
                      {showConfirm ? "🙈" : "👁️"}
                    </Text>
                  </TouchableOpacity>
                ),
              })}
              <TouchableOpacity
                style={nativeStyles.termsRow}
                onPress={() => set("terms")(!form.terms)}
              >
                <View
                  style={[
                    nativeStyles.checkbox,
                    form.terms && nativeStyles.checkboxChecked,
                  ]}
                >
                  {form.terms ? (
                    <Text style={nativeStyles.checkboxIcon}>✔</Text>
                  ) : null}
                </View>
                <Text style={nativeStyles.termsText}>
                  Li e aceito os{" "}
                  <Text style={nativeStyles.termsLink}>Termos de Uso</Text> e a{" "}
                  <Text style={nativeStyles.termsLink}>
                    Política de Privacidade
                  </Text>
                </Text>
              </TouchableOpacity>
              {errors.terms ? (
                <Text style={nativeStyles.errorText}>{errors.terms}</Text>
              ) : null}
            </View>
          ) : null}

          <TouchableOpacity style={nativeStyles.primaryButton} onPress={next}>
            <Text style={nativeStyles.primaryButtonText}>
              {step === 3 ? "Criar conta" : "Continuar"}
            </Text>
          </TouchableOpacity>
          {step === 1 ? (
            <TouchableOpacity
              onPress={() => router.push("/")}
              style={nativeStyles.loginLink}
            >
              <Text style={nativeStyles.loginLinkText}>
                Já tem uma conta?{" "}
                <Text style={nativeStyles.loginLinkAction}>Entrar</Text>
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    );
  }

  const stepTitles: Record<Step, { title: string; sub: string }> = {
    1: { title: "Dados pessoais", sub: "Preencha suas informações básicas" },
    2: { title: "Departamento", sub: "Onde você trabalha?" },
    3: { title: "Acesso", sub: "Defina sua senha de acesso" },
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center px-6 pt-12 pb-6 gap-3">
        <button
          onClick={back}
          className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-blue-100 text-xs">Cadastro</p>
          <h1 className="text-white text-lg font-semibold leading-tight">
            {stepTitles[step].title}
          </h1>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-10">
        <ProgressBar step={step} />
        <p className="text-gray-500 text-sm mb-6">{stepTitles[step].sub}</p>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <InputField
              label="Nome completo"
              icon={User}
              placeholder="João da Silva"
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              error={errors.name}
            />
            <InputField
              label="E-mail corporativo"
              icon={Mail}
              type="email"
              placeholder="joao@empresa.com"
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
              error={errors.email}
            />
            <InputField
              label="Telefone"
              icon={Phone}
              type="tel"
              placeholder="(00) 00000-0000"
              value={form.phone}
              onChange={(e) => set("phone")(phoneFormat(e.target.value))}
              error={errors.phone}
            />
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <SelectField
              label="Departamento"
              icon={Building2}
              options={DEPARTMENTS}
              value={form.department}
              onChange={set("department")}
              placeholder="Selecione o departamento"
              error={errors.department}
            />
            <SelectField
              label="Cargo / Função"
              icon={User}
              options={ROLES}
              value={form.role}
              onChange={set("role")}
              placeholder="Selecione o cargo"
              error={errors.role}
            />

            {/* Preview card */}
            {form.department && form.role && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-2">
                <p className="text-xs text-blue-600 font-medium mb-1">
                  Resumo do perfil
                </p>
                <p className="text-sm text-gray-800">
                  {form.name || "Usuário"}
                </p>
                <p className="text-xs text-gray-500">
                  {form.role} · {form.department}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={(e) => set("password")(e.target.value)}
                  className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && strength && (
                <div className="mt-2">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`}
                    />
                  </div>
                  <p
                    className={`text-xs mt-1 ${strength.color.replace("bg-", "text-")}`}
                  >
                    Senha {strength.label}
                  </p>
                </div>
              )}
              <FieldError message={errors.password} />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repita a senha"
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword")(e.target.value)}
                  className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword} />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => set("terms")(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                      form.terms
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {form.terms && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600 leading-snug">
                  Li e aceito os{" "}
                  <span className="text-blue-600 underline">Termos de Uso</span>{" "}
                  e a{" "}
                  <span className="text-blue-600 underline">
                    Política de Privacidade
                  </span>
                </span>
              </label>
              <FieldError message={errors.terms} />
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={next}
          className="w-full bg-blue-600 text-white py-4 rounded-xl text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors mt-8"
        >
          {step === 3 ? "Criar conta" : "Continuar"}
        </button>

        {step === 1 && (
          <p className="text-center text-gray-500 text-sm mt-5">
            Já tem uma conta?{" "}
            <button
              onClick={() => router.push("/")}
              className="text-blue-600 font-medium"
            >
              Entrar
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

const nativeStyles: Record<string, any> = {
  nativeContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 32,
    backgroundColor: "#1d4ed8",
  },
  nativeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  nativeHeaderText: {
    marginLeft: 14,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    color: "#fff",
    fontSize: 20,
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
  nativeCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  progressCircleActive: {
    backgroundColor: "#2563eb",
  },
  progressCircleInactive: {
    backgroundColor: "#e2e8f0",
  },
  progressCircleText: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressCircleTextActive: {
    color: "#fff",
  },
  progressCircleTextInactive: {
    color: "#94a3b8",
  },
  progressLine: {
    width: 36,
    height: 2,
    marginHorizontal: 8,
    borderRadius: 1,
  },
  progressLineActive: {
    backgroundColor: "#2563eb",
  },
  progressLineInactive: {
    backgroundColor: "#e2e8f0",
  },
  sectionSubtitle: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 20,
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
  placeholderText: {
    color: "#94a3b8",
  },
  suffix: {
    marginLeft: 12,
  },
  eyeToggle: {
    color: "#64748b",
    fontSize: 15,
    padding: 4,
  },
  errorText: {
    color: "#ef4444",
    marginTop: 8,
    fontSize: 13,
  },
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
  },
  dropdownOptionText: {
    fontSize: 15,
    color: "#0f172a",
  },
  profileSummary: {
    backgroundColor: "#eff6ff",
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
  },
  summaryTitle: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  summaryName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  summaryRole: {
    fontSize: 13,
    color: "#64748b",
  },
  strengthBarContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  strengthBarBackground: {
    height: 6,
    borderRadius: 6,
    backgroundColor: "#e2e8f0",
    overflow: "hidden",
  },
  strengthBarFill: {
    height: 6,
    borderRadius: 6,
  },
  strengthFull: {
    width: "100%",
    backgroundColor: "#16a34a",
  },
  strengthThreeQuarters: {
    width: "75%",
    backgroundColor: "#f59e0b",
  },
  strengthHalf: {
    width: "50%",
    backgroundColor: "#f59e0b",
  },
  strengthQuarter: {
    width: "25%",
    backgroundColor: "#ef4444",
  },
  strengthLabel: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 12,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  checkboxChecked: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  checkboxIcon: {
    color: "#fff",
    fontSize: 14,
  },
  termsText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
    marginLeft: 12,
  },
  termsLink: {
    color: "#2563eb",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  loginLink: {
    marginTop: 16,
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
  successBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 32,
  },
  nativeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 12,
  },
  nativeDescription: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },
  emailText: {
    color: "#0f172a",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
};
