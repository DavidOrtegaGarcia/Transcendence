export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    try {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

      // Fetch redirect URL as JSON
      const res = await fetch("https://localhost/oauth/uri?provider=google&action=login", {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(getCookie('XSRF-TOKEN')),
        },
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to get OAuth URL");
      }

      const data = await res.json();

      // Programmatically redirect SPA to Google login
      window.location.href = data.uri;
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed");
    }
  };

  return (
    <button style={styles.button} onClick={handleGoogleLogin}>
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        style={styles.icon}
      />
      Login with Google
    </button>
  );
}

const styles = {
  button: {
    width: "100%",
    padding: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "500",
  },
  icon: {
    width: "18px",
    height: "18px",
  },
};
