import { FileText, Play, Users, Heart, Thermometer, Activity, Sun, Brain } from 'lucide-react';

export default function Training() {
    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1>Training & Resources</h1>
                <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                    Equip yourself with the knowledge to save lives. Access our library of first aid tips, posters, and training videos.
                </p>
            </div>

            {/* Section 1: First Aid Tips */}
            <section className="mb-5">
                <h2 className="mb-4">First Aid Tips</h2>
                <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                    <div className="card text-center" style={{ padding: '2rem' }}>
                        <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Activity size={48} /></div>
                        <h5>First Aid Safety</h5>
                    </div>
                    <div className="card text-center" style={{ padding: '2rem' }}>
                        <div style={{ color: '#00BFA5', marginBottom: '1rem' }}><Thermometer size={48} /></div>
                        <h5>Winter Safety</h5>
                    </div>
                    <div className="card text-center" style={{ padding: '2rem' }}>
                        <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}><Heart size={48} /></div>
                        <h5>Heart Attack Safety</h5>
                    </div>
                    <div className="card text-center" style={{ padding: '2rem' }}>
                        <div style={{ color: '#FF9800', marginBottom: '1rem' }}><Sun size={48} /></div>
                        <h5>Summer Safety</h5>
                    </div>
                    <div className="card text-center" style={{ padding: '2rem' }}>
                        <div style={{ color: '#9C27B0', marginBottom: '1rem' }}><Brain size={48} /></div>
                        <h5>Mental Health</h5>
                    </div>
                </div>
            </section>

            {/* Section 2: Educational Resources (PDFs) */}
            <section className="mb-5" style={{ background: '#f8f9fa', padding: '3rem', borderRadius: '1rem' }}>
                <h2 className="mb-4">Educational Posters</h2>
                <div className="grid-3">
                    <div className="card">
                        <div style={{ background: '#0277BD', color: 'white', padding: '1rem', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold' }}>CPR for a Baby</span>
                            <FileText size={20} />
                        </div>
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <p className="mb-3">Step-by-step guide for infant CPR.</p>
                            <a href="https://www.redcross.org/content/dam/redcross/atg/PDFs/Take_a_Class/Pediatric_ready_reference.pdf" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'block', width: '100%' }}>Download PDF</a>
                        </div>
                    </div>
                    <div className="card">
                        <div style={{ background: '#00695C', color: 'white', padding: '1rem', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold' }}>AED - Call, Push, Shock</span>
                            <FileText size={20} />
                        </div>
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <p className="mb-3">How to use an AED effectively.</p>
                            <a href="https://www.redcross.ca/crc/documents/3-1-2-AED-Checklist_EN.pdf" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'block', width: '100%' }}>Download PDF</a>
                        </div>
                    </div>
                    <div className="card">
                        <div style={{ background: '#C62828', color: 'white', padding: '1rem', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold' }}>Choking Adult</span>
                            <FileText size={20} />
                        </div>
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <p className="mb-3">Heimlich maneuver instructions.</p>
                            <a href="https://www.redcross.org/content/dam/redcross/atg/PDFs/Take_a_Class/ConsciousChokingPoster.pdf" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'block', width: '100%' }}>Download PDF</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Group Training */}
            <section className="mb-5">
                <div className="card" style={{ background: 'var(--primary)', color: 'white', padding: '0', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                    <div style={{ padding: '3rem' }}>
                        <h2 style={{ color: 'white' }}>Group Training for Teams</h2>
                        <p className="mb-4" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                            Equip your team with personalized safety training. Whether you need to ensure the safety of your crew or meet government regulations, we offer flexible group training options.
                        </p>
                        <ul className="mb-4" style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={20} /> Customized Workshops</li>
                            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={20} /> On-site Certification</li>
                            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={20} /> Virtual Refreshers</li>
                        </ul>
                        <button className="btn btn-accent btn-lg">Request Training</button>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                        {/* Placeholder for image, using icon for now */}
                        <Users size={120} style={{ opacity: 0.5 }} />
                    </div>
                </div>
            </section>

            {/* Section 4: Training Videos */}
            <section>
                <h2 className="mb-4">Training Videos</h2>
                <div className="grid-3">
                    <div className="card">
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem', background: '#000' }}>
                            <iframe
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                src="https://www.youtube.com/embed/msGasJkSvzE"
                                title="Training Video 1"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <h4>Disaster Response Overview</h4>
                    </div>
                    <div className="card">
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem', background: '#000' }}>
                            <iframe
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                src="https://www.youtube.com/embed/BLEPakj1YTY"
                                title="Training Video 2"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <h4>Community Coordination</h4>
                    </div>
                    <div className="card">
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem', background: '#000' }}>
                            <iframe
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                src="https://www.youtube.com/embed/7EDflnGzjTY"
                                title="Training Video 3"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <h4>Safety Best Practices</h4>
                    </div>
                </div>
            </section>
        </div>
    );
}
