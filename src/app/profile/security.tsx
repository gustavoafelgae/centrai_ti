import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronRight,
  Fingerprint,
  KeyRound,
  MonitorSmartphone,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SecurityScreen() {
  const router = useRouter();

  // Estados para os "interruptores" de configuração
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(true);

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
        <Text style={styles.title}>Privacidade e Segurança</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        {/* Seção 1: Segurança da Conta */}
        <Text style={styles.sectionTitle}>Segurança da Conta</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
                <KeyRound size={20} color='#2563eb' />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Alterar Senha</Text>
                <Text style={styles.menuItemSubtitle}>
                  Última alteração há 3 meses
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color='#cbd5e1' />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#f0fdf4' }]}>
                <ShieldCheck size={20} color='#16a34a' />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>
                  Autenticação em 2 Fatores
                </Text>
                <Text style={styles.menuItemSubtitle}>
                  Mais segurança para o login
                </Text>
              </View>
            </View>
            <Switch
              value={is2FAEnabled}
              onValueChange={setIs2FAEnabled}
              trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
              thumbColor={'#ffffff'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#f3e8ff' }]}>
                <Fingerprint size={20} color='#9333ea' />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Login Biométrico</Text>
                <Text style={styles.menuItemSubtitle}>
                  Usar Face ID / Touch ID
                </Text>
              </View>
            </View>
            <Switch
              value={isBiometricEnabled}
              onValueChange={setIsBiometricEnabled}
              trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
              thumbColor={'#ffffff'}
            />
          </View>
        </View>

        {/* Seção 2: Dispositivos */}
        <Text style={styles.sectionTitle}>Dispositivos e Sessões</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#f8fafc' }]}>
                <MonitorSmartphone size={20} color='#475569' />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Sessões Ativas</Text>
                <Text style={styles.menuItemSubtitle}>
                  2 dispositivos conectados
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color='#cbd5e1' />
          </TouchableOpacity>
        </View>

        {/* Seção 3: Privacidade */}
        <Text style={styles.sectionTitle}>Privacidade de Dados</Text>
        <View style={styles.card}>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#fff7ed' }]}>
                <ShieldAlert size={20} color='#ea580c' />
              </View>
              <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={styles.menuItemTitle}>Análise de Dados</Text>
                <Text style={styles.menuItemSubtitle}>
                  Compartilhar dados de uso anonimamente para melhorar o app
                </Text>
              </View>
            </View>
            <Switch
              value={isAnalyticsEnabled}
              onValueChange={setIsAnalyticsEnabled}
              trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
              thumbColor={'#ffffff'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 72, // Alinha a linha divisória com o texto, ignorando o ícone
  },
});
