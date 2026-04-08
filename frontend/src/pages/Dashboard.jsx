import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Map, List, UserCheck, AlertCircle, FileText, Settings, Shield, Users, Radio, Activity, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import NearbyFoodBanks from '../components/NearbyFoodBanks';

export default function Dashboard() {
    const { user } = useAuth();

    // Default to Volunteer if somehow undefined
    const role = user?.role || 'Volunteer';

    const [tasks, setTasks] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [showVolunteersModal, setShowVolunteersModal] = useState(false);

    useEffect(() => {
        if (role === 'Coordinator' || role === 'Admin') {
            fetch('http://localhost:5000/api/tasks').then(r => r.json()).then(d => { if(Array.isArray(d)) setTasks(d) }).catch(e => console.error(e));
            fetch('http://localhost:5000/api/incidents').then(r => r.json()).then(d => { if(Array.isArray(d)) setIncidents(d) }).catch(e => console.error(e));
            fetch('http://localhost:5000/api/users?role=Volunteer').then(r => r.json()).then(d => { if(Array.isArray(d)) setVolunteers(d) }).catch(e => console.error(e));
        } else if (role === 'Volunteer' && user?.user_id) {
            fetch(`http://localhost:5000/api/tasks?volunteer_id=${user.user_id}`).then(r => r.json()).then(d => { if(Array.isArray(d)) setTasks(d) }).catch(e => console.error(e));
        }
    }, [role, user?.user_id]);

    const activeIncidents = incidents.filter(i => i.status === 'Active').length;
    const pendingTasksCount = role === 'Volunteer' 
        ? tasks.filter(t => t.assignments?.some(a => Number(a.volunteer_id) === Number(user.user_id) && a.status === 'Assigned')).length
        : tasks.filter(t => t.status === 'Open' || !t.volunteer_id).length;
    const myActiveTasksCount = role === 'Volunteer'
        ? tasks.filter(t => t.assignments?.some(a => Number(a.volunteer_id) === Number(user.user_id) && a.status === 'In Progress')).length
        : 0;

    const renderAdminDashboard = () => (
        <>
            <div className="grid-3 mb-5">
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ background: '#FFEBEE', padding: '1rem', borderRadius: '50%' }}><Shield color="var(--primary)" /></div>
                    <div><h3 style={{ margin: 0, fontSize: '1.5rem' }}>System</h3><p style={{ margin: 0, color: 'var(--text-muted)' }}>Status: Nominal</p></div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                    <div style={{ background: '#E3F2FD', padding: '1rem', borderRadius: '50%' }}><Users color="#1976D2" /></div>
                    <div><h3 style={{ margin: 0, fontSize: '1.5rem' }}>24</h3><p style={{ margin: 0, color: 'var(--text-muted)' }}>Active Users</p></div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                    <div style={{ background: '#E8F5E9', padding: '1rem', borderRadius: '50%' }}><AlertCircle color="var(--success)" /></div>
                    <div><h3 style={{ margin: 0, fontSize: '1.5rem' }}>1</h3><p style={{ margin: 0, color: 'var(--text-muted)' }}>Active Incident</p></div>
                </div>
            </div>

            <h2 className="mb-2">Admin Controls</h2>
            <div className="grid-3 mb-5">
                <Link to="/map" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Map size={32} className="mb-2" color="var(--primary)" />
                    <h3>Live Operations Map</h3>
                    <p>Global overview of all incidents and resources.</p>
                </Link>
                <Link to="/resources" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <List size={32} className="mb-2" color="var(--secondary)" />
                    <h3>Resource Manager</h3>
                    <p>Manage system-wide resource availability.</p>
                </Link>
                <div className="card" style={{ cursor: 'pointer' }} onClick={() => alert('User Management coming soon!')}>
                    <Users size={32} className="mb-2" color="#1976D2" />
                    <h3>User Management</h3>
                    <p>Approve new coordinators and manage roles.</p>
                </div>
            </div>
        </>
    );

    const renderCoordinatorDashboard = () => (
        <>
            <div className="grid-3 mb-5">
                <Link to="/tasks" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderLeft: '4px solid var(--accent)', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ background: '#FFF8E1', padding: '1rem', borderRadius: '50%' }}><Radio color="var(--warning)" /></div>
                    <div><h3 style={{ margin: 0, fontSize: '1.5rem' }}>{pendingTasksCount}</h3><p style={{ margin: 0, color: 'var(--text-muted)' }}>Pending Tasks</p></div>
                </Link>
                <Link to="/news" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ background: '#E3F2FD', padding: '1rem', borderRadius: '50%' }}><AlertCircle color="#1976D2" /></div>
                    <div><h3 style={{ margin: 0, fontSize: '1.5rem' }}>{activeIncidents}</h3><p style={{ margin: 0, color: 'var(--text-muted)' }}>Active Incidents</p></div>
                </Link>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', cursor: 'pointer' }} onClick={() => setShowVolunteersModal(true)}>
                    <div style={{ background: '#E8F5E9', padding: '1rem', borderRadius: '50%' }}><UserCheck color="var(--success)" /></div>
                    <div><h3 style={{ margin: 0, fontSize: '1.5rem' }}>{volunteers.length}</h3><p style={{ margin: 0, color: 'var(--text-muted)' }}>Volunteers Online</p></div>
                </div>
            </div>

            <h2 className="mb-2">Coordinator Actions</h2>
            <div className="grid-3 mb-5">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <Link to="/news" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Activity size={18} /> Manage Incidents
                </Link>
                <Link to="/resources" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Activity size={18} /> Resource Inventory
                </Link>
                <Link to="/tasks" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Users size={18} /> Assign Tasks
                </Link>
                <Link to="/map" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Map size={18} /> View Live Map
                </Link>
            </div>
            </div>
        </>
    );

    const renderVolunteerDashboard = () => (
        <>
            <div className="grid-3 mb-5">
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
                    <div style={{ background: '#E8F5E9', padding: '1rem', borderRadius: '50%' }}><UserCheck color="var(--success)" /></div>
                    <div><h3 style={{ margin: 0, fontSize: '1.5rem' }}>Ready</h3><p style={{ margin: 0, color: 'var(--text-muted)' }}>Duty Status</p></div>
                </div>
                <Link to="/tasks" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ background: '#FFF8E1', padding: '1rem', borderRadius: '50%' }}><FileText color="var(--warning)" /></div>
                    <div><h3 style={{ margin: 0, fontSize: '1.5rem' }}>{myActiveTasksCount}</h3><p style={{ margin: 0, color: 'var(--text-muted)' }}>Active Tasks</p></div>
                </Link>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                    <div style={{ background: '#E3F2FD', padding: '1rem', borderRadius: '50%' }}><Map color="#1976D2" /></div>
                    <div><h3 style={{ margin: 0, fontSize: '1.5rem' }}>14km</h3><p style={{ margin: 0, color: 'var(--text-muted)' }}>Nearest Incident</p></div>
                </div>
            </div>

            <h2 className="mb-2">My Operations</h2>
            <div className="grid-3 mb-5">
                <Link to="/tasks" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <List size={32} className="mb-2" color="var(--secondary)" />
                    <h3>Task Inbox</h3>
                    <p>View and accept new field assignments from coordinators.</p>
                </Link>
                <Link to="/map" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Map size={32} className="mb-2" color="var(--primary)" />
                    <h3>Resource Map</h3>
                    <p>Find nearest shelters, medical stations, and supplies.</p>
                </Link>
                <div className="card" style={{ cursor: 'pointer' }}>
                    <Settings size={32} className="mb-2" color="var(--secondary)" />
                    <h3>Profile & Settings</h3>
                    <p>Update your location and availability status.</p>
                </div>
            </div>

            <NearbyFoodBanks />
        </>
    );

    return (
        <div className="container py-5">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="mb-0">{role} Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, <strong>{user?.name}</strong></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '600' }}>
                        LIVE MODE
                    </span>
                </div>
            </div>

            {role === 'Admin' && renderAdminDashboard()}
            {role === 'Coordinator' && renderCoordinatorDashboard()}
            {role === 'Volunteer' && renderVolunteerDashboard()}
            
            {/* Volunteers Modal */}
            {showVolunteersModal && (
                <div className="modal-overlay" onClick={() => setShowVolunteersModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>Active Volunteers</h3>
                            <button className="btn-icon" onClick={() => setShowVolunteersModal(false)}><X size={20} /></button>
                        </div>
                        {volunteers.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>No volunteers are currently registered.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
                                {volunteers.map(v => (
                                    <div key={v.user_id} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {v.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{v.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.email}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
