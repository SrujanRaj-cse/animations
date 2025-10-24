import { Link, useNavigate } from 'react-router-dom';
import { getToken, removeToken, isAdmin } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = !!getToken();

  const logout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-blue-700 text-white shadow">
      <Link to="/" className="text-2xl font-bold">AlgoViz</Link>
      <div className="flex gap-6 text-sm">
        {loggedIn && <Link to="/visualizer">Visualizer</Link>}
        {isAdmin() && <Link to="/admin">Admin</Link>}
        {loggedIn ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;