import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './stores/authSlice';
import './index.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* ADMIN → Home */}
        {user?.role === 'ADMIN' && (
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            Home
          </Link>
        )}

        {/* USER + ADMIN → Tasks */}
        {user && (
          <Link
            to="/tasks"
            className={location.pathname === '/tasks' ? 'active' : ''}
          >
            Tasks
          </Link>
        )}
      </div>

      <div className="navbar-right">
        {!user ? (
          <>
            <Link to="/login" className="btn-link">Login</Link>
            <Link to="/register" className="btn-link">Register</Link>
          </>
        ) : (
          <div className="user-info">
            <span className="user-badge">
              {user.username[0].toUpperCase()}
            </span>
            <div className="user-details">
              <span className="username">{user.username}</span>
              <span className="role">{user.role}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
