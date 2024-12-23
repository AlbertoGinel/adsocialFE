"use client";

import { useState } from "react";
import useAuthStore from "../_lib/stores/authStore";
import { useRouter } from "next/navigation";

// Define the error state type
type ErrorState = string | null;

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();

  // Correct the typing of useState hooks
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<ErrorState>(null);

  const handleLogin = async () => {
    try {
      await login(username, password); // Call login with username and password
      router.push("/game"); // Redirect to /game on successful login
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleLogin}>Log In</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
