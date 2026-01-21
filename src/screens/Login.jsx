// src/screens/Login.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../stores/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../api';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Ensure the backend URL is correct
      const res = await api.post('/users/login', {
        email: form.email,
        password: form.password,
      });

      // Save user to redux store
      dispatch(login(res.data));

      toast.success('Login successful!');
      navigate('/'); // Redirect to home
    } catch (err) {
      console.error(err);

      // Better error handling
      if (err.response) {
        toast.error(err.response.data?.error || 'Login failed');
      } else if (err.request) {
        toast.error('No response from server. Check your backend.');
      } else {
        toast.error('Login error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={handleChange} 
          required
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={form.password} 
          onChange={handleChange} 
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="switch-auth">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
