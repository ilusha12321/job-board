import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <header>
        <Link to="/">Home</Link>
        <Link to="/vacancies">Vacancies</Link>
        pracya.ua
      </header>
      <main>
        <Outlet />
      </main>
      <footer>2026</footer>
    </div>
  );
}
export default Layout;
