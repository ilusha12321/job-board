import React, { useState } from "react";
import { registerUser } from "../services/authApi";
import { useAuth } from "../app/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(
    formSubmission: React.FormEvent<HTMLFormElement>,
  ) {
    formSubmission.preventDefault();
    const regInfo = await registerUser(username, email, password);
    setUser(regInfo);
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
}
