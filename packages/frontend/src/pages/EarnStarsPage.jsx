import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import apiClient from '../services/api';
import { updateStars } from '../features/user/userSlice';

// A reusable component for a single task
function TaskCard({ task, onComplete }) {
  const reward = task.type === 'FOLLOW' ? 10 : 2;
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    // Open the TikTok URL in a new tab for the user to complete the action
    window.open(task.targetUrl, '_blank');
    
    // Immediately call the onComplete function to get the reward
    onComplete(task.id);
    setIsCompleted(true);
  };

  return (
    <div style={{ border: '1px solid #555', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p><strong>{task.type === 'FOLLOW' ? 'Follow this user' : 'Like this video'}</strong></p>
        <p>Reward: ✨ {reward} Stars</p>
      </div>
      <button onClick={handleComplete} disabled={isCompleted}>
        {isCompleted ? 'Done' : 'Complete Task'}
      </button>
    </div>
  );
}


function EarnStarsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Failed to fetch tasks:', error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleTaskCompletion = async (campaignId) => {
    try {
      const response = await apiClient.post('/tasks/complete', { campaignId });
      // Update the star balance in Redux
      dispatch(updateStars(response.data.newStarBalance));
    } catch (error) {
      console.error('Failed to complete task:', error);
      alert(error.response?.data?.message || 'Could not complete task.');
    }
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="App">
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        Back to Dashboard
      </button>
      <h1>Earn Stars</h1>
      <p>Complete tasks to earn stars that you can use for your own campaigns.</p>
      <div style={{ maxWidth: '600px', margin: 'auto' }}>
        {tasks.length > 0 ? (
          tasks.map(task => <TaskCard key={task.id} task={task} onComplete={handleTaskCompletion} />)
        ) : (
          <p>No tasks available right now. Check back later!</p>
        )}
      </div>
    </div>
  );
}

export default EarnStarsPage;