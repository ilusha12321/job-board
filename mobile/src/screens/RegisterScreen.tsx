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
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../app/AuthNavigator";
import { registerUser } from "../services/authApi";
import { ApiError } from "../services/apiClient";
import { useAuth } from "../app/AuthContext";

export default function RegisterScreen() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"jobseeker" | "employer">("jobseeker");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  async function handleRegister() {
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await registerUser(username, email, password, role);
      setUser(user);
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 409
          ? t("register.userExists")
          : e instanceof ApiError
            ? e.message
            : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView
      className="flex-1 bg-bg dark:bg-slate-950"
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <View className="mx-4 rounded-xl border border-border bg-surface p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <Text className="text-2xl font-bold text-text dark:text-white">
              {t("register.title")}
            </Text>
            <Text className="mt-1 text-sm text-muted dark:text-slate-400">
              {t("register.subtitle")}
            </Text>

            <View className="mt-6 gap-4">
              <View className="gap-1.5">
                <Text className="text-sm font-medium text-text dark:text-white">
                  {t("register.role")}
                </Text>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setRole("jobseeker")}
                    className={`flex-1 items-center rounded-lg border px-3 py-2.5 ${
                      role === "jobseeker"
                        ? "border-primary bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                        : "border-border dark:border-slate-700"
                    }`}
                  >
                    <Text
                      className={
                        role === "jobseeker"
                          ? "font-medium text-primary dark:text-blue-400"
                          : "text-text dark:text-white"
                      }
                    >
                      {t("register.jobseeker")}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setRole("employer")}
                    className={`flex-1 items-center rounded-lg border px-3 py-2.5 ${
                      role === "employer"
                        ? "border-primary bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                        : "border-border dark:border-slate-700"
                    }`}
                  >
                    <Text
                      className={
                        role === "employer"
                          ? "font-medium text-primary dark:text-blue-400"
                          : "text-text dark:text-white"
                      }
                    >
                      {t("register.employer")}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="gap-1.5">
                <Text className="text-sm font-medium text-text dark:text-white">
                  {t("register.username")}
                </Text>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  placeholderTextColor="#94a3b8"
                  className="rounded-lg border border-border px-3 py-2.5 text-sm text-text dark:border-slate-700 dark:text-white"
                />
              </View>

              <View className="gap-1.5">
                <Text className="text-sm font-medium text-text dark:text-white">
                  {t("register.email")}
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#94a3b8"
                  className="rounded-lg border border-border px-3 py-2.5 text-sm text-text dark:border-slate-700 dark:text-white"
                />
              </View>

              <View className="gap-1.5">
                <Text className="text-sm font-medium text-text dark:text-white">
                  {t("register.password")}
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#94a3b8"
                  className="rounded-lg border border-border px-3 py-2.5 text-sm text-text dark:border-slate-700 dark:text-white"
                />
              </View>

              {error && <Text className="text-sm text-danger">{error}</Text>}

              <Pressable
                onPress={handleRegister}
                disabled={isSubmitting}
                className="items-center rounded-lg bg-primary px-4 py-2.5 active:bg-primary-hover disabled:opacity-60"
              >
                <Text className="text-sm font-medium text-white">
                  {isSubmitting
                    ? t("register.submitting")
                    : t("register.submit")}
                </Text>
              </Pressable>
            </View>

            <View className="mt-6 flex-row justify-center gap-1">
              <Text className="text-sm text-muted dark:text-slate-400">
                {t("register.hasAccount")}
              </Text>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text className="text-sm font-medium text-primary dark:text-blue-400">
                  {t("register.login")}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
