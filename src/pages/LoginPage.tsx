import React, { useState } from "react";
import { loginUser } from "../services/authApi";
import { useAuth } from "../app/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(
    formSubmission: React.FormEvent<HTMLFormElement>,
  ) {
    formSubmission.preventDefault();
    setError(null);
    const loggedInUser = await loginUser(username, password);
    if (!loggedInUser) {
      return setError("Invalid login or password");
    }
    setUser(loggedInUser);
    navigate("/");
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username :</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <label htmlFor="password">Password :</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
