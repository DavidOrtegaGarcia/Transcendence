import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import OAuthRedirect from "./Pages/OAuthRedirect";
import Dashboard from "./Pages/Home";
import WsTest from "./Pages/WsTest";

function App() {
  const [auth, setAuth] = useState(null); // null = loading, false = guest, true = logged

  // Check authentication on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://localhost/user", {
          credentials: "include",
          headers: { "X-Requested-With": "XMLHttpRequest" },
        });
        if (res.ok) setAuth(true);
        else setAuth(false);
      } catch {
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (auth === null) {
    // Loading state
    return <div>Loading...</div>;
  }

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return auth ? children : <Navigate to="/loginpage" replace />;
  };

  // Guest-only Route component
  const GuestRoute = ({ children }) => {
    return !auth ? children : <Navigate to="/home" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/oauth-redirect/:provider" element={<OAuthRedirect />} />

        {/* Guest routes */}
        <Route
          path="/loginpage"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/registration"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/websocket-test"
          element={
              <WsTest />
          }
        />

        <Route path="*" element={<Navigate to={auth ? "/home" : "/loginpage"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
