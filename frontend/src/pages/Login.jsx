import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login({ email, password });
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="container py-5">
            <div className="card" style={{ maxWidth: '450px', margin: '2rem auto' }}>
                <h2 className="text-center mb-1">Welcome Back</h2>
                <p className="text-center mb-5" style={{ color: 'var(--text-muted)' }}>Sign in to access the coordination dashboard.</p>

                {error && <div className="alert alert-error">{error}</div>}

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
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="card" style={{ background: '#F5F5F5', padding: '1rem', marginBottom: '1.5rem', border: 'none' }}>
                        <small style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Demo Access Hints:</small>
                        <small style={{ display: 'block' }}>• Admin: <code style={{ color: 'var(--primary)' }}>admin@test.com</code></small>
                        <small style={{ display: 'block' }}>• Coordinator: <code style={{ color: 'var(--primary)' }}>coord@test.com</code></small>
                        <small style={{ display: 'block' }}>• Volunteer: <code style={{ color: 'var(--primary)' }}>vol@test.com</code></small>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Secure Login</button>
                </form>

                <div className="text-center mt-3">
                    <Link to="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'underline' }}>
                        Forgot your password?
                    </Link>
                </div>

                <p className="text-center mt-3" style={{ fontSize: '0.9rem' }}>
                    Not a member? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Join the team</Link>
                </p>
            </div>
        </div>
    );
}
