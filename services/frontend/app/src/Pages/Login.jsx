import { useState } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import FortytwoLoginButton from "../components/FortytwoLoginButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await fetch("https://localhost/sanctum/csrf-cookie", {method: "GET"});

      const xsrfToken = decodeURIComponent(document.cookie.split("; ").find((row) => row.startsWith("XSRF-TOKEN="))?.split("=")[1] || "");

      const res = await fetch("https://localhost/login", {
        method: "POST",
        credentials: "include", // send cookies
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrfToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ email, password }),
      });


      if (!res.ok) 
      {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }
      else 
      {
        window.location.href = "/home";
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Login</h1>

      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" style={styles.loginButton}>
          Login
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={styles.divider}>OR</div>

      <GoogleLoginButton />
      <FortytwoLoginButton />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "360px",
    margin: "80px auto",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  loginButton: {
    padding: "0.75rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  divider: {
    margin: "1.5rem 0",
    color: "#888",
  },
};
