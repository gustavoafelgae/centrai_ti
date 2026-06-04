import { useRouter } from 'expo-router';
import {
  Bell,
  Briefcase,
  Building2,
  ChevronRight,
  HelpCircle,
  Home,
  LogOut,
  Mail,
  Phone,
  Shield,
  Ticket as TicketIcon,
  User,
} from 'lucide-react-native';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Colors, Spacing, BottomTabInset } from '../constants/theme';
import { Profile } from '../pages/Profile';
// Importando o nosso contexto de usuário
import { useUser } from '../hooks/UserContext';

const navItems = [
  { label: 'Início', path: '/dashboard', icon: Home },
  { label: 'Serviços', path: '/services', icon: Briefcase },
  { label: 'Tickets', path: '/tickets', icon: TicketIcon },
  { label: 'Perfil', path: '/profile', icon: User },
];

function NativeProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const horizontalPadding = width > 700 ? Spacing.three : Spacing.two;
  const cardMargin = width > 700 ? Spacing.three : Spacing.two;
  // Trazendo os dados globais do usuário
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: horizontalPadding },
        ]}
        bounces={false}
      >
        {/* Cabeçalho Azul */}
        <View style={styles.blueHeader}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <Text style={styles.headerSubtitle}>Gerencie suas informações</Text>
        </View>

        {/* Cartão de Perfil Principal */}
        <View style={[styles.profileCard, { marginHorizontal: cardMargin }]}> 
          <View style={styles.userInfoRow}>
            <View style={styles.avatarContainer}>
              <User size={32} color='#2563eb' strokeWidth={2} />
            </View>
            <View style={styles.userDetails}>
              {/* Nome e Plano dinâmicos */}
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>Plano {user.plan}</Text>
              </View>
            </View>
          </View>

          <View style={styles.contactInfo}>
            {/* Contatos dinâmicos */}
            <View style={styles.infoRow}>
              <Mail size={18} color='#94a3b8' />
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Phone size={18} color='#94a3b8' />
              <Text style={styles.infoText}>{user.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Building2 size={18} color='#94a3b8' />
              <Text style={styles.infoText}>{user.company}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.7}
            onPress={() => router.push('/profile/edit' as any)}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Menu de Opções */}
        <View style={[styles.menuCard, { marginHorizontal: cardMargin }]}> 
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/profile/notifications' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Bell size={22} color='#475569' />
              <Text style={styles.menuItemText}>Notificações</Text>
            </View>
            <View style={styles.menuItemRight}>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
              <ChevronRight size={20} color='#cbd5e1' />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/profile/security' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Shield size={22} color='#475569' />
              <Text style={styles.menuItemText}>Privacidade e Segurança</Text>
            </View>
            <ChevronRight size={20} color='#cbd5e1' />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/profile/support' as any)}
          >
            <View style={styles.menuItemLeft}>
              <HelpCircle size={22} color='#475569' />
              <Text style={styles.menuItemText}>Ajuda e Suporte</Text>
            </View>
            <ChevronRight size={20} color='#cbd5e1' />
          </TouchableOpacity>
        </View>

        {/* Botão Sair */}
        <TouchableOpacity
          style={[styles.logoutButton, { marginHorizontal: cardMargin }]}
          activeOpacity={0.7}
          onPress={() => router.replace('/')}
        >
          <LogOut size={20} color='#dc2626' />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Rodapé de Navegação */}
      <View style={styles.navbar}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = item.label === 'Perfil';

          return (
            <TouchableOpacity
              key={item.path}
              onPress={() => router.push(item.path as any)}
              style={styles.navButton}
            >
              <Icon
                size={24}
                color={isActive ? '#2563eb' : '#64748b'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text
                style={[
                  styles.navButtonText,
                  isActive && styles.navButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function ProfilePage() {
  if (Platform.OS === 'web') {
    return <Profile />;
  }

  return <NativeProfileScreen />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  scrollContent: { paddingBottom: BottomTabInset + 20 },
  blueHeader: {
    backgroundColor: '#2563eb',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 60,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: { fontSize: 15, color: '#bfdbfe' },
  profileCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 20,
    marginTop: -40,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: { justifyContent: 'center' },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  planBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  planBadgeText: { fontSize: 12, fontWeight: '600', color: '#4338ca' },
  contactInfo: { gap: 12, marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 14, color: '#475569', marginLeft: 12 },
  editButton: {
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    marginTop: 8,
  },
  editButtonText: { fontSize: 14, fontWeight: '600', color: '#2563eb' },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 16,
  },
  menuItemRight: { flexDirection: 'row', alignItems: 'center' },
  notificationBadge: {
    backgroundColor: '#ef4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationBadgeText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginHorizontal: 20 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 8,
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingVertical: Platform.OS === 'ios' ? 20 : 12,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: { alignItems: 'center', justifyContent: 'center', minWidth: 64 },
  navButtonText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  navButtonTextActive: { color: '#2563eb' },
});
