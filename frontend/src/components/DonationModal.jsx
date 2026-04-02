import { useState } from 'react';
import { X, Heart, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DonationModal({ onClose, onDonate }) {
    const [amount, setAmount] = useState(50);
    const [customAmount, setCustomAmount] = useState('');

    const handleDonate = () => {
        const finalAmount = customAmount ? customAmount : amount;
        if (onDonate) onDonate(finalAmount);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-modal" onClick={onClose}><X size={24} /></button>

                <div className="text-center mb-5">
                    <Heart size={48} color="var(--primary)" fill="var(--primary)" style={{ opacity: 0.1, position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: -1 }} />
                    <h2 style={{ fontSize: '1.75rem' }}>Support the Cause</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Your contribution directly aids emergency response.</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Select Amount</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                        {[25, 50, 100].map(val => (
                            <button
                                key={val}
                                className={`btn ${amount === val && !customAmount ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => { setAmount(val); setCustomAmount(''); }}
                            >
                                ${val}
                            </button>
                        ))}
                    </div>
                    <input
                        type="number"
                        placeholder="Custom Amount"
                        className="form-control"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        onClick={() => setAmount(0)}
                    />
                </div>

                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleDonate}>
                    <CreditCard size={20} /> Donate ${customAmount || amount}
                </button>

                <p className="text-center" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                    By donating, you agree to our terms. <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>See your impact here</Link>.
                </p>
            </div>
        </div>
    );
}
