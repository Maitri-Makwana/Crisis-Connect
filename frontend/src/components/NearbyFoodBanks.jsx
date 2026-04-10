import { API_URL } from '../config';
import { useState } from 'react';
import { MapPin, Navigation, Loader, AlertTriangle } from 'lucide-react';

export default function NearbyFoodBanks() {
    const [nearbyResources, setNearbyResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const findNearby = () => {
        setLoading(true);
        setError('');
        
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                // Alternatively, don't pass type if we want ALL resources. But they specifically asked for Food Banks
                try {
                    const res = await fetch(`${API_URL}/api/resources/nearby?lat=${lat}&lng=${lng}&type=Food%20Bank`);
                    const data = await res.json();
                    
                    if (!res.ok) throw new Error(data.error || 'Failed to fetch nearby resources');
                    
                    setNearbyResources(data);
                } catch (err) {
                    setError('Error fetching nearby resources');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError('Unable to retrieve your location. Please check browser permissions.');
                console.error(err);
                setLoading(false);
            }
        );
    };

    return (
        <div className="card mt-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={20} color="var(--primary)" /> Nearby Food Banks
                </h3>
                <button 
                    onClick={findNearby} 
                    className="btn btn-sm btn-outline" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    disabled={loading}
                >
                    {loading ? <Loader size={16} className="spinner" /> : <Navigation size={16} />} 
                    Locate
                </button>
            </div>

            {error && (
                <div style={{ padding: '0.75rem', background: '#ffebee', color: 'var(--error)', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={16} /> {error}
                </div>
            )}

            {!loading && nearbyResources.length === 0 && !error && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    Click locate to discover resources near your current position.
                </p>
            )}

            {!loading && nearbyResources.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
                    {nearbyResources.map((res) => (
                        <li key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', background: '#fafafa' }}>
                            <div>
                                <span style={{ fontWeight: '500', display: 'block' }}>{res.name}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status: {res.status} • Qt: {res.capacity}</span>
                            </div>
                            <div style={{ background: '#e3f2fd', color: '#1976d2', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                {res.distance_km.toFixed(1)} km
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
