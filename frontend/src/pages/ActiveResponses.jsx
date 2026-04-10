import { API_URL } from '../config';
import { useState, useEffect } from 'react';
import { AlertTriangle, Info, PlusCircle, X, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ActiveResponses() {
    const { user } = useAuth();
    const [incidents, setIncidents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editIncident, setEditIncident] = useState(null);
    const [formData, setFormData] = useState({
        type: '',
        severity: '3',
        status: 'Active',
        locationName: ''
    });

    const canManageIncidents = ['Admin', 'Coordinator'].includes(user?.role);

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        try {
            const res = await fetch(`${API_URL}/api/incidents`);
            const data = await res.json();
            setIncidents(data);
        } catch (err) {
            console.error('Failed to fetch incidents', err);
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.locationName) return alert('Location is required');

            // Free Geocoding Call
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.locationName)}`);
            const geoData = await geoRes.json();
            
            if (!geoData || geoData.length === 0) {
                return alert('Could not find that location. Please try adding a City or Province (e.g., "Jasper, AB").');
            }

            const parsedLat = parseFloat(geoData[0].lat);
            const parsedLon = parseFloat(geoData[0].lon);

            const res = await fetch(`${API_URL}/api/incidents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: formData.type,
                    severity: parseInt(formData.severity),
                    status: formData.status,
                    latitude: parsedLat,
                    longitude: parsedLon,
                    created_by: user?.user_id
                })
            });
            if (res.ok) {
                setShowModal(false);
                setFormData({ type: '', severity: '3', status: 'Active', locationName: '' });
                fetchIncidents();
            }
        } catch (err) {
            console.error('Error creating incident', err);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/incidents/${editIncident.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: editIncident.status,
                    severity: parseInt(editIncident.severity)
                })
            });
            if (res.ok) {
                setShowEditModal(false);
                fetchIncidents();
            }
        } catch (err) {
            console.error('Error updating incident', err);
        }
    };

    const openEditModal = (inc) => {
        setEditIncident({ ...inc });
        setShowEditModal(true);
    };

    const getLevelText = (severity) => {
        if (severity >= 5) return 'CRITICAL';
        if (severity >= 4) return 'HIGH';
        if (severity === 3) return 'MODERATE';
        if (severity === 2) return 'LOW';
        return 'ADVISORY';
    };

    const getLevelColor = (severity) => {
        if (severity >= 5) return 'var(--error)';
        if (severity >= 4) return 'var(--warning)';
        if (severity === 3) return '#FBC02D';
        return 'var(--secondary)';
    };

    return (
        <div className="container py-5">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="mb-0">Active Incidents</h1>
                {canManageIncidents && (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <PlusCircle size={20} /> Report Incident
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                {/* Main Feed */}
                <div>
                    {incidents.length === 0 ? (
                        <div className="card text-center text-muted py-5">
                            <AlertTriangle size={48} color="var(--border)" style={{ margin: '0 auto 1rem' }} />
                            <h3>No Active Incidents</h3>
                            <p>The system is currently reporting optimal conditions.</p>
                        </div>
                    ) : (
                        incidents.map(incident => (
                            <div key={incident.id} className="card" style={{ marginBottom: '1.5rem', borderLeft: `6px solid ${getLevelColor(incident.severity)}`, opacity: incident.status === 'Resolved' ? 0.7 : 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                        <AlertTriangle color={getLevelColor(incident.severity)} />
                                        <h2 style={{ fontSize: '1.5rem', margin: 0, textDecoration: incident.status === 'Resolved' ? 'line-through' : 'none' }}>{incident.type}</h2>
                                    </div>
                                    <span style={{ 
                                        fontWeight: 'bold', 
                                        fontSize: '0.85rem', 
                                        color: incident.status === 'Active' ? 'var(--error)' : 'var(--success)',
                                        background: incident.status === 'Active' ? '#ffebee' : '#e8f5e9',
                                        padding: '4px 8px',
                                        borderRadius: '4px'
                                    }}>
                                        {incident.status.toUpperCase()}
                                    </span>
                                </div>
                                
                                <span style={{
                                    background: getLevelColor(incident.severity),
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    marginRight: '1rem'
                                }}>
                                    {getLevelText(incident.severity)}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Reported: {new Date(incident.time).toLocaleString()}
                                </span>

                                <p style={{ marginTop: '1rem', fontSize: '1.05rem' }}>
                                    <strong>Coordinates:</strong> {incident.latitude}, {incident.longitude}
                                </p>

                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
                                    <button className="btn-text" style={{ paddingLeft: 0, color: 'var(--primary)', fontWeight: '600' }}>View Safety Map &rarr;</button>
                                    
                                    {canManageIncidents && (
                                        <button 
                                            className="btn-text" 
                                            style={{ marginLeft: '1rem', color: 'var(--secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                            onClick={() => openEditModal(incident)}
                                        >
                                            <Edit2 size={16} /> Edit Status
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ background: '#E3F2FD', borderColor: '#90CAF9' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                            <Info color="#1976D2" />
                            <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#0D47A1' }}>Preparedness Tips</h3>
                        </div>
                        <ul style={{ fontSize: '0.95rem', display: 'grid', gap: '0.5rem' }}>
                            <li>• Keep gas tanks at least half full.</li>
                            <li>• Have 72h worth of water (4L/person).</li>
                            <li>• Photocopy important ID documents.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Create Incident Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowModal(false)}><X size={24} /></button>
                        <h2 className="mb-4">Report New Incident</h2>
                        
                        <form onSubmit={handleCreateSubmit}>
                            <div className="form-group">
                                <label className="form-label">Incident Type & Location Title</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    required 
                                    placeholder="e.g. Wildfire - Jasper Region"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Severity Level (1-5)</label>
                                <select 
                                    className="form-control" 
                                    value={formData.severity}
                                    onChange={e => setFormData({...formData, severity: e.target.value})}
                                >
                                    <option value="1">1 - Advisory</option>
                                    <option value="2">2 - Low</option>
                                    <option value="3">3 - Moderate</option>
                                    <option value="4">4 - High</option>
                                    <option value="5">5 - Critical</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location (City, Area, or Address)</label>
                                <input 
                                    type="text" 
                                    className="form-control" required 
                                    placeholder="e.g. Jasper, Alberta"
                                    value={formData.locationName}
                                    onChange={e => setFormData({...formData, locationName: e.target.value})}
                                />
                                <small style={{ color: 'var(--text-muted)' }}>Coordinates will be fetched automatically.</small>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit Report</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Incident Modal */}
            {showEditModal && editIncident && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowEditModal(false)}><X size={24} /></button>
                        <h2 className="mb-4">Update Incident Status</h2>
                        
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius)' }}>
                            <strong>{editIncident.type}</strong>
                        </div>

                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select 
                                    className="form-control" 
                                    value={editIncident.status}
                                    onChange={e => setEditIncident({...editIncident, status: e.target.value})}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Severity Level (1-5)</label>
                                <select 
                                    className="form-control" 
                                    value={editIncident.severity}
                                    onChange={e => setEditIncident({...editIncident, severity: e.target.value})}
                                >
                                    <option value="1">1 - Advisory</option>
                                    <option value="2">2 - Low</option>
                                    <option value="3">3 - Moderate</option>
                                    <option value="4">4 - High</option>
                                    <option value="5">5 - Critical</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
