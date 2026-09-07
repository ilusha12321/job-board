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
    <>
      {displayNumber && <div>{displayNumber}</div>}
      <div>{vacancy.title}</div>
      <div>{vacancy.type}</div>
      <div>{vacancy.location}</div>
      <div>
        {vacancy.description ? vacancy.description : "There is no description."}
      </div>
      <div>{vacancy.salary ? vacancy.salary : "Salary is hidden"}</div>
      <div>{vacancy.company.name}</div>
      <div>{vacancy.company.contactPhone}</div>
      <div>{vacancy.company.contactEmail}</div>
      <div>
        {vacancy.company.description
          ? vacancy.company.description
          : "There is no description."}
      </div>
    </>
  );
  return (
    <>
      {isClickable ? (
        <Link to={`/vacancies/${vacancy.id}`}>{cardContext}</Link>
      ) : (
        <>{cardContext}</>
      )}
    </>
  );
};
export default VacancyCard;
