import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  LifeBuoy,
  Mail,
  MessageSquare,
  Phone,
} from 'lucide-react-native';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SupportScreen() {
  const router = useRouter();

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
        <Text style={styles.title}>Ajuda e Suporte</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        {/* Banner de Ajuda */}
        <View style={styles.banner}>
          <View style={styles.bannerIconBox}>
            <LifeBuoy size={28} color='#2563eb' />
          </View>
          <Text style={styles.bannerTitle}>Como podemos ajudar?</Text>
          <Text style={styles.bannerSubtitle}>
            Nossa equipe de suporte técnico está disponível 24/7 para resolver
            seus problemas.
          </Text>
        </View>

        {/* Seção 1: Fale Conosco */}
        <Text style={styles.sectionTitle}>Fale Conosco</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#dcfce7' }]}>
                <MessageSquare size={20} color='#16a34a' />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Chat ao vivo</Text>
                <Text style={styles.menuItemSubtitle}>
                  Tempo de resposta: ~5 min
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color='#cbd5e1' />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
                <Mail size={20} color='#2563eb' />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>E-mail de Suporte</Text>
                <Text style={styles.menuItemSubtitle}>
                  suporte@empresa.com.br
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color='#cbd5e1' />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#f3e8ff' }]}>
                <Phone size={20} color='#9333ea' />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Telefone (0800)</Text>
                <Text style={styles.menuItemSubtitle}>0800 123 4567</Text>
              </View>
            </View>
            <ChevronRight size={20} color='#cbd5e1' />
          </TouchableOpacity>
        </View>

        {/* Seção 2: Dúvidas Frequentes (FAQ) */}
        <Text style={styles.sectionTitle}>Dúvidas Frequentes</Text>
        <View style={styles.card}>
          {[
            'Como abrir um novo ticket?',
            'Qual é o SLA padrão de atendimento?',
            'Como acompanhar o status do meu serviço?',
            'Esqueci minha senha, e agora?',
          ].map((question, index, array) => (
            <View key={index}>
              <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
                <Text style={styles.faqText}>{question}</Text>
                <ChevronRight size={18} color='#cbd5e1' />
              </TouchableOpacity>
              {index < array.length - 1 && <View style={styles.dividerFAQ} />}
            </View>
          ))}
        </View>

        {/* Seção 3: Legal e Documentação */}
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#f1f5f9' }]}>
                <FileText size={20} color='#475569' />
              </View>
              <Text style={styles.menuItemTitle}>Termos de Uso</Text>
            </View>
            <ChevronRight size={20} color='#cbd5e1' />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#f1f5f9' }]}>
                <FileText size={20} color='#475569' />
              </View>
              <Text style={styles.menuItemTitle}>Política de Privacidade</Text>
            </View>
            <ChevronRight size={20} color='#cbd5e1' />
          </TouchableOpacity>
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
  banner: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  bannerIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2563eb',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#3b82f6',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 12,
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
    marginLeft: 72,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  faqText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    flex: 1,
    paddingRight: 16,
  },
  dividerFAQ: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 16,
  },
});
