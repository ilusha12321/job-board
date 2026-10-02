import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../app/AuthContext";
import { useTheme } from "../app/ThemeContext";

export default function AppHeader() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <View className="flex-row items-center justify-between border-b border-border bg-surface px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
      <Text className="text-xl font-bold tracking-tight">
        <Text className="text-text dark:text-white">hard</Text>
        <Text className="text-primary">work</Text>
      </Text>

      <View className="flex-row items-center gap-3">
        {user && (
          <Text className="text-sm text-muted dark:text-slate-400">
            {user.username}
          </Text>
        )}

        <Pressable
          onPress={toggleTheme}
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-800"
        >
          <Ionicons
            name={isDark ? "sunny-outline" : "moon-outline"}
            size={18}
            color={isDark ? "#ffffff" : "#0f172a"}
          />
        </Pressable>

        <Pressable
          onPress={logout}
          className="rounded-md border border-border bg-surface px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800"
        >
          <Text className="text-sm font-medium text-text dark:text-white">
            Logout
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
