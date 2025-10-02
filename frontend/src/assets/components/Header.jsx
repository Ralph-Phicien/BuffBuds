import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative p-4 bg-[var(--bg)] shadow-md text-[var(--acc)] font-[bebas]">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">
            <span className="text-[var(--acc)]">BUFF</span>
            <span className="text-[var(--hl)]">BUDS</span>
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-lg">
            <Link className="hover:text-[var(--hl)] transition" to="/">Feed</Link>
            <Link className="hover:text-[var(--hl)] transition" to="/workout">Workout</Link>
            <Link className="hover:text-[var(--hl)] transition" to="/analytics">Analytics</Link>
            <Link className="hover:text-[var(--hl)] transition" to="/profile/**user**">Profile</Link>
        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition">
        Logout
        </button>
        </nav>


        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <nav className="absolute top-full left-0 w-full md:hidden flex flex-col space-y-6 text-lg bg-gray-700 p-6 z-50">
            <Link to="/" onClick={() => setMenuOpen(false)}>Feed</Link>
            <Link to="/workout" onClick={() => setMenuOpen(false)}>Workout</Link>
            <Link to="/analytics" onClick={() => setMenuOpen(false)}>Analytics</Link>
            <Link to="/profile/**user**" onClick={() => setMenuOpen(false)}>Profile</Link>
            <button
            className="bg-red-500 text-white px-3 py-2 rounded w-fit"
            onClick={() => setMenuOpen(false)}
            >
            Logout
            </button>
        </nav>
        )}
    </header>
  );
};

export default Header;
