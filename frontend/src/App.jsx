import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Visualizer from './pages/Visualizer';
import AdminPanel from './pages/AdminPanel';
import { getToken, isAdmin } from './utils/auth';
import SubmitAlgorithm from './pages/SubmitAlgorithm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/visualizer" element={<Visualizer />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/submit" element={<SubmitAlgorithm />} />
      </Routes>
    </Router>
  );
}

export default App;
