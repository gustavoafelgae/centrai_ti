import { useRouter } from "expo-router";
import React from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export type RouteAction = { label: string; path: string };

interface NativeRouteFallbackProps {
  web: React.ReactNode;
  title: string;
  description?: string;
  actions?: RouteAction[];
  children?: React.ReactNode;
}

export function NativeRouteFallback({
  web,
  title,
  description,
  actions = [],
  children,
}: NativeRouteFallbackProps) {
  if (Platform.OS === "web") {
    return <>{web}</>;
  }

  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
        {children}
        <View style={styles.actions}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.path}
              onPress={() => router.push(action.path as any)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#0f172a",
    minHeight: "100%",
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
  },
  description: {
    color: "#cbd5e1",
    marginBottom: 16,
    lineHeight: 22,
  },
  actions: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
});
