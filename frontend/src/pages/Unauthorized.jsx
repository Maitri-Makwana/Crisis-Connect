import { Link } from 'react-router-dom';

export default function Unauthorized() {
    return (
        <div className="container py-5 text-center">
            <h1 style={{ color: 'var(--error)' }}>Unauthorized Access</h1>
            <p className="mb-2">You do not have permission to view this page.</p>
            <Link to="/" className="btn btn-primary">Return Home</Link>
        </div>
    );
}
