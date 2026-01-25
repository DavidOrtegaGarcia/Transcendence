export default function FortytwoLinkButton() {
  const handleFortytwoLink = async () => {
    try {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

      const res = await fetch("https://localhost/oauth/uri?provider=fortytwo&action=link", {
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

      window.location.href = data.uri;
    } catch (err) {
      console.error("42 login failed:", err);
      alert("42 login failed");
    }
  };

  return (
    <button style={styles.button} onClick={handleFortytwoLink}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/960px-42_Logo.svg.png"
        alt="42Network"
        style={styles.icon}
      />
      Link with 42 Network
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
