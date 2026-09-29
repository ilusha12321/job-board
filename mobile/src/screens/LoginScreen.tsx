import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { loginUser } from "../services/authApi";
import { ApiError } from "../services/apiClient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../app/AuthContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../app/AuthNavigator";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  async function handleLogin() {
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await loginUser(username, password);
      setUser(user);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <View className="mx-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
            <Text className="text-2xl font-bold text-text">Login</Text>
            <Text className="mt-1 text-sm text-muted">
              Sign in to your hardwork account
            </Text>

            <View className="mt-6 gap-4">
              <View className="gap-1.5">
                <Text className="text-sm font-medium text-text">Username</Text>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  className="rounded-lg border border-border px-3 py-2.5 text-sm text-text"
                />
              </View>

              <View className="gap-1.5">
                <Text className="text-sm font-medium text-text">Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  className="rounded-lg border border-border px-3 py-2.5 text-sm text-text"
                />
              </View>

              {error && <Text className="text-sm text-danger">{error}</Text>}

              <View className="mt-1 flex-row justify-center gap-1">
                <Text className="text-sm text-muted">
                  Don't have an account?
                </Text>
                <Pressable onPress={() => navigation.navigate("Register")}>
                  <Text className="text-sm font-medium text-primary">
                    Register
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={handleLogin}
                disabled={isSubmitting}
                className="items-center rounded-lg bg-primary px-4 py-2.5 active:bg-primary-hover disabled:opacity-60"
              >
                <Text className="text-sm font-medium text-white">
                  {isSubmitting ? "Logging in..." : "Login"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
