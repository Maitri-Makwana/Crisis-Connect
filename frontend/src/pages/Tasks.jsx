import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, UserPlus, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
    const { user } = useAuth();
    const isVolunteer = user?.role === 'Volunteer';
    
    const [tasks, setTasks] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    
    // Create Task Form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTask, setNewTask] = useState({ incident_id: '', task_type: 'General Support', description: '', urgency: 'Medium', required_skills: '', locationName: '' });
    
    // Assign Task Form
    const [showAssignForm, setShowAssignForm] = useState(null); // task_id
    const [assigneeIds, setAssigneeIds] = useState([]);

    useEffect(() => {
        fetchTasks();
        if (!isVolunteer) {
            fetchIncidents();
            fetchVolunteers();
        }
    }, [isVolunteer]);

    const fetchTasks = async () => {
        try {
            const url = isVolunteer 
                ? `http://localhost:5000/api/tasks?volunteer_id=${user.user_id}` 
                : 'http://localhost:5000/api/tasks';
            const res = await fetch(url);
            const data = await res.json();
            if (Array.isArray(data)) setTasks(data);
        } catch (err) {
            console.error('Failed to fetch tasks', err);
        }
    };

    const fetchIncidents = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/incidents');
            const data = await res.json();
            if (Array.isArray(data)) setIncidents(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchVolunteers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/users?role=Volunteer');
            const data = await res.json();
            if (Array.isArray(data)) setVolunteers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            let lat = null, lon = null;
            if (newTask.locationName) {
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newTask.locationName)}`);
                const geoData = await geoRes.json();
                if (geoData && geoData.length > 0) {
                    lat = parseFloat(geoData[0].lat);
                    lon = parseFloat(geoData[0].lon);
                } else {
                    return alert('Could not find that location to geocode. Please try adding City/Province.');
                }
            }

            const payload = {
                ...newTask,
                latitude: lat,
                longitude: lon
            };

            const res = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowCreateForm(false);
                setNewTask({ incident_id: '', task_type: 'General Support', description: '', urgency: 'Medium', required_skills: '', locationName: '' });
                fetchTasks();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAssignTask = async (taskId) => {
        if (assigneeIds.length === 0) return alert('Select at least one volunteer');
        try {
            const res = await fetch(`http://localhost:5000/api/tasks/${taskId}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ volunteer_ids: assigneeIds, assigned_by: user.user_id })
            });
            if (res.ok) {
                setShowAssignForm(null);
                setAssigneeIds([]);
                fetchTasks();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateAssignment = async (assignmentId, taskId, status) => {
        try {
            const res = await fetch(`http://localhost:5000/api/tasks/assignments/${assignmentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, task_id: taskId })
            });
            if (res.ok) {
                fetchTasks();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getUrgencyColor = (urgency) => {
        switch(urgency) {
            case 'Critical': return 'var(--error)';
            case 'High': return 'var(--warning)';
            case 'Medium': return '#FBC02D';
            default: return 'var(--success)';
        }
    };

    return (
        <div className="container py-5">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="mb-0">{isVolunteer ? 'My Task Inbox' : 'Task Dispatch & Assignment'}</h1>
                {!isVolunteer && (
                    <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
                        {showCreateForm ? 'Cancel' : 'Create New Task'}
                    </button>
                )}
            </div>

            {/* Coordinator/Admin Task Creation Form */}
            {showCreateForm && (
                <div className="card mb-5" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <h3 className="mb-3">Draft New Task</h3>
                    <form onSubmit={handleCreateTask} style={{ display: 'grid', gap: '1rem' }}>
                        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Related Incident</label>
                                <select 
                                    className="form-control" required
                                    value={newTask.incident_id}
                                    onChange={e => setNewTask({...newTask, incident_id: e.target.value})}
                                >
                                    <option value="">-- Select Incident --</option>
                                    {incidents.filter(i => i.status === 'Active').map(inc => (
                                        <option key={inc.id} value={inc.id}>{inc.type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Urgency</label>
                                <select 
                                    className="form-control"
                                    value={newTask.urgency}
                                    onChange={e => setNewTask({...newTask, urgency: e.target.value})}
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Critical</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Task Type / Operation Category</label>
                                <select 
                                    className="form-control"
                                    value={newTask.task_type}
                                    onChange={e => setNewTask({...newTask, task_type: e.target.value})}
                                >
                                    <option>General Support</option>
                                    <option>Search and Rescue</option>
                                    <option>Medical Transport</option>
                                    <option>Supply Delivery</option>
                                    <option>Evacuation Relay</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location Base (Address, City) - Optional</label>
                                <input 
                                    type="text" className="form-control" 
                                    placeholder="e.g. 50 Shelter Rd, Calgary"
                                    value={newTask.locationName}
                                    onChange={e => setNewTask({...newTask, locationName: e.target.value})}
                                />
                                <small style={{ color: 'var(--text-muted)' }}>Coordinates geocoded on submit.</small>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Task Description</label>
                            <textarea 
                                className="form-control" required rows="3"
                                placeholder="E.g. Transport 50 blankets from Downtown Shelter to Jasper Region..."
                                value={newTask.description}
                                onChange={e => setNewTask({...newTask, description: e.target.value})}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Required Skills/Equipment (Optional)</label>
                            <input 
                                type="text" className="form-control" 
                                placeholder="E.g. 4x4 Vehicle, First Aid CPR"
                                value={newTask.required_skills}
                                onChange={e => setNewTask({...newTask, required_skills: e.target.value})}
                            />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button type="submit" className="btn btn-primary">Save Task</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tasks.length === 0 ? (
                    <div className="card text-center text-muted py-5">
                        <FileText size={48} color="var(--border)" style={{ margin: '0 auto 1rem' }} />
                        <h3>No Tasks Found</h3>
                        <p>{isVolunteer ? "You have no active assignments. Stand by for deployment." : "No tasks have been created yet."}</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className="card" style={{ borderLeft: `6px solid ${getUrgencyColor(task.urgency)}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <AlertCircle size={18} color={getUrgencyColor(task.urgency)} />
                                        <span style={{ fontWeight: 'bold', color: getUrgencyColor(task.urgency) }}>{task.urgency} Urgency</span>
                                        <span style={{ color: 'var(--text-muted)' }}>• Incident: {task.incident_type || 'General'}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{task.description}</h3>
                                    {task.required_skills && (
                                        <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '1rem' }}>
                                            <strong>Requirements:</strong> {task.required_skills}
                                        </p>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ 
                                        display: 'inline-block',
                                        padding: '4px 12px', 
                                        borderRadius: '50px', 
                                        fontSize: '0.85rem', 
                                        fontWeight: 'bold',
                                        background: task.status === 'Completed' ? 'var(--success)' : (task.status === 'Open' ? '#eeeeee' : '#e3f2fd'),
                                        color: task.status === 'Completed' ? 'white' : (task.status === 'Open' ? '#757575' : '#1976d2')
                                    }}>
                                        Task Status: {task.status}
                                    </span>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {/* Left Side: Assignment Info */}
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    {task.assignments && task.assignments.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span style={{ color: 'var(--success)' }}><strong><CheckCircle size={14} style={{ display: 'inline', position: 'relative', top: '2px' }}/> Active Deployments ({task.assignments.length}):</strong></span>
                                            <div style={{ maxHeight: '80px', overflowY: 'auto', paddingLeft: '1rem', borderLeft: '2px solid var(--success)' }}>
                                            {task.assignments.map(a => (
                                                <div key={a.assignment_id} style={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                                                    <span>• {a.volunteer_name}</span> 
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>[{a.status}]</span>
                                                </div>
                                            ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
                                            <Clock size={16} /> Unassigned
                                        </span>
                                    )}
                                </div>

                                {/* Right Side: Actions based on Role */}
                                <div>
                                    {/* Volunteer Actions */}
                                    {isVolunteer && (
                                        (() => {
                                            const myAssignment = task.assignments?.find(a => a.volunteer_id === user.user_id);
                                            if (myAssignment && myAssignment.status !== 'Completed') {
                                                return (
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        {myAssignment.status === 'Assigned' && (
                                                            <>
                                                                <button className="btn btn-primary btn-sm" onClick={() => handleUpdateAssignment(myAssignment.assignment_id, task.id, 'In Progress')}>Accept</button>
                                                                <button className="btn btn-outline btn-sm" onClick={() => handleUpdateAssignment(myAssignment.assignment_id, task.id, 'Rejected')}>Reject</button>
                                                            </>
                                                        )}
                                                        {myAssignment.status === 'In Progress' && (
                                                            <button className="btn btn-sm" style={{ background: 'var(--success)', color: 'white' }} onClick={() => handleUpdateAssignment(myAssignment.assignment_id, task.id, 'Completed')}>Mark Completed</button>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()
                                    )}

                                    {/* Coordinator Actions */}
                                    {!isVolunteer && task.status !== 'Completed' && (
                                        showAssignForm === task.id ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '300px' }}>
                                                <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '4px', background: 'white' }}>
                                                    {volunteers.map(v => {
                                                        const isAlreadyAssigned = task.assignments?.some(a => a.volunteer_id === v.user_id && a.status !== 'Rejected');
                                                        return (
                                                        <label key={v.user_id} style={{ display: 'block', marginBottom: '4px', opacity: isAlreadyAssigned ? 0.5 : 1 }}>
                                                            <input 
                                                                type="checkbox" 
                                                                disabled={isAlreadyAssigned}
                                                                checked={assigneeIds.includes(v.user_id) || isAlreadyAssigned}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) setAssigneeIds([...assigneeIds, v.user_id]);
                                                                    else setAssigneeIds(assigneeIds.filter(id => id !== v.user_id));
                                                                }}
                                                            /> <strong style={{color: 'var(--text)'}}>{v.name}</strong> <span style={{ fontSize: '0.75rem' }}>({v.skills})</span>
                                                        </label>
                                                    )})}
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button className="btn btn-primary btn-sm" onClick={() => handleAssignTask(task.id)}>Dispatch ({assigneeIds.length})</button>
                                                    <button className="btn-text btn-sm" onClick={() => setShowAssignForm(null)}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button className="btn btn-outline btn-sm" onClick={() => { setShowAssignForm(task.id); setAssigneeIds([]); }}>
                                                <UserPlus size={16} style={{ display: 'inline', marginRight: '4px' }} /> Add Volunteers
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
