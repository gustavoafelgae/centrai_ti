// src/pages/Services.tsx
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useServicos } from "@/hooks/useLists";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

export default function Services() {
  const router = useRouter();
  const { servicos, loading, error, recarregar } = useServicos();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Serviços</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.grid}>
        {servicos.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.card}
            onPress={() => router.push(`/servicos/${service.id}` as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: getColorBg(service.color) }]}>
              <Ionicons name={service.icon} size={24} color={getColorHex(service.color)} />
            </View>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            {service.price && (
              <Text style={styles.price}>{service.price}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

function getColorHex(colorClass: string): string {
  const colorMap: Record<string, string> = {
    'bg-violet-500': '#8b5cf6',
    'bg-purple-500': '#a855f7',
    'bg-blue-500': '#3b82f6',
    'bg-cyan-500': '#06b6d4',
    'bg-green-500': '#22c55e',
    'bg-orange-500': '#f97316',
    'bg-teal-500': '#14b8a6',
    'bg-pink-500': '#ec4899',
    'bg-indigo-500': '#6366f1',
    'bg-red-500': '#ef4444',
    'bg-yellow-500': '#eab308',
  };
  return colorMap[colorClass] || '#6b7280';
}

function getColorBg(colorClass: string): string {
  const hex = getColorHex(colorClass);
  return hex + '15';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
});