import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Volunteer'
    });
    const { register } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
        } catch (err) {
            setError(err.message || 'Failed to create account');
        }
    };

    return (
        <div className="container py-5">
            <div className="card" style={{ maxWidth: '550px', margin: '2rem auto' }}>
                <h2 className="text-center mb-1">Join the Response Team</h2>
                <p className="text-center mb-5" style={{ color: 'var(--text-muted)' }}>Create an account to coordinate or volunteer.</p>
                {error && <div className="alert alert-danger mb-3" style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">I want to help as:</label>
                        <select
                            className="form-control"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            style={{ height: '50px' }} // fix height for select
                        >
                            <option value="Volunteer">Volunteer (General Help)</option>
                            <option value="Coordinator">Coordinator (Manage Resources)</option>
                            <option value="Admin">Administrator</option>
                        </select>
                        <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                            *Note: Coordinator roles require manual approval in a live system.
                        </small>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Create Account</button>
                </form>

                <p className="text-center mt-3" style={{ fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
}
