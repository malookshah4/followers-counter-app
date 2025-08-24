import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import apiClient from '../services/api.js';
import { updateStars } from '../features/user/userSlice.js';

const TASK_REWARDS = { FOLLOW: 10, LIKE: 2 };

function TaskViewer() {
    const dispatch = useDispatch();
    const [tasks, setTasks] = useState([]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState({});

    const fetchTasks = useCallback(() => {
        setLoading(true);
        apiClient.get('/campaigns/available')
            .then(res => setTasks(res.data))
            .catch(err => console.error('Failed to fetch tasks', err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleStartTask = (task) => {
        const tiktokTab = window.open(task.targetUrl, '_blank');
        if (!tiktokTab) {
            alert("Please allow pop-ups for this site to complete tasks.");
            return;
        }
        setVerifying({ ...verifying, [task.id]: 'pending' });
        apiClient.post('/verify/start', { campaignId: task.id })
            .then(response => {
                const { ticketId } = response.data;
                setVerifying({ ...verifying, [task.id]: { state: 'started', ticketId: ticketId } });
            })
            .catch(error => {
                alert('Could not start task. Please try again.');
                setVerifying({ ...verifying, [task.id]: undefined });
            });
    };

    const handleVerifyTask = async (task, ticketId) => {
        setVerifying({ ...verifying, [task.id]: 'verifying' });
        try {
            await apiClient.post('/verify/submit', { ticketId });
            alert('Task verified successfully!');
            const userResponse = await apiClient.get('/user/me');
            dispatch(updateStars(userResponse.data.user.stars));
            fetchTasks(); 
        } catch (error) {
            alert(error.response?.data?.message || 'Could not verify task.');
            setVerifying({ ...verifying, [task.id]: undefined });
        }
    };

    const nextTask = () => {
        if (tasks.length > 1) {
            setCurrentTaskIndex(prev => (prev + 1) % tasks.length);
        }
    };

    const prevTask = () => {
        if (tasks.length > 1) {
            setCurrentTaskIndex(prev => (prev - 1 + tasks.length) % tasks.length);
        }
    };
    
    const currentTask = tasks[currentTaskIndex];

    if (loading) return <div className="card task-card"><p>Loading tasks...</p></div>;

    const taskState = verifying[currentTask?.id];

    return (
        <section className="card task-card">
            <h3 className="card-header">Earn Stars</h3>
            {tasks.length > 0 ? (
                <>
                    <img
                        key={currentTask.id}
                        src={currentTask.thumbnailUrl || currentTask.user?.tikTokAccount?.avatarUrl}
                        alt="Task media"
                        className={`task-media ${currentTask.type === 'FOLLOW' ? 'profile' : ''}`}
                    />
                    <div className="task-info">
                        {currentTask.type === 'FOLLOW' && (
                            <span>@{currentTask.user?.tikTokAccount?.username}</span>
                        )}
                        {currentTask.type === 'LIKE' && (
                            <span>{currentTask.title || "No text found for this video"}</span>
                        )}
                    </div>
                    <div className="task-actions">
                        <button className="nav-button" onClick={prevTask}>←</button>
                        
                        {(!taskState || taskState === 'pending') && (
                            <button className="task-button" onClick={() => handleStartTask(currentTask)} disabled={taskState === 'pending'}>
                                {taskState === 'pending' ? 'Starting...' : `Start Task (+${TASK_REWARDS[currentTask.type]} Stars)`}
                            </button>
                        )}

                        {taskState?.state === 'started' && (
                            <button className="task-button" onClick={() => handleVerifyTask(currentTask, taskState.ticketId)}>
                                Verify Completion
                            </button>
                        )}
                        
                        {taskState === 'verifying' && (
                            <button className="task-button" disabled>Verifying...</button>
                        )}
                        
                        <button className="nav-button" onClick={nextTask}>→</button>
                    </div>
                </>
            ) : (
                <p>No tasks available right now.</p>
            )}
        </section>
    );
}

export default TaskViewer;