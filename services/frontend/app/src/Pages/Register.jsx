import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);

    try {
      // 1️⃣ Get CSRF cookie
      await fetch("https://localhost/sanctum/csrf-cookie", {
        credentials: "include",
      });

      await fetch("https://localhost/v1/trace-session", {
        credentials: "include",
      });

      const xsrfToken = decodeURIComponent(document.cookie.split("; ").find((row) => row.startsWith("XSRF-TOKEN="))?.split("=")[1] || "");

      const res = await fetch("https://localhost/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": xsrfToken,
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      if (res.status === 422) {
        // Validation errors
        const data = await res.json();
        setErrors(Object.values(data.errors).flat());
      } else if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setPasswordConfirmation("");
      } else {
        setErrors(["Unexpected error."]);
      }
    } catch (err) {
      setErrors([err.message]);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Register</h2>

      {success && <p style={{ color: "green" }}>Registration successful!</p>}

      {errors.length > 0 && (
        <ul style={{ color: "red" }}>
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Register
        </button>
      </form>
    </div>
  );
}
