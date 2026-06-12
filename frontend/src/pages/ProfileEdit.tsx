// app/profile/edit.tsx
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuthenticatedUser } from '@/hooks/context/UserContext';
import { useCargos } from '@/hooks/useLists';
import { useProfile } from '@/hooks/useProfile';


export default function EditProfile() {
    const router = useRouter();
    const { cargos, loading: loadingCargos } = useCargos();
    const { atualizarUsuario } = useProfile();
    const { user } = useAuthenticatedUser();

    // Estados do formulário
    const [nome, setNome] = useState(user?.nome || '');
    const [email, setEmail] = useState(user?.email || '');
    const [telefone, setTelefone] = useState(user?.telefone || '');
    const [selectedCargo, setSelectedCargo] = useState<{ id: number; nome: string } | null>(
        user ? { id: user.idCargo, nome: user.nomeCargo } : null
    );
    const [showCargos, setShowCargos] = useState(false);
    const [loading, setLoading] = useState(false);

    // Erros
    const [nomeError, setNomeError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [telefoneError, setTelefoneError] = useState('');

    const cargosNomes = Array.isArray(cargos) ? cargos.map(c => c.nome) : [];

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        if (digits.length <= 2) return digits;
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    };

    const handleCargoSelect = (cargoNome: string) => {
        const cargoEncontrado = cargos.find(c => c.nome === cargoNome);
        if (cargoEncontrado) {
            setSelectedCargo(cargoEncontrado);
            setShowCargos(false);
        }
    };

    const validate = (): boolean => {
        let valid = true;

        if (!nome.trim()) {
            setNomeError('Nome é obrigatório');
            valid = false;
        } else if (nome.trim().split(' ').length < 2) {
            setNomeError('Informe nome e sobrenome');
            valid = false;
        } else {
            setNomeError('');
        }

        if (!email.trim()) {
            setEmailError('Email é obrigatório');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Email inválido');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!telefone.trim()) {
            setTelefoneError('Telefone é obrigatório');
            valid = false;
        } else if (telefone.replace(/\D/g, '').length < 10) {
            setTelefoneError('Telefone inválido');
            valid = false;
        } else {
            setTelefoneError('');
        }

        return valid;
    };

    const handleSave = async () => {
        if (!validate()) return;
        if (!selectedCargo) {
            Alert.alert('Erro', 'Selecione um cargo');
            return;
        }

        setLoading(true);

        try {
            const dados = {
                nome: nome.trim(),
                email: email.trim(),
                telefone: telefone.replace(/\D/g, ''),
                idCargo: selectedCargo.id,
            };

            const response = await atualizarUsuario(dados, user.id);

            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
                { text: 'OK', onPress: () => router.back() }
            ]);

        } catch (error: any) {
            console.log(error)
            const mensagem = error.message || 'Erro ao atualizar perfil';
            Alert.alert('Erro', mensagem);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior='padding'
            keyboardVerticalOffset={20}
        >
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Perfil</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {nome?.charAt(0)?.toUpperCase() || 'U'}
                        </Text>
                    </View>
                </View>

                {/* Formulário */}
                <View style={styles.formCard}>
                    {/* Nome */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Nome completo</Text>
                        <View style={[styles.inputRow, nomeError && styles.inputError]}>
                            <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                            <TextInput
                                value={nome}
                                onChangeText={(v) => { setNome(v); setNomeError(''); }}
                                style={styles.input}
                                placeholder="Seu nome completo"
                                placeholderTextColor="#94a3b8"
                                autoCapitalize="words"
                            />
                        </View>
                        {nomeError ? <Text style={styles.errorText}>{nomeError}</Text> : null}
                    </View>

                    {/* Email */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Email</Text>
                        <View style={[styles.inputRow, emailError && styles.inputError]}>
                            <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                            <TextInput
                                value={email}
                                onChangeText={(v) => { setEmail(v); setEmailError(''); }}
                                style={styles.input}
                                placeholder="seu@email.com"
                                placeholderTextColor="#94a3b8"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    </View>

                    {/* Telefone */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Telefone</Text>
                        <View style={[styles.inputRow, telefoneError && styles.inputError]}>
                            <Ionicons name="call-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                            <TextInput
                                value={telefone}
                                onChangeText={(v) => { setTelefone(formatPhone(v)); setTelefoneError(''); }}
                                style={styles.input}
                                placeholder="(00) 00000-0000"
                                placeholderTextColor="#94a3b8"
                                keyboardType="phone-pad"
                            />
                        </View>
                        {telefoneError ? <Text style={styles.errorText}>{telefoneError}</Text> : null}
                    </View>

                    {/* Cargo */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Cargo</Text>
                        <TouchableOpacity
                            style={styles.inputRow}
                            onPress={() => setShowCargos(!showCargos)}
                        >
                            <Ionicons name="briefcase-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                            <Text style={[styles.input, !selectedCargo && { color: '#94a3b8' }]}>
                                {selectedCargo?.nome || (loadingCargos ? 'Carregando...' : 'Selecione um cargo')}
                            </Text>
                            <Ionicons name={showCargos ? "chevron-up" : "chevron-down"} size={16} color="#94a3b8" />
                        </TouchableOpacity>

                        {showCargos && (
                            <View style={styles.dropdown}>
                                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                                    {cargosNomes.map((cargoNome) => (
                                        <TouchableOpacity
                                            key={cargoNome}
                                            style={[
                                                styles.dropdownOption,
                                                selectedCargo?.nome === cargoNome && styles.dropdownOptionActive,
                                            ]}
                                            onPress={() => handleCargoSelect(cargoNome)}
                                        >
                                            <Text style={[
                                                styles.dropdownOptionText,
                                                selectedCargo?.nome === cargoNome && styles.dropdownOptionTextActive,
                                            ]}>
                                                {cargoNome}
                                            </Text>
                                            {selectedCargo?.nome === cargoNome && (
                                                <Ionicons name="checkmark" size={20} color="#2563eb" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>
                </View>

                {/* Botões */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" size="small" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.back()}
                        disabled={loading}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
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
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    // Header
    header: {
        backgroundColor: '#2563eb',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    // Avatar
    avatarContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#2563eb',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#ffffff',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: '700',
        color: '#ffffff',
    },
    // Form
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    field: {
        marginBottom: 20,
        position: 'relative',
        zIndex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 52,
    },
    inputError: {
        borderColor: '#ef4444',
        backgroundColor: '#fef2f2',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#0f172a',
        fontSize: 15,
        height: 52,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 6,
        fontWeight: '500',
    },
    // Dropdown
    dropdown: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 14,
        marginTop: 8,
        maxHeight: 200,
        overflow: 'hidden',
    },
    dropdownScroll: {
        maxHeight: 200,
    },
    dropdownOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    dropdownOptionActive: {
        backgroundColor: '#eff6ff',
        alignItems: 'center',
    },
    dropdownOptionText: {
        fontSize: 15,
        color: '#374151',
        flex: 1,
        textAlignVertical: 'center',
    },
    dropdownOptionTextActive: {
        color: '#2563eb',
        fontWeight: '600',
        alignItems: 'center',
    },
    // Botões
    buttonsContainer: {
        paddingHorizontal: 20,
        marginTop: 24,
        gap: 12,
    },
    saveButton: {
        backgroundColor: '#2563eb',
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    cancelButton: {
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        marginBottom: 10
    },
    cancelButtonText: {
        color: '#64748b',
        fontSize: 15,
        fontWeight: '600',
    },
});