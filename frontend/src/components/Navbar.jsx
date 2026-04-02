import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Search, Globe, Bell, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import DonationModal from './DonationModal';
import { supabase } from '../supabaseClient'; 

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDonateModal, setShowDonateModal] = useState(false);
    
    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    // Click outside handler for dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch and Real-Time listen for Notifications
    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/notifications?user_id=${user.user_id}`);
                const data = await res.json();
                if (Array.isArray(data)) setNotifications(data);
            } catch (err) {
                console.error('Error fetching notifications', err);
            }
        };

        fetchNotifications();

        // Supabase Real-time Subscription
        let channel;
        if (supabase) {
            channel = supabase.channel('custom-insert-channel')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.user_id}` },
                    (payload) => {
                        console.log('New notification!', payload);
                        setNotifications((prev) => [payload.new, ...prev]);
                    }
                )
                .subscribe();
        }

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: 'PUT' });
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error('Error marking as read', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <>
            <header className="navbar-wrapper">
                {/* Row 1: Donation Strip */}
                <div className="nav-strip">
                    <div className="container">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Globe size={16} />
                            <span>Coordinating emergency response across Canada.</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span>Urgent needs in <strong>BC Wildfire Zones</strong></span>
                            <button
                                className="btn btn-sm btn-accent"
                                onClick={() => setShowDonateModal(true)}
                            >
                                Support Crisis Connect
                            </button>
                        </div>
                    </div>
                </div>

                {/* Row 2: Main Header */}
                <div className="nav-header">
                    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Link to="/" className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Heart color="white" fill="white" size={24} />
                            </div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Crisis Connect</span>
                        </Link>

                        {/* Search Bar (Visual Only) */}
                        <div style={{ flex: 1, maxWidth: '400px', margin: '0 2rem', position: 'relative' }} className="d-none d-md-block">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search incidents, resources..."
                                style={{ paddingLeft: '2.5rem', background: 'var(--background)' }}
                            />
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        </div>

                        <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            {user ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    {/* Notifications Dropdown */}
                                    <div ref={notifRef} style={{ position: 'relative' }}>
                                        <button 
                                            className="btn-icon" 
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '0.5rem' }}
                                            onClick={() => setShowNotifications(!showNotifications)}
                                        >
                                            <Bell size={24} color="var(--text)" />
                                            {unreadCount > 0 && (
                                                <span style={{
                                                    position: 'absolute', top: '0', right: '0', background: 'var(--error)', color: 'white',
                                                    fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px',
                                                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </button>

                                        {showNotifications && (
                                            <div style={{
                                                position: 'absolute', top: '100%', right: '0', width: '300px',
                                                background: 'white', border: '1px solid var(--border)', borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000, overflow: 'hidden'
                                            }}>
                                                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <h4 style={{ margin: 0 }}>Notifications</h4>
                                                    {unreadCount > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{unreadCount} Unread</span>}
                                                </div>
                                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                    {notifications.length === 0 ? (
                                                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                            No notifications.
                                                        </div>
                                                    ) : (
                                                        notifications.map(n => (
                                                            <div key={n.id} style={{ 
                                                                padding: '1rem', 
                                                                borderBottom: '1px solid var(--border)',
                                                                background: n.is_read ? 'white' : '#f0f7ff',
                                                                display: 'flex', gap: '1rem', alignItems: 'flex-start'
                                                            }}>
                                                                <div style={{ flex: 1 }}>
                                                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text)' }}>{n.message}</p>
                                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                        {new Date(n.created_at).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                {!n.is_read && (
                                                                    <button 
                                                                        onClick={() => markAsRead(n.id)}
                                                                        title="Mark as Read"
                                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                                                                    >
                                                                        <Check size={18} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                                <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--border)', background: '#fafafa' }}>
                                                    <Link to="/tasks" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }} onClick={() => setShowNotifications(false)}>View Task Inbox</Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ textAlign: 'right', lineHeight: '1.2' }} className="user-text-mobile-hide">
                                        <span style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem' }}>{user.full_name || user.name}</span>
                                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</span>
                                    </div>
                                    <button onClick={logout} className="btn btn-sm btn-outline">Logout</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link to="/login" className="btn btn-sm btn-text">Login</Link>
                                    <Link to="/register" className="btn btn-sm btn-primary">Volunteer Sign Up</Link>
                                </div>
                            )}

                            {/* Mobile Toggle */}
                            <button className="mobile-toggle" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Row 3: Navigation */}
                <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                    <div className="container" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div className="main-links" style={{ display: 'flex', gap: '1.5rem' }}>
                            <Link to="/" className={isActive('/')} style={{ textDecoration: 'none', fontWeight: '500' }}>Home</Link>
                            <Link to="/about" className={isActive('/about')} style={{ textDecoration: 'none', fontWeight: '500' }}>About Us</Link>
                            <Link to="/services" className={isActive('/services')} style={{ textDecoration: 'none', fontWeight: '500' }}>Services</Link>
                            <Link to="/training" className={isActive('/training')} style={{ textDecoration: 'none', fontWeight: '500' }}>Training</Link>
                            <Link to="/news" className={isActive('/news')} style={{ textDecoration: 'none', fontWeight: '500' }}>Active Responses</Link>
                            <Link to="/contact" className={isActive('/contact')} style={{ textDecoration: 'none', fontWeight: '500' }}>Contact</Link>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            {user && (
                                <div className="quick-actions" style={{ display: 'flex', gap: '1rem' }}>
                                    <Link to="/dashboard" className="btn-text" style={{ fontWeight: '600', color: 'var(--secondary)', textDecoration: 'none' }}>Dashboard</Link>
                                    <Link to="/tasks" className="btn-text" style={{ fontWeight: '600', color: 'var(--secondary)', textDecoration: 'none' }}>Tasks</Link>
                                    <Link to="/map" className="btn-text" style={{ fontWeight: '600', color: 'var(--secondary)', textDecoration: 'none' }}>Live Map</Link>
                                    {['Admin', 'Coordinator'].includes(user.role) && (
                                        <Link to="/resources" className="btn-text" style={{ fontWeight: '600', color: 'var(--secondary)', textDecoration: 'none' }}>Resources</Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            {/* Donation Modal Logic (unchanged concept) */}
            {showDonateModal && <DonationModal onClose={() => setShowDonateModal(false)} />}
        </>
    );
}
