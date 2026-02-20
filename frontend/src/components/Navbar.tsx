import { useAuth } from "../context/AuthContext";
import logo from "../assets/ExpenseMateWhite.png";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <header className="bg-gray-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <img
          src={logo}
          alt="ExpenseMate"
          className="h-10 w-auto object-contain"
        />

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-8 text-sm ">
            <a href="#" className="hover:text-teal-200 transition">
              Dashboard
            </a>
            <a href="#" className="hover:text-teal-200 transition">
              Settings
            </a>
          </nav>

          <button
            onClick={logout}
            className="bg-purple-700 px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition"
          >
            Logout
          </button>

          <button className="md:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
