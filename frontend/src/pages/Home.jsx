import { Link } from 'react-router-dom';
import { Shield, Truck, Users, Activity, MapPin, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h1 className="hero-title" style={{ color: 'white' }}>Coordinating Aid When Every Second Counts</h1>
                        <p className="hero-subtitle" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>
                            Connecting Canadian communities, volunteers, and emergency services during floods, wildfires, and critical incidents.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn btn-primary btn-lg btn-pulse">
                                Volunteer Now
                            </Link>
                            <Link to="/map" className="btn btn-secondary btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'white', backdropFilter: 'blur(4px)' }}>
                                View Live Map
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Status Strip */}
            <div style={{ background: 'var(--secondary)', color: 'white', padding: '1.5rem 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity color="var(--accent)" />
                        <span><strong>Current Status:</strong> Active Response (BC / QC)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Truck color="var(--accent)" />
                        <span><strong>Resources Deployed:</strong> 1,240 Units</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users color="var(--accent)" />
                        <span><strong>Volunteers Active:</strong> 450+</span>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <section className="py-5" style={{ background: 'white' }}>
                <div className="container">
                    <h2 className="section-title">How Crisis Connect Works</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
                        {/* Step 1 */}
                        <div className="text-center" style={{ flex: 1, minWidth: '200px' }}>
                            <div className="card-icon" style={{ background: '#FFEBEE' }}><Activity size={40} /></div>
                            <h3>Incident Reported</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Admins log critical events (Flood, Fire) in real-time.</p>
                        </div>
                        <ArrowRight size={32} color="var(--text-muted)" className="d-none d-md-block" />
                        {/* Step 2 */}
                        <div className="text-center" style={{ flex: 1, minWidth: '200px' }}>
                            <div className="card-icon" style={{ background: '#E3F2FD' }}><Truck size={40} /></div>
                            <h3>Resources Mapped</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Shelters and supplies are tracked via GPS.</p>
                        </div>
                        <ArrowRight size={32} color="var(--text-muted)" className="d-none d-md-block" />
                        {/* Step 3 */}
                        <div className="text-center" style={{ flex: 1, minWidth: '200px' }}>
                            <div className="card-icon" style={{ background: '#E8F5E9' }}><Users size={40} /></div>
                            <h3>Teams Deployed</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Volunteers receive tasks via dashboard.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Teaser */}
            <section className="py-5" style={{ background: 'var(--background)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>Real-Time Situational Awareness</h2>
                            <p className="mb-2" style={{ fontSize: '1.1rem' }}>
                                Our interactive map provides a unified operating picture for coordinators and the public. Track shelter capacity, food bank inventory, and road closures instantly.
                            </p>
                            <ul style={{ marginBottom: '2rem', lineHeight: '2' }}>
                                <li><MapPin size={16} color="var(--primary)" style={{ marginRight: '0.5rem' }} /> Live Resource Tracking</li>
                                <li><Shield size={16} color="var(--primary)" style={{ marginRight: '0.5rem' }} /> Safe Zone Navigation</li>
                                <li><Activity size={16} color="var(--primary)" style={{ marginRight: '0.5rem' }} /> Incident Heatmaps</li>
                            </ul>
                            <Link to="/map" className="btn btn-primary">Explore Live Map</Link>
                        </div>
                        <div className="card" style={{ padding: '0.5rem', transform: 'rotate(2deg)' }}>
                            {/* Placeholder for map image - using a generic map screenshot or div */}
                            <div style={{ background: '#ddd', height: '300px', borderRadius: '4px', overflow: 'hidden' }}>
                                <iframe 
                                    width="100%" height="100%" 
                                    style={{ border: 0 }} 
                                    loading="lazy" 
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11496455.513401566!2d-96.81639999999998!3d54.0205562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sca!4v1712600000000!5m2!1sen!2sca"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-5" style={{ background: 'var(--secondary)', color: 'white' }}>
                <div className="container text-center">
                    <h2 className="section-title" style={{ color: 'white', borderColor: 'white' }}>Our Impact This Year</h2>
                    <div className="grid-3">
                        <div>
                            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--accent)' }}>52</div>
                            <p style={{ fontSize: '1.25rem' }}>Incidents Managed</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary-light)' }}>12k</div>
                            <p style={{ fontSize: '1.25rem' }}>Families Assisted</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--success)' }}>$4M</div>
                            <p style={{ fontSize: '1.25rem' }}>Supplies Distributed</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
