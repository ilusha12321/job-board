import VacancyCard from "../components/VacancyCard";
import { useEffect, useState } from "react";
import { type Vacancy } from "../types/vacancy";
import { getVacancies } from "../services/vacancyApi";
import { Link } from "react-router-dom";
import { useAuth } from "../app/AuthContext";

const VacanciesPage = () => {
  const [state, setState] = useState<Vacancy[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  );

  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      const result = await getVacancies();
      if (result === null) {
        setStatus("error");
        return;
      }
      setStatus("success");
      setState(result);
    };
    loadData();
  }, []);

  const filteredVacancies = state.filter(
    (vacancy) =>
      vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === "" || vacancy.type === selectedType),
  );

  return (
    <>
      {user && user.role === "employer" ? (
        <Link to="/create-vacancy">Create vacancy</Link>
      ) : null}
      <label htmlFor="searchTerm">Search by title: </label>
      <input
        id="searchTerm"
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <select
        id="selectedType"
        value={selectedType}
        onChange={(event) => setSelectedType(event.target.value)}
      >
        <option value="">All types</option>
        <option value="Full-Time">Full time</option>
        <option value="Part-Time">Part-Time</option>
        <option value="Contract">Contract</option>
        <option value="Internship">Internship</option>
      </select>
      <h1>Vacantion list</h1>
      <div>
        {status === "error" ? (
          <p>Error </p>
        ) : status === "loading" ? (
          <p>Loading... </p>
        ) : filteredVacancies.length === 0 ? (
          <p>No vacancies found.</p>
        ) : (
          filteredVacancies.map((vacancy, index) => (
            <VacancyCard
              key={vacancy.id}
              vacancy={vacancy}
              isClickable={true}
              displayNumber={index + 1}
            />
          ))
        )}
      </div>
    </>
  );
};
export default VacanciesPage;
