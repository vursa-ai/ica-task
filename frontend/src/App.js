import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import './App.css';

const EXPRESS_API = process.env.REACT_APP_EXPRESS_API || 'http://localhost:5000';
const PYTHON_API = process.env.REACT_APP_PYTHON_API || 'http://localhost:5000';

function App() {
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);
  const queryClient = useQueryClient();

  // Auto-refresh tasks every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`Auto-refreshing tasks for user ${selectedUserId}`);
      queryClient.invalidateQueries({ queryKey: ['tasks', selectedUserId] });
      setLastRefresh(new Date().toLocaleTimeString());
    }, 30000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: users = [], isError: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get(`${EXPRESS_API}/api/users`);
      return response.data;
    },
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', selectedUserId],
    queryFn: async () => {
      const response = await axios.get(`${EXPRESS_API}/api/users/${selectedUserId}/tasks`);
      return response.data;
    },
    enabled: !!selectedUserId,
  });

  const { data: stats } = useQuery({
    queryKey: ['stats', selectedUserId],
    queryFn: async () => {
      const response = await axios.get(`${EXPRESS_API}/api/users/${selectedUserId}/stats`);
      return response.data;
    },
    enabled: !!selectedUserId,
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics', selectedUserId],
    queryFn: async () => {
      const response = await axios.get(`${PYTHON_API}/api/analytics/user/${selectedUserId}`);
      return response.data;
    },
    enabled: !!selectedUserId,
  });

  const { data: searchResults = [] } = useQuery({
    queryKey: ['search', searchQuery, selectedUserId],
    queryFn: async () => {
      if (!searchQuery) return [];
      const response = await axios.get(`${PYTHON_API}/api/search/tasks?q=${searchQuery}&user_id=${selectedUserId}`);
      return response.data;
    },
    enabled: !!searchQuery,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }) => {
      await axios.patch(`${EXPRESS_API}/api/tasks/${taskId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      await axios.delete(`${EXPRESS_API}/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskMutation.mutate({ taskId, status: newStatus });
  };

  const handleDeleteTask = (taskId) => {
    deleteTaskMutation.mutate(taskId);
  };

  if (usersError) {
    return (
      <div className="app">
        <div className="error">
          Failed to load users. Please check if the backend is running.
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Task Manager</h1>

        <div className="user-selector">
          <label>Select User:</label>
          <select
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
          >
            <option value="">Choose a user...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {stats && (
          <div className="stats">
            <div className="stat-card">
              <h3>Total Tasks</h3>
              <p>{stats.total_tasks}</p>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <p>{stats.completed_tasks}</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p>{stats.pending_tasks}</p>
            </div>
          </div>
        )}
      </div>

      {analytics && (
        <div className="analytics-section">
          <h2>Analytics</h2>
          <p>Completion Rate: {analytics.completion_rate}%</p>

          <div className="priority-breakdown">
            {analytics.priority_breakdown.map(item => (
              <div key={item.priority} className="priority-item">
                <strong>Priority {item.priority}</strong>
                <p>{item.count} tasks</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="search-section">
        <h2>Search Tasks</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchResults.length > 0 && (
          <div style={{ marginTop: '15px' }}>
            <h3>Search Results ({searchResults.length})</h3>
            <ul className="task-list">
              {searchResults.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="tasks-section">
        <h2>All Tasks {lastRefresh && <span style={{ fontSize: '12px', color: '#888' }}>(Last refresh: {lastRefresh})</span>}</h2>

        {tasksLoading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <ul className="task-list">
            {tasks.map((task, index) => (
              <TaskItem
                key={index}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TaskItem({ task, onStatusChange, onDelete }) {
  const [notes, setNotes] = useState('');

  const handleToggleStatus = () => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    onStatusChange(task.id, newStatus);
  };

  return (
    <li className="task-item">
      <div className="task-info">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <div className="task-meta">
          <span className={`badge status-${task.status}`}>
            {task.status}
          </span>
          <span className="badge priority">
            Priority: {task.priority}
          </span>
        </div>
        <input
          type="text"
          className="task-notes"
          placeholder="Add a note..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="task-actions">
        <button
          className={`btn ${task.status === 'pending' ? 'btn-success' : 'btn-primary'}`}
          onClick={handleToggleStatus}
        >
          {task.status === 'pending' ? 'Complete' : 'Reopen'}
        </button>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default App;
