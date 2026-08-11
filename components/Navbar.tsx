import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-blue-700 shadow-md">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-bold text-lg hover:text-blue-100 transition-colors"
        >
          <span className="text-2xl" aria-hidden="true">🎓</span>
          <span className="hidden sm:inline">University Course Evaluation</span>
          <span className="sm:hidden">Course Eval</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          <Link
            href="/evaluate"
            className="text-blue-100 hover:text-white hover:bg-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Student
          </Link>
          <Link
            href="/dashboard"
            className="text-blue-100 hover:text-white hover:bg-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
