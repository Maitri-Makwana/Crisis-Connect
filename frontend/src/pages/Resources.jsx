import { API_URL } from '../config';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Resources() {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Shelter',
        status: 'Available',
        locationName: '',
        capacity: '',
        contact: ''
    });

    const [editingState, setEditingState] = useState(null);

    const canManageResources = ['Admin', 'Coordinator'].includes(user?.role);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const res = await fetch(`${API_URL}/api/resources`);
            const data = await res.json();
            setResources(data);
        } catch (err) {
            console.error('Failed to fetch resources:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.locationName) return alert('Location is required');

            // Free Geocoding Call
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.locationName)}`);
            const geoData = await geoRes.json();
            
            if (!geoData || geoData.length === 0) {
                return alert('Could not find that location. Please try adding a City or Province.');
            }

            const parsedLat = parseFloat(geoData[0].lat);
            const parsedLon = parseFloat(geoData[0].lon);

            const res = await fetch(`${API_URL}/api/resources`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    type: formData.type,
                    status: formData.status,
                    latitude: parsedLat,
                    longitude: parsedLon,
                    capacity: formData.capacity ? parseInt(formData.capacity) : null,
                    contact: formData.contact
                })
            });
            if (res.ok) {
                setFormData({ name: '', type: 'Shelter', status: 'Available', locationName: '', capacity: '', contact: '' });
                fetchResources();
            }
        } catch (err) {
            console.error('Failed to create resource', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        try {
            const res = await fetch(`${API_URL}/api/resources/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchResources();
            }
        } catch (err) {
            console.error('Failed to delete resource', err);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/api/resources/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setEditingState(null);
                fetchResources();
            }
        } catch (err) {
            console.error('Failed to update resource', err);
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case 'Available': return 'var(--success)';
            case 'Low': return 'var(--warning)';
            case 'Full': case 'Closed': return 'var(--error)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className="container py-5">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="mb-0">Resource Management</h1>
                <button className="btn btn-outline" onClick={fetchResources}>
                    ↻ Refresh
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: canManageResources ? '1fr 2fr' : '1fr', gap: '2rem' }}>
                {/* Create Form - Only for Admin/Coordinator */}
                {canManageResources && (
                    <div className="card">
                        <h3 className="mb-2">Add New Resource</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Resource Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select
                                    className="form-control"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option>Shelter</option>
                                    <option>Food</option>
                                    <option>Medical</option>
                                    <option>Water</option>
                                    <option>Tools</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Operational Status</label>
                                <select
                                    className="form-control"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option>Available</option>
                                    <option>Low</option>
                                    <option>Full</option>
                                    <option>Closed</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location (Address, City)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    placeholder="e.g. 100 Queen St W, Toronto"
                                    value={formData.locationName}
                                    onChange={e => setFormData({ ...formData, locationName: e.target.value })}
                                />
                                <small style={{ color: 'var(--text-muted)' }}>Coordinates generate automatically.</small>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Capacity / Quantity (Opt)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="e.g. 50 beds or 100 boxes"
                                    value={formData.capacity}
                                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Contact Info (Opt)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.contact}
                                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}><Plus size={18} /> Add to System</button>
                        </form>
                    </div>
                )}

                {/* List */}
                <div>
                    <h3 className="mb-2">Active Inventory</h3>
                    {resources.length === 0 ? (
                        <div className="card text-center text-muted">
                            <p>No resources registered in the system.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {resources.map(res => (
                                <div key={res.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', opacity: res.status === 'Closed' ? 0.6 : 1 }}>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem', fontSize: '1.2rem' }}>{res.name}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            <span style={{ fontWeight: '600', color: 'var(--secondary)' }}>{res.type}</span>
                                            {res.capacity && <span>Qty: {res.capacity}</span>}
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {res.latitude}, {res.longitude}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                        {editingState === res.id ? (
                                            <select 
                                                className="form-control" 
                                                style={{ width: 'auto', padding: '0.25rem' }}
                                                value={res.status}
                                                onChange={(e) => handleUpdateStatus(res.id, e.target.value)}
                                                onBlur={() => setEditingState(null)}
                                            >
                                                <option>Available</option>
                                                <option>Low</option>
                                                <option>Full</option>
                                                <option>Closed</option>
                                            </select>
                                        ) : (
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '50px',
                                                background: statusColor(res.status),
                                                color: 'white',
                                                fontSize: '0.85rem',
                                                fontWeight: '600'
                                            }}>
                                                {res.status}
                                            </span>
                                        )}
                                        
                                        {canManageResources && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button 
                                                    className="btn-text" 
                                                    style={{ color: 'var(--primary)', padding: '0.25rem' }}
                                                    onClick={() => setEditingState(res.id)}
                                                    title="Quick Edit Status"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    className="btn-text" 
                                                    style={{ color: 'var(--error)', padding: '0.25rem' }}
                                                    onClick={() => handleDelete(res.id)}
                                                    title="Delete Resource"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
