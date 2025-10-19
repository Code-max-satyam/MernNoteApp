import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteModal from "./NoteModel";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const fetchNotes = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search") || "";
      const headers = isLoggedIn
        ? { Authorization: `Bearer ${token}` }
        : undefined;

      const { data } = await axios.get("/api/notes", { headers });

      const filteredNotes = search
        ? data.filter(
            (note) =>
              note.title.toLowerCase().includes(search.toLowerCase()) ||
              note.description.toLowerCase().includes(search.toLowerCase())
          )
        : data;
      setNotes(filteredNotes);
    } catch (err) {
      setError("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [location.search]);

  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes(notes.map((note) => (note._id === newNote._id ? newNote : note)));
    } else {
      setNotes([...notes, newNote]);
    }
    setEditNote(null);
    setIsModalOpen(false);
  };

  const handleEdit = (note) => {
    if (!isLoggedIn) return navigate("/login");
    setEditNote(note);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!isLoggedIn) return navigate("/login");
    try {
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch {
      setError("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-blue-400">My Notes</h1>
          {!isLoggedIn && (
            <div className="space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition-all"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-400 text-center mb-6 bg-red-900/30 p-3 rounded-md">
            {error}
          </p>
        )}

        {/* Note Modal */}
        <NoteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditNote(null);
          }}
          note={editNote}
          onSave={handleSaveNote}
        />

        {/* Floating Add Button */}
        {isLoggedIn ? (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white text-4xl rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center"
          >
            +
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/login")}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gray-600 text-white text-3xl rounded-full shadow-lg hover:bg-gray-700 flex items-center justify-center"
          >
            +
          </motion.button>
        )}

        {/* Notes Grid */}
        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {notes.map((note, i) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-1"
              >
                <h3 className="text-2xl font-semibold mb-2 text-blue-300 tracking-wide capitalize">
                  {note.title}
                </h3>
                <p className="text-gray-300 mb-4 text-base leading-relaxed">
                  {note.description.length > 150
                    ? note.description.slice(0, 150) + "..."
                    : note.description}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  {new Date(note.updatedAt).toLocaleString()}
                </p>

                {isLoggedIn ? (
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleEdit(note)}
                      className="flex-1 bg-yellow-500 text-black px-3 py-2 rounded-md font-medium hover:bg-yellow-400 transition-all"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleDelete(note._id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md font-medium hover:bg-red-700 transition-all"
                    >
                      Delete
                    </motion.button>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm italic text-center mt-3">
                    Login to manage notes 🔒
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
