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
import { useTranslation } from "react-i18next";
import { VACANCY_TYPES, TYPE_LABEL_KEYS } from "../i18n/vacancyTypes";
import { useHeaderHeight } from "@react-navigation/elements";
import { type Vacancy } from "../types/vacancy";

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

  const headerHeight = useHeaderHeight();
  const { t } = useTranslation();
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
    "rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text dark:border-slate-700 dark:bg-slate-800 dark:text-white";
  const labelClass = "text-sm font-medium text-text dark:text-white";
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight}
      className="flex-1 bg-bg dark:bg-slate-950"
    >
      <ScrollView
        className="flex-1 bg-bg dark:bg-slate-950"
        contentContainerStyle={{ padding: 16, gap: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-4">
          <Text className="text-lg font-semibold text-text dark:text-white">
            {t("vacancyForm.sectionDetails")}
          </Text>

          <View className="gap-1.5">
            <Text className={labelClass}>{t("vacancyForm.titleLabel")}</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              className={inputClass}
            />
          </View>

          <View className="gap-1.5">
            <Text className={labelClass}>{t("vacancyForm.typeLabel")}</Text>
            <View className="flex-row flex-wrap gap-2">
              {VACANCY_TYPES.map((vacType) => (
                <Pressable
                  key={vacType}
                  onPress={() => setType(vacType)}
                  className={`rounded-lg border px-3 py-2 ${
                    type === vacType
                      ? "border-primary bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                      : "border-border dark:border-slate-700"
                  }`}
                >
                  <Text
                    className={
                      type === vacType
                        ? "font-medium text-primary dark:text-blue-400"
                        : "text-text dark:text-white"
                    }
                  >
                    {t(TYPE_LABEL_KEYS[vacType])}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="gap-1.5">
            <Text className={labelClass}>{t("vacancyForm.locationLabel")}</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              className={inputClass}
            />
          </View>

          <View className="gap-1.5">
            <Text className={labelClass}>{t("vacancyForm.salaryLabel")}</Text>
            <TextInput
              value={salary}
              onChangeText={setSalary}
              placeholder={t("vacancyForm.salaryPlaceholder")}
              placeholderTextColor="#94a3b8"
              className={inputClass}
            />
          </View>

          <View className="gap-1.5">
            <Text className={labelClass}>
              {t("vacancyForm.descriptionLabel")}
            </Text>
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

        <View className="gap-4 border-t border-border pt-6 dark:border-slate-700">
          <Text className="text-lg font-semibold text-text dark:text-white">
            {t("vacancyForm.sectionCompany")}
          </Text>

          <View className="gap-1.5">
            <Text className={labelClass}>
              {t("vacancyForm.companyNameLabel")}
            </Text>
            <TextInput
              value={companyName}
              onChangeText={setCompanyName}
              className={inputClass}
            />
          </View>

          <View className="gap-1.5">
            <Text className={labelClass}>
              {t("vacancyForm.companyDescriptionLabel")}
            </Text>
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
            <Text className={labelClass}>
              {t("vacancyForm.companyEmailLabel")}
            </Text>
            <TextInput
              value={companyEmail}
              onChangeText={setCompanyEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className={inputClass}
            />
          </View>

          <View className="gap-1.5">
            <Text className={labelClass}>
              {t("vacancyForm.companyPhoneLabel")}
            </Text>
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
