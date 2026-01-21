import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './Navbar';
import Home from './screens/Home';
import About from './screens/About';
import TasksPage from './screens/TasksPage';
import Login from './screens/Login';
import Register from './screens/Register';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <Navbar />

      <Routes>
        {/* Default entry point */}
        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : user.role === 'ADMIN' ? (
              <Home />
            ) : (
              <Navigate to="/tasks" replace />
            )
          }
        />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Shared */}
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}

export default App;
