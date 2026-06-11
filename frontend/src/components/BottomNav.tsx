// src/components/BottomNav.tsx (com badge)
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
    { 
      name: "Início", 
      path: "/home", 
      icon: "home" as const, 
      iconActive: "home" as const,
      badge: 0,
    },
    { 
      name: "Serviços", 
      path: "/services", 
      icon: "briefcase-outline" as const, 
      iconActive: "briefcase" as const,
      badge: 0,
    },
    { 
      name: "Tickets", 
      path: "/tickets", 
      icon: "ticket-outline" as const, 
      iconActive: "ticket" as const,
      badge: 3, // Exemplo de badge
    },
    { 
      name: "Perfil", 
      path: "/profile", 
      icon: "person-outline" as const, 
      iconActive: "person" as const,
      badge: 0,
    },
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
        const iconName = active ? item.iconActive : item.icon;

        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navButton}
            onPress={() => router.push(item.path as any)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={iconName}
                size={24}
                color={active ? "#2563eb" : "#94a3b8"}
              />
              {item.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.badge > 99 ? "99+" : item.badge}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.navText,
                active && styles.navTextActive,
              ]}
            >
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
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    paddingHorizontal: 8,
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 4,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  navText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
  },
  navTextActive: {
    color: "#2563eb",
    fontWeight: "700",
  },
});