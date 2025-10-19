import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, LogOut, BookOpenText } from "lucide-react";

const Navbar = ({ user, setUser }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const delay = setTimeout(() => {
      navigate(search.trim() ? `/?search=${encodeURIComponent(search)}` : "/");
    }, 500);
    return () => clearTimeout(delay);
  }, [search, navigate, user]);

  useEffect(() => {
    setSearch("");
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="backdrop-blur-md bg-gray-900/80 border-b border-gray-700 text-white shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* --- Logo / Brand --- */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-all"
        >
          <BookOpenText className="w-7 h-7" />
          <span className="text-2xl font-bold tracking-wide">
            Notes<span className="text-white">Vault</span>
          </span>
        </Link>

        {/* --- Search Bar + User --- */}
        {user && (
          <div className="flex items-center space-x-5">
            {/* Search Box */}
            <motion.div
              whileFocus={{ scale: 1.03 }}
              className="relative flex items-center"
            >
              <Search className="absolute left-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="pl-10 pr-4 py-2 w-56 md:w-72 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </motion.div>

            {/* User Info + Logout */}
            <div className="flex items-center space-x-4">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden sm:block text-gray-300 font-medium tracking-wide"
              >
                 {user.username}
              </motion.span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md font-medium transition-all shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
