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
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">A</span>
            </div>
            <span className="text-2xl font-bold text-white">AlgoViz</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {loggedIn && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  📊 Dashboard
                </Link>
                <Link 
                  to="/visualizer" 
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  🎯 Visualizer
                </Link>
              </>
            )}
            {isAdmin() && (
              <Link 
                to="/admin" 
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                ⚙️ Admin
              </Link>
            )}
            {loggedIn ? (
              <button 
                onClick={logout}
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  to="/login"
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;