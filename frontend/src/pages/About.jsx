import { useState } from 'react';
import Members from '../components/Members';

export default function About() {
    const [activeTab, setActiveTab] = useState('website');

    return (
        <div className="container py-5">
            <h1 className="text-center mb-5">About Crisis Connect</h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <button
                    className={`btn ${activeTab === 'website' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('website')}
                >
                    Our Mission
                </button>
                <button
                    className={`btn ${activeTab === 'members' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('members')}
                >
                    Our Team
                </button>
            </div>

            <div className="card" style={{ minHeight: '400px', border: activeTab === 'members' ? 'none' : '1px solid var(--border)', background: activeTab === 'members' ? 'transparent' : 'white', padding: activeTab === 'members' ? '0' : '2rem' }}>
                {activeTab === 'website' && (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2>Bridging the Gap in Emergency Response</h2>
                        <p className="mb-2" style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                            Founded in 2024, Crisis Connect was built to solve a critical problem: the coordination chaos that occurs during natural disasters.
                        </p>
                        <p className="mb-2">
                            When floods, wildfires, or ice storms strike Canadian communities, resources often exist but aren't visible to those who need them. Crisis Connect acts as the central nervous system for emergency management.
                        </p>
                        <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
                        <h3>Our Core Values</h3>
                        <ul style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                            <li><strong>Transparency:</strong> Real-time data accessible to all stakeholders.</li>
                            <li><strong>Speed:</strong> Reducing response times from hours to minutes.</li>
                            <li><strong>Community:</strong> Empowering local volunteers to lead recovery.</li>
                        </ul>
                    </div>
                )}

                {/* New Members Component */}
                {activeTab === 'members' && (
                    <Members />
                )}
            </div>
        </div>
    );
}
