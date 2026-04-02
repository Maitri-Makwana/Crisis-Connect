import { Map, Shield, Heart, Zap, Database, Smartphone, X } from 'lucide-react';
import { useState } from 'react';

export default function Services() {
    const [selectedService, setSelectedService] = useState(null);

    const services = [
        {
            icon: <Map size={32} />,
            title: "Geospatial Intelligence",
            desc: "Real-time common operating picture.",
            details: "Our interactive mapping system aggregates data from multiple sources to provide a real-time common operating picture. Responders can filter by resource type, status, and urgency to make informed decisions instantly. Features include heatmaps, route optimization, and danger zone highlighting."
        },
        {
            icon: <Shield size={32} />,
            title: "Volunteer Safety & Tracking",
            desc: "Safety protocols and location tracking.",
            details: "We prioritize safety with automated check-in/check-out protocols and real-time location tracking for field teams operating in hazardous zones. The system triggers alerts if a volunteer goes offline or enters a restricted area without authorization."
        },
        {
            icon: <Database size={32} />,
            title: "Resource Inventory",
            desc: "Centralized database for supplies.",
            details: "A centralized database for shelters, food banks, and medical supplies. This prevents the 'fog of war' logistics issues, avoiding duplication of efforts and preventing shortages before they happen. Supports barcode scanning and real-time stock updates."
        },
        {
            icon: <Zap size={32} />,
            title: "Rapid Dispatch System",
            desc: "Automated alert notifications.",
            details: "Automated alert notifications are sent to registered volunteers based on proximity and skill set match. The system uses a smart algorithm to ensure the right people are deployed to the right tasks, minimizing response time."
        },
        {
            icon: <Smartphone size={32} />,
            title: "Mobile Field Reporting",
            desc: "Update status from smartphones.",
            details: "Field coordinators can update incident status and resource levels directly from their smartphones, even in low-bandwidth areas (Edge/2G). Offline mode queues updates and syncs them once connectivity is restored."
        },
        {
            icon: <Heart size={32} />,
            title: "Donor Transparency",
            desc: "Track where donations go.",
            details: "We provide granular reporting on how funds are converted into aid. Donors can see exactly how their contributions were utilized, whether for purchasing blankets, food kits, or funding logistical operations, building trust through transparency."
        }
    ];

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1>Our Capabilities</h1>
                <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                    Crisis Connect provides a full-stack emergency management suite designed for resilience. Click a service to learn more.
                </p>
            </div>

            <div className="grid-3">
                {services.map((s, i) => (
                    <div
                        key={i}
                        className="card service-card"
                        onClick={() => setSelectedService(s)}
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    >
                        <div className="card-icon">{s.icon}</div>
                        <h3>{s.title}</h3>
                        <p>{s.desc}</p>
                        <small style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Read More &rarr;</small>
                    </div>
                ))}
            </div>

            {/* Modal Overlay */}
            {selectedService && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem'
                }} onClick={() => setSelectedService(null)}>
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '12px',
                        maxWidth: '600px', width: '100%', position: 'relative',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedService(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                            {selectedService.icon}
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>{selectedService.title}</h2>
                        <p style={{ lineHeight: '1.6', fontSize: '1.1rem', color: 'var(--text)' }}>
                            {selectedService.details}
                        </p>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={() => setSelectedService(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
