import { useEffect, useState } from "react";
import GoogleLinkButton from "../components/GoogleLinkButton";
import FortytwoLinkButton from "../components/FortytwoLinkButton";

export default function Home() {
  const [user, setUser] = useState(null);

  // Fetch logged-in user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://localhost/user", {
          credentials: "include",
          headers: { "X-Requested-With": "XMLHttpRequest" },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
      await fetch("https://localhost/sanctum/csrf-cookie", {method: "GET"});

      const xsrfToken = decodeURIComponent(document.cookie.split("; ").find((row) => row.startsWith("XSRF-TOKEN="))?.split("=")[1] || "");

    await fetch("https://localhost/logout", {
      method: "POST",
        credentials: "include", // send cookies
        headers: {
          "Accept": "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
    });

    window.location.href = "/";
  };

  if (!user) return <div>Loading user info...</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "400px" }}>
      <h1>Home</h1>

      <div style={{ marginBottom: "1rem" }}>
        {user.avatar && (
          <img
            src={user.avatar}
            alt="Avatar"
            style={{ width: "80px", borderRadius: "50%", marginBottom: "1rem" }}
          />
        )}
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <button onClick={logout}>Logout</button>
      <GoogleLinkButton />
      <FortytwoLinkButton />

    </div>
  );
}
