import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1>Contact Support & Operations</h1>
                <p style={{ color: 'var(--text-muted)' }}>We monitor these channels 24/7 during active emergencies.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
                {/* Info Column */}
                <div>
                    <div className="card mb-2">
                        <h3 className="mb-2">Emergency HQ</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <MapPin color="var(--primary)" />
                            <p>123 Resilience Way<br />Toronto, ON M5V 2T6</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <Phone color="var(--primary)" />
                            <p>1-800-555-0199 (Emergency)</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Mail color="var(--primary)" />
                            <p>ops@crisisconnect.ca</p>
                        </div>
                    </div>

                    <div className="card">
                        <h3>Media Inquiries</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>For press releases and situation reports:</p>
                        <a href="#" style={{ color: 'var(--primary)', fontWeight: '600' }}>media@crisisconnect.ca</a>
                    </div>
                </div>

                {/* Form Column */}
                <div className="card">
                    <h2 className="mb-2">Send a Message</h2>
                    <form>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" placeholder="Jane Doe" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" placeholder="jane@example.com" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Topic</label>
                            <select className="form-control">
                                <option>General Inquiry</option>
                                <option>Report Incident Data Error</option>
                                <option>Volunteer Application Status</option>
                                <option>Partnership / Sponsorship</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Message</label>
                            <textarea className="form-control" rows="5" placeholder="How can we assist you?"></textarea>
                        </div>
                        <button type="button" className="btn btn-primary btn-lg">Submit Inquiry</button>
                    </form>
                </div>
            </div>

            <div style={{ marginTop: '4rem' }}>
                <h2 className="text-center mb-5">Frequently Asked Questions</h2>
                <div className="grid-3">
                    <div>
                        <h4>How do I become a verified responder?</h4>
                        <p style={{ color: 'var(--text-muted)' }}>Sign up as a volunteer, complete the online safety module, and upload your certifications.</p>
                    </div>
                    <div>
                        <h4>Is my donation tax deductible?</h4>
                        <p style={{ color: 'var(--text-muted)' }}>Yes. Crisis Connect is a registered Canadian charity. Recepits are emailed instantly.</p>
                    </div>
                    <div>
                        <h4>Can I request help here?</h4>
                        <p style={{ color: 'var(--text-muted)' }}>If you are in immediate danger, call 911. Use our platform to find shelter and food resources.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
