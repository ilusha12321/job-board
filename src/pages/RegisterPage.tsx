import React, { useState } from "react";
import { registerUser } from "../services/authApi";
import { useAuth } from "../app/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<"jobseeker" | "employer">("jobseeker");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(
    formSubmission: React.FormEvent<HTMLFormElement>,
  ) {
    formSubmission.preventDefault();
    const regInfo = await registerUser(username, email, password, role);
    if (!regInfo) {
      setError("A user with this username/email already exists");
      return;
    }

    setUser(regInfo);
    navigate("/");
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="role">Role :</label>
      <select
        id="role"
        value={role}
        onChange={(event) =>
          setRole(event.target.value as "jobseeker" | "employer")
        }
      >
        <option value="jobseeker">Job Seeker</option>

        <option value="employer">Employer</option>
      </select>
      {error && <p> {error}</p>}
      <label htmlFor="username">Username :</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <label htmlFor="email">Email :</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <label htmlFor="password">Password :</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
}
