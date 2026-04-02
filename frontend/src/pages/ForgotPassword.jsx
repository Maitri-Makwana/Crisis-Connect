import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: data.message || 'If an account exists, a password reset link has been sent to your email.' });
                setEmail('');
            } else {
                setStatus({ type: 'error', message: data.error || 'Failed to process request. Please try again later.' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Network error. Please ensure the server is running.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="card" style={{ maxWidth: '450px', margin: '2rem auto' }}>
                <h2 className="text-center mb-1">Reset Password</h2>
                <p className="text-center mb-5" style={{ color: 'var(--text-muted)' }}>
                    Enter your email to receive a password reset link.
                </p>

                {status.message && (
                    <div className={`alert ${status.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{
                        padding: '1rem', 
                        marginBottom: '1rem', 
                        borderRadius: 'var(--radius)', 
                        backgroundColor: status.type === 'error' ? '#ffebee' : '#e8f5e9',
                        color: status.type === 'error' ? '#c62828' : '#2e7d32',
                        border: `1px solid ${status.type === 'error' ? '#ef9a9a' : '#a5d6a7'}`
                    }}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Processing...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="text-center mt-3" style={{ fontSize: '0.9rem' }}>
                    Remember your password? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Back to Login</Link>
                </p>
            </div>
        </div>
    );
}
