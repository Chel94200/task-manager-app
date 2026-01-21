import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import TaskItem from './TaskItem';
import { fetchTasks } from '../stores/tasksSlice';

const TaskList = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.list);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        dispatch(fetchTasks())
            .unwrap() // unwrap will throw if rejected
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [dispatch]);

    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {tasks.length === 0 ? (
                <p>No tasks yet.</p>
            ) : (
                tasks.map((task) => <TaskItem key={task.id} task={task} />)
            )}
        </div>
    );
};

export default TaskList;
