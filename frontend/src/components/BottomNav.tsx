// src/components/BottomNav.tsx
import { usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Início", path: "/home", icon: "home" as keyof typeof Ionicons.glyphMap },
    { name: "Serviços", path: "/servicos", icon: "briefcase" as keyof typeof Ionicons.glyphMap },
    { name: "Tickets", path: "/tickets", icon: "ticket" as keyof typeof Ionicons.glyphMap },
    { name: "Perfil", path: "/profile", icon: "person" as keyof typeof Ionicons.glyphMap },
  ];

  const isActive = (path: string) => {
    if (path === "/home" && (pathname === "/home" || pathname === "/")) return true;
    if (pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const active = isActive(item.path);

        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navButton}
            onPress={() => router.push(item.path as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={active ? "#2563eb" : "#94a3b8"}
            />
            <Text style={[styles.navText, active && styles.navTextActive]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingVertical: Platform.OS === "ios" ? 20 : 10,
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === "ios" ? 30 : 50,
    justifyContent: "space-around",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  navText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
    marginTop: 4,
  },
  navTextActive: {
    color: "#2563eb",
    fontWeight: "700",
  },
});