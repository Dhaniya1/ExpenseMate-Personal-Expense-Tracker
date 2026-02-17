export default function Navbar() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <a className="text-teal-600 dark:text-teal-300 font-bold text-xl">
            ExpenseTracker
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li><a className="text-gray-500 hover:text-gray-700 dark:text-white">About</a></li>
              <li><a className="text-gray-500 hover:text-gray-700 dark:text-white">Services</a></li>
              <li><a className="text-gray-500 hover:text-gray-700 dark:text-white">Projects</a></li>
              <li><a className="text-gray-500 hover:text-gray-700 dark:text-white">Blog</a></li>
            </ul>
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button className="rounded-md bg-teal-600 px-5 py-2.5 text-sm text-white hover:bg-teal-500">
              Login
            </button>

            <button className="hidden sm:block rounded-md bg-gray-100 px-5 py-2.5 text-sm text-teal-600 dark:bg-gray-800 dark:text-white">
              Register
            </button>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 bg-gray-100 rounded dark:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
