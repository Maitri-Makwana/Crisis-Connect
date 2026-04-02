import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import odhfData from '../data/odhf_sample.json';

// Fix for default Leaflet marker icons when using bundlers like Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icon for Medical Facilities
const medicalIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function DemoMap() {
    const [facilities] = useState(odhfData);
    
    // We will center roughly on Central Canada to show the cross-nation span
    const startPosition = [56.1304, -106.3468]; 
    const startZoom = 4;

    return (
        <div className="container py-5" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 className="mb-2" style={{ color: 'var(--primary)' }}>Healthcare Facilities Demo</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Visualizing a sample of the Canadian Open Database of Healthcare Facilities (ODHF) using React-Leaflet.
                    This map plots {facilities.length} major hospitals directly from standard ODHF JSON architecture.
                </p>
            </div>

            <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <MapContainer center={startPosition} zoom={startZoom} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> | Data: ODHF (StatCan)'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {facilities.map((fac, idx) => (
                        <Marker 
                            key={`fac-${idx}`} 
                            position={[fac.latitude, fac.longitude]}
                            icon={medicalIcon}
                        >
                            <Popup>
                                <div style={{ minWidth: '200px' }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)', fontSize: '1rem' }}>
                                        {fac.facility_name}
                                    </h3>
                                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        <strong>Type:</strong> {fac.facility_type}
                                    </p>
                                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>
                                        {fac.street_no} {fac.street_name}<br/>
                                        {fac.city}, {fac.prov_terr} {fac.postal_code}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
