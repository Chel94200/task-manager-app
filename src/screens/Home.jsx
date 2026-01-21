import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddTask from '../components/AddTask';
import TaskList from '../components/TaskList';

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // 🔐 Redirect USER to /tasks
  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.role === 'USER') {
    navigate('/tasks');
    return null;
  }

  // ✅ ADMIN only reaches here
  return (
    <div className="container">
      <h1>Tasks</h1>
      <AddTask />
      <TaskList />
    </div>
  );
};

export default Home;
