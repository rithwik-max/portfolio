import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar-wrap">
      <nav className="navbar-pill">
        <div className="nav-brand-group">
          <span className="brand-dot" />
          <span className="nav-brand">Portfolio</span>
        </div>

        <div className="nav-divider" />

        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>Work</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
          {user && (
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
          )}
        </div>

        <div className="nav-divider" />

        <div className="nav-auth">
          <button onClick={toggle} className="nav-link theme-toggle" title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user ? (
            <button onClick={handleLogout} className="nav-link">Logout</button>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}