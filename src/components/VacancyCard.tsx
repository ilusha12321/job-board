import { type Vacancy } from "../types/vacancy";
import { Link } from "react-router-dom";

type VacancyCardProp = {
  vacancy: Vacancy;
  isClickable?: boolean;
  displayNumber?: number;
};

const VacancyCard = ({
  vacancy,
  isClickable = false,
  displayNumber,
}: VacancyCardProp) => {
  const cardContext = (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      {displayNumber !== undefined && (
        <div className="mb-2 text-xs font-medium text-slate-400">
          #{displayNumber}
        </div>
      )}

      <div className="text-lg font-semibold text-slate-900">
        {vacancy.title}
      </div>

      <div className="mt-1 text-sm text-slate-600">{vacancy.company.name}</div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span>{vacancy.location}</span>
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {vacancy.type}
        </span>
      </div>

      <div className="mt-3 text-sm font-medium text-green-600">
        {vacancy.salary ? vacancy.salary : "Salary is hidden"}
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <Link to={`/vacancies/${vacancy.id}`} className="block">
        {cardContext}
      </Link>
    );
  }

  return cardContext;
};

export default VacancyCard;
