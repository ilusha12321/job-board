import { type User } from "../types/user";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hash = await window.crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(hash));

  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
): Promise<User> {
  const hashedPassword = await hashPassword(password);

  const newUser: User = {
    id: Date.now().toString(),
    username,
    email,
    passwordHash: hashedPassword,
  };

  const infoUser = localStorage.getItem("users");

  const usersList: User[] = infoUser ? JSON.parse(infoUser) : [];

  usersList.push(newUser);

  localStorage.setItem("users", JSON.stringify(usersList));

  return newUser;
}

export async function loginUser(
  username: string,
  password: string,
): Promise<User | null> {
  const infoUser = localStorage.getItem("users");

  const usersList: User[] = infoUser ? JSON.parse(infoUser) : [];

  const hashedPassword = await hashPassword(password);

  const found = usersList.find(
    (user) =>
      user.username === username && user.passwordHash === hashedPassword,
  );

  return found ?? null;
}
