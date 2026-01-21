import { useDispatch } from 'react-redux';
import { deleteTaskApi, toggleTaskApi } from '../stores/tasksSlice';
import { toast } from 'react-toastify';

const TaskItem = ({ task }) => {
    const dispatch = useDispatch();

    const handleToggle = () => {
        dispatch(toggleTaskApi(task));
    };

    const handleDelete = () => {
        dispatch(deleteTaskApi(task.id));
    };

    return (
        <div className="task">
            <span
                style={{
                    textDecoration: task.done ? 'line-through' : 'none',
                    color: task.done ? '#999' : '#333',
                }}
            >
                {task.text}
            </span>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={handleToggle} disabled={task.loading}
                    style={{
                        background: task.done ? '#28a745' : '#6c757d',
                    }}
                >
                    ✔
                </button>
                <button
                    onClick={handleDelete}
                    style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        cursor: 'pointer',
                    }}
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
