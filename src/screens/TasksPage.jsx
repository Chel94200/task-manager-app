import { useSelector } from 'react-redux';

const TasksPage = () => {
  const tasks = useSelector((state) => state.tasks.list);

  return (
    <div className="container">
      <h1>Tasks Overview</h1>

      <p style={{ fontSize: '18px', fontWeight: '600' }}>
        Total tasks: {tasks.length}
      </p>

      <ul style={{ paddingLeft: 0, marginTop: 20 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              listStyle: 'none',
              marginBottom: '12px',
              padding: '12px',
              borderRadius: '8px',
              background: '#f9fafc',
              border: '1px solid #eee',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: '20px',
                  color: task.done ? 'green' : '#ccc',
                }}
              >
                {task.done ? '✔' : '○'}
              </span>

              <span
                style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  textDecoration: task.done ? 'line-through' : 'none',
                }}
              >
                {task.text}
              </span>
            </div>

            {/* 👤 Creator info */}
            {task.owner && (
                <span
                    className={`creator-badge ${
                    task.owner.role === 'ADMIN' ? 'admin' : 'user'
                    }`}
                >
                    👤 {task.owner.username} · {task.owner.role}
                </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
