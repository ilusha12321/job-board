import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getVacancyById } from "../services/vacancyApi";
import {
  hasApplied,
  applyToVacancy,
  cancelApplication,
} from "../services/applicationApi";
import * as DocumentPicker from "expo-document-picker";
import { type ResumeFile } from "../services/applicationApi";
import { type Vacancy } from "../types/vacancy";
import type { VacanciesStackParamList } from "../app/VacanciesStack";
import { useAuth } from "../app/AuthContext";
import { getErrorMessage } from "../services/apiClient";

type Props = NativeStackScreenProps<VacanciesStackParamList, "VacancyDetails">;

export default function VacancyDetailsScreen({ route }: Props) {
  const { id } = route.params;
  const { user } = useAuth();
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applied, setApplied] = useState<boolean | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<ResumeFile | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const result = await getVacancyById(id);
        if (cancelled) return;
        setVacancy(result);

        if (user?.role === "jobseeker") {
          const appliedResult = await hasApplied(id);
          if (!cancelled) setApplied(appliedResult);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setVacancy(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  async function handlePickResume() {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    if (file.size && file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB");
      return;
    }

    setError(null);
    setResumeFile({
      uri: file.uri,
      name: file.name,
      mimeType: file.mimeType ?? "application/octet-stream",
    });
  }

  async function handleApplyToggle() {
    if (isApplying) return;
    setError(null);
    setIsApplying(true);
    try {
      if (applied) {
        await cancelApplication(id);
        setApplied(false);
      } else {
        await applyToVacancy(id, resumeFile);
        setApplied(true);
        setResumeFile(null);
      }
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setIsApplying(false);
    }
  }
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator />
      </View>
    );
  }

  if (!vacancy) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <Text className="text-muted">Vacancy not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16, gap: 24 }}
    >
      <View className="gap-2">
        <Text className="text-2xl font-bold text-text">{vacancy.title}</Text>
        <Text className="text-lg text-text">{vacancy.company.name}</Text>
        <Text className="text-xl font-semibold text-text">
          {vacancy.salary ? vacancy.salary : "Salary is hidden"}
        </Text>
        <Text className="text-sm text-muted">
          {vacancy.location} · {vacancy.type}
        </Text>

        {error && <Text className="text-sm text-danger">{error}</Text>}

        {user?.role === "jobseeker" && (
          <View className="mt-2 gap-3">
            {!applied && (
              <View className="gap-1.5">
                <Pressable
                  onPress={handlePickResume}
                  className="items-start rounded-lg border border-border bg-surface px-4 py-2.5"
                >
                  <Text className="text-sm font-medium text-text">
                    {resumeFile ? "Change file" : "Attach resume (optional)"}
                  </Text>
                </Pressable>
                {resumeFile && (
                  <Text className="text-sm text-muted">{resumeFile.name}</Text>
                )}
              </View>
            )}

            <Pressable
              onPress={handleApplyToggle}
              disabled={isApplying || applied === null}
              className={`items-center rounded-lg px-5 py-2.5 disabled:opacity-60 ${
                applied ? "bg-slate-700" : "bg-primary"
              }`}
            >
              <Text className="text-sm font-medium text-white">
                {isApplying
                  ? "Please wait..."
                  : applied
                    ? "Cancel application"
                    : "Apply"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      <View className="gap-3 border-t border-border pt-6">
        <Text className="text-lg font-semibold text-text">
          About the vacancy
        </Text>
        <Text className="text-base leading-relaxed text-text">
          {vacancy.description
            ? vacancy.description
            : "There is no description."}
        </Text>
      </View>

      <View className="gap-3 border-t border-border pt-6">
        <Text className="text-lg font-semibold text-text">
          About the company
        </Text>
        <Text className="text-base leading-relaxed text-text">
          {vacancy.company.description
            ? vacancy.company.description
            : "There is no description."}
        </Text>
        <View className="gap-1">
          {vacancy.company.contactEmail ? (
            <Text className="text-sm text-muted">
              {vacancy.company.contactEmail}
            </Text>
          ) : null}
          {vacancy.company.contactPhone ? (
            <Text className="text-sm text-muted">
              {vacancy.company.contactPhone}
            </Text>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}
