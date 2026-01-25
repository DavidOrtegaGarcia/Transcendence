import { useEffect, useRef } from "react";
import { useSearchParams, useParams } from "react-router-dom";

export default function OAuthRedirect() {
  const [searchParams] = useSearchParams();
  const ran = useRef(false);
  const { provider } = useParams();

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;

        const run = async () => {
            const payload = Object.fromEntries(searchParams.entries());

            await fetch("https://localhost/sanctum/csrf-cookie", {method: "GET", credentials: "include",});

            const xsrfToken = decodeURIComponent(document.cookie.split("; ").find((row) => row.startsWith("XSRF-TOKEN="))?.split("=")[1] || "");

            const response = await fetch(`https://localhost/oauth/redirected/${provider}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": xsrfToken,
                },
                body: JSON.stringify(payload),
            });

          if (response.ok) 
          {
            const data = await response.json();
            if (data.redirect)
            {
              window.location.href = data.redirect;
            }
          }
        };

        run();
    }, []);

  return (
    <div>
      <h1>Logging in ...</h1>
    </div>
  );
}
