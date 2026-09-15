import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "../app/AuthContext";

function Layout() {
  const { user, setUser } = useAuth();

  return (
    <div>
      <header>
        {user ? (
          <>
            <span>{user.username}</span>
            <button onClick={() => setUser(null)}>Logout</button>

            {user.role === "jobseeker" && (
              <Link to="/my-applications">My applications </Link>
            )}
            {user.role === "employer" && (
              <Link to="/employer-applications">Applications </Link>
            )}
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <Link to="/">Home</Link>
        <Link to="/vacancies">Vacancies</Link>
        <span>pracya.ua</span>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>2026</footer>
    </div>
  );
}

export default Layout;
