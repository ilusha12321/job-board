import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { type Vacancy } from "../types/vacancy";

const VACANCY_TYPES = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Internship",
] as const;

type VacancyFormProps = {
  onSubmit: (data: Omit<Vacancy, "id" | "createdBy">) => void;
  submitLabel: string;
  error?: string | null;
  isSubmitting?: boolean;
  initialData?: Vacancy | null;
};

export default function VacancyForm({
  onSubmit,
  submitLabel,
  error,
  isSubmitting,
  initialData,
}: VacancyFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [type, setType] = useState<(typeof VACANCY_TYPES)[number]>(
    (initialData?.type as (typeof VACANCY_TYPES)[number]) ?? "Full-Time",
  );
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [salary, setSalary] = useState(initialData?.salary ?? "");
  const [companyName, setCompanyName] = useState(
    initialData?.company.name ?? "",
  );
  const [companyDescription, setCompanyDescription] = useState(
    initialData?.company.description ?? "",
  );
  const [companyEmail, setCompanyEmail] = useState(
    initialData?.company.contactEmail ?? "",
  );
  const [companyPhone, setCompanyPhone] = useState(
    initialData?.company.contactPhone ?? "",
  );

  function handleSubmit() {
    onSubmit({
      title,
      type,
      location,
      description,
      salary,
      company: {
        name: companyName,
        description: companyDescription,
        contactEmail: companyEmail,
        contactPhone: companyPhone,
      },
    });
  }

  const inputClass =
    "rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text";
  const labelClass = "text-sm font-medium text-text";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-bg"
        contentContainerStyle={{ padding: 16, gap: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-4">
          <Text className="text-lg font-semibold text-text">
            Vacancy details
          </Text>

          <View className="gap-1.5">
            <Text className={labelClass}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              className={inputClass}
            />
          </View>

          <View className="gap-1.5">
            <Text className={labelClass}>Type</Text>
            <View className="flex-row flex-wrap gap-2">
              {VACANCY_TYPES.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setType(t)}
                  className={`rounded-lg border px-3 py-2 ${
                    type === t ? "border-primary bg-blue-50" : "border-border"
                  }`}
                >
                  <Text
                    className={
                      type === t ? "font-medium text-primary" : "text-text"
                    }
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="gap-1.5">
            <Text className={labelClass}>Location</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              className={inputClass}
            />
          </View>

          <View className="gap-1.5">
            <Text className={labelClass}>Salary</Text>
            <TextInput
              value={salary}
              onChangeText={setSalary}
              placeholder="e.g. $1200–1600"
              className={inputClass}
            />
          </View>

          <View className="gap-1.5">
            <Text className={labelClass}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              className={`${inputClass} min-h-32`}
            />
          </View>
        </View>

        <View className="gap-4 border-t border-border pt-6">
          <Text className="text-lg font-semibold text-text">
            Company information
          </Text>

          <View className="gap-1.5">
            <Text className={labelClass}>Company name</Text>
            <TextInput
              value={companyName}
              onChangeText={setCompanyName}
              className={inputClass}
            />
          </View>

          <View className="gap-1.5">
            <Text className={labelClass}>Company description</Text>
            <TextInput
              value={companyDescription}
              onChangeText={setCompanyDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className={`${inputClass} min-h-24`}
            />
          </View>

          <View className="gap-1.5">
            <Text className={labelClass}>Contact email</Text>
            <TextInput
              value={companyEmail}
              onChangeText={setCompanyEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className={inputClass}
            />
          </View>

          <View className="gap-1.5">
            <Text className={labelClass}>Contact phone</Text>
            <TextInput
              value={companyPhone}
              onChangeText={setCompanyPhone}
              keyboardType="phone-pad"
              className={inputClass}
            />
          </View>
        </View>

        {error && <Text className="text-sm text-danger">{error}</Text>}

        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          className="items-center rounded-lg bg-primary px-5 py-2.5 disabled:opacity-60"
        >
          <Text className="text-sm font-medium text-white">{submitLabel}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
