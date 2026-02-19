import { useAuth } from "../context/AuthContext";
import logo from "../assets/ExpenseMateWhite.png"


export default function Navbar() {

  const { logout } = useAuth();

  return (
    <header className="bg-gray-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <img src={logo} alt="ExpenseMate" className="h-10 w-auto object-contain"/>


        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-sm">
          <a href="#" className="hover:text-teal-200 transition">
            Dashboard
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            Reports
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            Settings
          </a>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button 
          onClick={logout}
          className="bg-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
            Logout
          </button>
          

          {/* Mobile menu button */}
          <button className="md:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}
