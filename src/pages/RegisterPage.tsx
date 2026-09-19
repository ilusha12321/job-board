import React, { useState } from "react";
import { registerUser } from "../services/authApi";
import { useAuth } from "../app/AuthContext";
import { Link, useNavigate } from "react-router-dom";

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
    setError(null);
    const regInfo = await registerUser(username, email, password, role);
    if (!regInfo) {
      setError("A user with this username/email already exists");
      return;
    }

    setUser(regInfo);
    navigate("/");
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Register</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create your hardwork account
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-slate-700"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(event) =>
                setRole(event.target.value as "jobseeker" | "employer")
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              required
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              autoComplete="username"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              required
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
