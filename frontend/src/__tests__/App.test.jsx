import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock the components that might cause issues in tests
vi.mock('../components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));

vi.mock('../pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>
}));

vi.mock('../pages/Login', () => ({
  default: () => <div data-testid="login">Login</div>
}));

vi.mock('../pages/Signup', () => ({
  default: () => <div data-testid="signup">Signup</div>
}));

vi.mock('../pages/Visualizer', () => ({
  default: () => <div data-testid="visualizer">Visualizer</div>
}));

vi.mock('../pages/AdminPanel', () => ({
  default: () => <div data-testid="admin">Admin Panel</div>
}));

vi.mock('../pages/SubmitAlgorithm', () => ({
  default: () => <div data-testid="submit">Submit Algorithm</div>
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders dashboard on root route', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });
});
