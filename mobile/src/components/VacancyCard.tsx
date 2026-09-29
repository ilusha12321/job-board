import { View, Text, Pressable } from "react-native";
import { type Vacancy } from "../types/vacancy";

type Props = {
  vacancy: Vacancy;
  onPress?: () => void;
};

export default function VacancyCard({ vacancy, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl border border-border bg-surface p-5 active:border-blue-200"
    >
      <Text className="text-lg font-semibold text-text">{vacancy.title}</Text>
      <Text className="mt-1 text-sm text-muted">{vacancy.company.name}</Text>

      <View className="mt-3 flex-row flex-wrap items-center gap-2">
        <Text className="text-sm text-muted">{vacancy.location}</Text>
        <View className="rounded-full bg-blue-50 px-2.5 py-0.5">
          <Text className="text-xs font-medium text-primary">
            {vacancy.type}
          </Text>
        </View>
      </View>

      <Text className="mt-3 text-sm font-medium text-success">
        {vacancy.salary ? vacancy.salary : "Salary is hidden"}
      </Text>
    </Pressable>
  );
}
