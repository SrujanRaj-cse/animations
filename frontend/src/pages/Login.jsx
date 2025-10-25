import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api.js';
import { setToken } from '../utils/auth.js';

const CustomAlert = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification</h3>
      <p className="text-gray-600 mb-6" style={{ whiteSpace: 'pre-wrap' }}>
        {message}
      </p>
      <button
        onClick={onClose}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        OK
      </button>
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    if (!email || !password) {
      setAlertMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await API.post('/auth/login', { email, password });
      setToken(res.data.token); // adjust if your backend structure is different
      navigate('/');
    } catch (error) {
      let message = 'Login failed. Please check your credentials.';
      if (error.response) message = error.response.data.message || message;
      else if (error.request)
        message = 'Server connection failed. Please try again later.';
      setAlertMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      {alertMessage && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Welcome to AlgoViz
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Authenticating...' : 'Login'}
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
