import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../app/AuthContext";

function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4">
          <Link
            to="/"
            className="group shrink-0 text-xl font-bold tracking-tight"
          >
            <span className="text-slate-900 transition-colors group-hover:text-blue-700">
              hard
            </span>
            <span className="text-blue-700 transition-colors group-hover:text-slate-900">
              work
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
            <Link to="/" className="transition-colors hover:text-slate-900">
              Home
            </Link>

            <Link
              to="/vacancies"
              className="transition-colors hover:text-slate-900"
            >
              Vacancies
            </Link>

            {user?.role === "jobseeker" && (
              <Link
                to="/my-applications"
                className="transition-colors hover:text-slate-900"
              >
                My applications
              </Link>
            )}

            {user?.role === "employer" && (
              <>
                <Link
                  to="/my-vacancies"
                  className="transition-colors hover:text-slate-900"
                >
                  My vacancies
                </Link>
                <Link
                  to="/employer-applications"
                  className="transition-colors hover:text-slate-900"
                >
                  Applications
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 text-sm">
            {user ? (
              <>
                <span className="hidden text-slate-600 sm:block">
                  {user.username}
                </span>

                <button
                  onClick={logout}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md px-3 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-md bg-blue-600 px-3 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-129px)] bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900 text-slate-400">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm">
          © 2026 hardwork
        </div>
      </footer>
    </div>
  );
}

export default Layout;
