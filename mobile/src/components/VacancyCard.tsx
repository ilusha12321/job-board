import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { type Vacancy } from "../types/vacancy";
import { getTypeLabelKey } from "../i18n/vacancyTypes";

type Props = {
  vacancy: Vacancy;
  onPress?: () => void;
};

export default function VacancyCard({ vacancy, onPress }: Props) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl border border-border bg-surface p-5 active:border-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:active:border-slate-600"
    >
      <Text className="text-lg font-semibold text-text dark:text-white">
        {vacancy.title}
      </Text>
      <Text className="mt-1 text-sm text-muted dark:text-slate-400">
        {vacancy.company.name}
      </Text>

      <View className="mt-3 flex-row flex-wrap items-center gap-2">
        <Text className="text-sm text-muted dark:text-slate-400">
          {vacancy.location}
        </Text>
        <View className="rounded-full bg-blue-50 px-2.5 py-0.5 dark:bg-blue-950">
          <Text className="text-xs font-medium text-primary dark:text-blue-400">
            {t(getTypeLabelKey(vacancy.type))}
          </Text>
        </View>
      </View>

      <Text className="mt-3 text-sm font-medium text-success dark:text-green-400">
        {vacancy.salary ? vacancy.salary : t("vacancies.salaryHidden")}
      </Text>
    </Pressable>
  );
}
