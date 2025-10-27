import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getUsers } from "../services/api";

const Header = ({ username, setIsAuthed, setUsername }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const searchWrapRef = useRef(null);

  const handleLogout = async () => {
    try { await logout(); } catch (e) { console.error(e); }
    finally {
      localStorage.removeItem("user");
      setIsAuthed(false);
      setUsername("");
      navigate("/signin");
    }
  };

  // Click outside: close suggestions
  useEffect(() => {
    const onDocClick = (e) => {
      if (!searchWrapRef.current) return;
      if (!searchWrapRef.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Live search (debounced)
  useEffect(() => {
    const q = search.trim();
    if (q.length < 2) { setSuggestions([]); return; }

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getUsers();
        // Be defensive about the payload shape
        const arr = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.users)
          ? res.data.users
          : [];

        const matches = arr
          .filter(u => typeof u?.username === "string")
          .filter(u => u.username.toLowerCase().includes(q.toLowerCase()))
          .slice(0, 8);

        setSuggestions(matches);
      } catch (err) {
        console.error("getUsers failed:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  const handleSelectUser = (u) => {
    setSearch("");
    setSuggestions([]);
    setFocused(false);
    setMenuOpen(false);
    navigate(`/profile/${u}`);
  };

  return (
    <header className="relative z-50 bg-[var(--bg)] text-[var(--acc)] font-[bebas] shadow-md">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {/* Left side: Logo + Search */}
        <div className="flex items-center gap-4 flex-1">
          {/* Logo */}
          <h1 className="text-3xl sm:text-4xl whitespace-nowrap">
            <span className="text-[var(--acc)]">BUFF</span>
            <span className="text-[var(--hl)]">BUDS</span>
          </h1>

          {/* Search (hidden on mobile) */}
          <div className="relative flex-1 max-w-md hidden sm:block" ref={searchWrapRef}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Search users…"
              className="w-full px-3 py-2 bg-white rounded-md text-gray-700 shadow-sm focus:outline-none text-sm sm:text-base"
            />
            {focused && (loading || suggestions.length > 0) && (
              <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-[60]">
                {loading && (
                  <li className="px-4 py-2 text-gray-500 text-sm">Searching…</li>
                )}
                {!loading && suggestions.length === 0 && (
                  <li className="px-4 py-2 text-gray-500 text-sm">No matches</li>
                )}
                {!loading &&
                  suggestions.map((u) => (
                    <li
                      key={u.id || u.username}
                      onClick={() => handleSelectUser(u.username)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                    >
                      @{u.username}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right side: Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 text-lg ml-auto">
          <Link className="hover:text-[var(--hl)] transition" to="/">Feed</Link>
          <Link className="hover:text-[var(--hl)] transition" to="/workout">Workout</Link>
          <Link className="hover:text-[var(--hl)] transition" to="/analytics">Analytics</Link>
          <Link className="hover:text-[var(--hl)] transition" to={`/profile/${username}`}>Profile</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
          >
            Logout
          </button>
        </nav>

        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden text-3xl text-white"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      {/* Search bar on mobile */}
      <div className="sm:hidden px-4 pb-2">
        <div className="relative" ref={searchWrapRef}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search users…"
            className="w-full px-3 py-2 bg-white rounded-md text-gray-700 shadow-sm focus:outline-none text-sm"
          />
          {focused && (loading || suggestions.length > 0) && (
            <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-[60]">
              {loading && (
                <li className="px-4 py-2 text-gray-500 text-sm">Searching…</li>
              )}
              {!loading && suggestions.length === 0 && (
                <li className="px-4 py-2 text-gray-500 text-sm">No matches</li>
              )}
              {!loading &&
                suggestions.map((u) => (
                  <li
                    key={u.id || u.username}
                    onClick={() => handleSelectUser(u.username)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                  >
                    @{u.username}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-black/10 bg-gray-500 text-white px-5 py-4 space-y-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:text-[var(--hl)]">Feed</Link>
          <Link to="/workout" onClick={() => setMenuOpen(false)} className="block hover:text-[var(--hl)]">Workout</Link>
          <Link to="/analytics" onClick={() => setMenuOpen(false)} className="block hover:text-[var(--hl)]">Analytics</Link>
          <Link to={`/profile/${username}`} onClick={() => setMenuOpen(false)} className="block hover:text-[var(--hl)]">Profile</Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
