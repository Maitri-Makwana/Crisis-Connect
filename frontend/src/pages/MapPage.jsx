import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Filter, Layers, Navigation } from 'lucide-react';

// Fix typical Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;

// Custom Marker Icons using divIcon for easy coloring
const createCustomIcon = (color, shape = 'circle') => {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
            background-color: ${color};
            width: ${shape === 'square' ? '16px' : '14px'};
            height: ${shape === 'square' ? '16px' : '14px'};
            border-radius: ${shape === 'square' ? '2px' : '50%'};
            border: 2px solid white;
            box-shadow: 0 0 4px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

const getResourceColor = (status) => {
    switch (status) {
        case 'Available': return 'var(--success)';
        case 'Low': return 'var(--warning)';
        case 'Full': case 'Closed': return 'var(--error)';
        default: return 'var(--text-muted)';
    }
};

const getIncidentColor = (severity) => {
    if (severity >= 5) return 'var(--error)';
    if (severity >= 4) return 'var(--warning)';
    if (severity === 3) return '#FBC02D';
    return 'var(--secondary)';
};

export default function MapPage() {
    const [resources, setResources] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [revGeoLocation, setRevGeoLocation] = useState('Loading location...');
    const [filters, setFilters] = useState({
        showResources: true,
        showIncidents: true,
        resourceType: 'All',
        status: 'All'
    });

    useEffect(() => {
        fetchData();
        // Simple polling for real-time feel since the backend is local API
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [resData, incData, tasksData] = await Promise.all([
                fetch('http://localhost:5000/api/resources').then(r => r.json()),
                fetch('http://localhost:5000/api/incidents').then(r => r.json()),
                fetch('http://localhost:5000/api/tasks').then(r => r.json())
            ]);
            setResources(resData);
            setIncidents(incData);
            setTasks(tasksData);
        } catch (err) {
            console.error('Map Data fetch error', err);
        }
    };

    const filteredResources = resources.filter(r => {
        if (!filters.showResources) return false;
        if (filters.resourceType !== 'All' && r.type !== filters.resourceType) return false;
        if (filters.status !== 'All' && r.status !== filters.status) return false;
        return true;
    });

    const filteredIncidents = incidents.filter(i => {
        if (!filters.showIncidents) return false;
        if (i.status === 'Resolved') return false; // Only show active incidents on map
        return true;
    });

    // Handle reverse geocoding when an incident is selected
    useEffect(() => {
        if (!selectedIncident) return;
        setRevGeoLocation('Fetching location...');
        
        const fetchLocation = async () => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedIncident.latitude}&lon=${selectedIncident.longitude}`);
                const data = await res.json();
                if (data && data.display_name) {
                    setRevGeoLocation(data.display_name);
                } else {
                    setRevGeoLocation('Location unavailable');
                }
            } catch (e) {
                setRevGeoLocation('Error fetching address');
            }
        };
        fetchLocation();
    }, [selectedIncident]);

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 70px)' }}> {/* Assuming 70px Navbar */}
            {/* Map Sidebar */}
            <div style={{ width: '300px', background: 'var(--card-bg)', borderRight: '1px solid var(--border)', padding: '1.5rem', overflowY: 'auto' }}>
                <h2 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={24} color="var(--primary)" /> Map Layers
                </h2>

                <div className="mb-4">
                    <h3 className="mb-2" style={{ fontSize: '1rem' }}>Display Toggles</h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            checked={filters.showIncidents} 
                            onChange={e => setFilters({...filters, showIncidents: e.target.checked})} 
                        />
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 12, height: 12, background: 'var(--error)', borderRadius: '2px' }}></div> 
                            Active Incidents
                        </span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            checked={filters.showResources} 
                            onChange={e => setFilters({...filters, showResources: e.target.checked})} 
                        />
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 12, height: 12, background: 'var(--success)', borderRadius: '50%' }}></div> 
                            Available Resources
                        </span>
                    </label>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />

                <div className="mb-4">
                    <h3 className="mb-2" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={16} /> Resource Filters
                    </h3>
                    
                    <div className="form-group mb-3">
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Resource Type</label>
                        <select 
                            className="form-control" style={{ padding: '0.4rem', fontSize: '0.9rem' }}
                            value={filters.resourceType}
                            onChange={e => setFilters({...filters, resourceType: e.target.value})}
                        >
                            <option value="All">All Types</option>
                            <option value="Shelter">Shelter</option>
                            <option value="Food">Food</option>
                            <option value="Medical">Medical</option>
                            <option value="Water">Water</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Availability Status</label>
                        <select 
                            className="form-control" style={{ padding: '0.4rem', fontSize: '0.9rem' }}
                            value={filters.status}
                            onChange={e => setFilters({...filters, status: e.target.value})}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Available">Available</option>
                            <option value="Low">Low</option>
                            <option value="Full">Full</option>
                        </select>
                    </div>
                </div>

                <div className="card" style={{ background: 'var(--background)', padding: '1rem', marginTop: 'auto' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Live Stats</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        <span color="var(--text-muted)">Incidents:</span>
                        <strong>{filteredIncidents.length}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span color="var(--text-muted)">Resources:</span>
                        <strong>{filteredResources.length}</strong>
                    </div>
                </div>
            </div>

            {/* Map Area */}
            <div style={{ flex: 1, position: 'relative' }}>
                {/* Fallback coordinates if no data is present, centered on Canada */}
                <MapContainer center={[56.1304, -106.3468]} zoom={4} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    {/* Render Incidents */}
                    {filteredIncidents.map(incident => (
                        <Marker 
                            key={`inc-${incident.id}`} 
                            position={[incident.latitude, incident.longitude]}
                            icon={createCustomIcon(getIncidentColor(incident.severity), 'square')}
                        >
                            <Popup>
                                <div>
                                    <strong style={{ fontSize: '1.1rem', color: 'var(--error)', display: 'block', marginBottom: '0.25rem' }}>{incident.type}</strong>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.8rem', background: '#ffebee', color: 'var(--error)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                                            Severity: {incident.severity} / 5
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Reported: {new Date(incident.time).toLocaleTimeString()}</p>
                                    <button 
                                        className="btn btn-sm btn-outline" 
                                        style={{ width: '100%' }}
                                        onClick={() => setSelectedIncident(incident)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Render Resources */}
                    {filteredResources.map(resource => (
                        <Marker 
                            key={`res-${resource.id}`} 
                            position={[resource.latitude, resource.longitude]}
                            icon={createCustomIcon(getResourceColor(resource.status), 'circle')}
                        >
                            <Popup>
                                <div>
                                    <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.25rem' }}>{resource.name}</strong>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: '600' }}>{resource.type}</span>
                                        <span style={{ fontSize: '0.85rem', color: getResourceColor(resource.status), fontWeight: '600' }}>{resource.status}</span>
                                    </div>
                                    
                                    {resource.capacity && <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>Capacity/Qty: <strong>{resource.capacity}</strong></p>}
                                    {resource.contact && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Contact: {resource.contact}</p>}
                                    
                                    <button className="btn btn-sm btn-primary" style={{ width: '100%' }}><Navigation size={14} style={{ display: 'inline', marginRight: '4px' }}/> Get Directions</button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Incident Details Modal */}
            {selectedIncident && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    background: 'rgba(0,0,0,0.5)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ color: 'var(--error)', marginBottom: '0.5rem' }}>{selectedIncident.type}</h2>
                                <span style={{ background: '#ffebee', color: 'var(--error)', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold' }}>
                                    Severity: {selectedIncident.severity} / 5
                                </span>
                            </div>
                            <button className="btn btn-outline" onClick={() => setSelectedIncident(null)}>Close</button>
                        </div>
                        
                        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '8px' }}>
                                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Exact Location</h4>
                                <p style={{ fontSize: '0.95rem', fontWeight: '500' }}>{revGeoLocation}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lat: {selectedIncident.latitude}, Lon: {selectedIncident.longitude}</p>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '8px' }}>
                                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Time Reported</h4>
                                <p style={{ fontSize: '0.95rem', fontWeight: '500' }}>{new Date(selectedIncident.time).toLocaleString()}</p>
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />

                        <h3 className="mb-3">Deployment Status</h3>
                        {(() => {
                            const safeTasks = Array.isArray(tasks) ? tasks : [];
                            const incidentTasks = safeTasks.filter(t => t.incident_id === selectedIncident.id);
                            const totalAssignments = incidentTasks.reduce((sum, task) => sum + (task.assignments?.length || 0), 0);
                            
                            return (
                                <div>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ flex: 1, padding: '1rem', background: '#e3f2fd', borderRadius: '8px', color: '#1976d2' }}>
                                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{incidentTasks.length}</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Active Tasks</div>
                                        </div>
                                        <div style={{ flex: 1, padding: '1rem', background: '#e8f5e9', borderRadius: '8px', color: '#2e7d32' }}>
                                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalAssignments}</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Volunteers Deployed</div>
                                        </div>
                                    </div>

                                    {incidentTasks.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {incidentTasks.map(task => (
                                                <div key={task.id} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '4px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                        <strong>{task.task_type}</strong>
                                                        <span style={{ fontSize: '0.85rem', color: task.status === 'Completed' ? 'var(--success)' : 'var(--warning)' }}>{task.status}</span>
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{task.description}</p>
                                                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                                        <strong>Deployed: </strong>
                                                        {task.assignments && task.assignments.length > 0
                                                            ? task.assignments.map(a => a.volunteer_name).join(', ')
                                                            : <span style={{ color: 'var(--error)' }}>None</span>
                                                        }
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: 'var(--text-muted)' }}>No tasks have been created for this incident yet.</p>
                                    )}
                                </div>
                            );
                        })()}

                    </div>
                </div>
            )}
        </div>
    );
}
