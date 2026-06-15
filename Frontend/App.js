import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState(null);

  // Fetch tasks from the backend API
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Submit a new task to the backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!response.ok) throw new Error('Failed to create task');
      setNewTitle('');
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Task Manager</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter a new task..."
          style={{ padding: '8px', marginRight: '10px', width: '250px' }}
        />
        <button type="submit" style={{ padding: '8px 15px' }}>Add Task</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ margin: '5px 0' }}>
            {task.title} {task.completed ? '✅' : '⏳'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
