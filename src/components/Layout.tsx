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
