export const VACANCY_TYPES = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Internship",
] as const;

export const TYPE_LABEL_KEYS: Record<(typeof VACANCY_TYPES)[number], string> = {
  "Full-Time": "vacancies.fullTime",
  "Part-Time": "vacancies.partTime",
  Contract: "vacancies.contract",
  Internship: "vacancies.internship",
};

export function getTypeLabelKey(type: string): string {
  return TYPE_LABEL_KEYS[type as (typeof VACANCY_TYPES)[number]] ?? type;
}
