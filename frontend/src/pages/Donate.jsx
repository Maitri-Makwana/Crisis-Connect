import { useState } from 'react';
import { Heart, Check } from 'lucide-react';
import DonationModal from '../components/DonationModal';

export default function Donate() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1 className="hero-title" style={{ color: 'var(--secondary)', fontSize: '2.5rem' }}>Powering Emergency Response</h1>
                <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', color: 'var(--text-muted)' }}>
                    We are 100% funded by public contributions. Your support ensures that when disaster strikes, we are ready to respond instantly.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
                <div>
                    <h2 className="mb-2">Where Your Money Goes</h2>
                    <ul style={{ display: 'grid', gap: '1rem', fontSize: '1.1rem' }}>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ background: '#E8F5E9', padding: '0.5rem', borderRadius: '50%' }}><Check size={20} color="var(--success)" /></div>
                            <span><strong>40%</strong> - Direct Emergency Aid (Food, Water, Blankets)</span>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ background: '#E3F2FD', padding: '0.5rem', borderRadius: '50%' }}><Check size={20} color="#1976D2" /></div>
                            <span><strong>30%</strong> - Logistics & Transport (Fuel, Trucks)</span>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ background: '#FFEBEE', padding: '0.5rem', borderRadius: '50%' }}><Check size={20} color="var(--primary)" /></div>
                            <span><strong>20%</strong> - Technology & Coordination Platform</span>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ background: '#FFF3E0', padding: '0.5rem', borderRadius: '50%' }}><Check size={20} color="var(--warning)" /></div>
                            <span><strong>10%</strong> - Volunteer Training & Safety Gear</span>
                        </li>
                    </ul>
                </div>
                <div className="card text-center" style={{ borderTop: '6px solid var(--primary)' }}>
                    <h3>Make a Difference Today</h3>
                    <p className="mb-2">Join thousands of Canadians supporting their neighbors.</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary btn-lg btn-pulse" style={{ width: '100%' }}>
                        Donate Now <Heart size={20} fill="white" />
                    </button>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tax receipts issued for donations over $20.</p>
                </div>
            </div>

            {showModal && <DonationModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
