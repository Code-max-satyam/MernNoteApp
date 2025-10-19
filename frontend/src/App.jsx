import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const { data } = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (err) {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar user={user} setUser={setUser} />
      <Routes>
        {/* Login & Register routes */}
        <Route
          path="/login"
          element={<Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={<Register setUser={setUser} />}
        />

        {/* Home route */}
        <Route
          path="/"
          element={<Home user={user} />}
        />
      </Routes>
    </div>
  );
}

export default App;
