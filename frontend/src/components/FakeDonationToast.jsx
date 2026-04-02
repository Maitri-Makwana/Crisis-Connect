import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function FakeDonationToast() {
    const [toast, setToast] = useState(null);

    const locations = ['Toronto', 'Vancouver', 'Calgary', 'Montreal', 'Ottawa', 'Halifax'];
    const names = ['Sarah', 'David', 'Jessica', 'Michael', 'Emily', 'James'];
    const amounts = [25, 50, 100, 200, 10];

    useEffect(() => {
        const triggerToast = () => {
            const name = names[Math.floor(Math.random() * names.length)];
            const loc = locations[Math.floor(Math.random() * locations.length)];
            const amt = amounts[Math.floor(Math.random() * amounts.length)];

            setToast({ name, loc, amt });

            // Hide after 5 seconds
            setTimeout(() => setToast(null), 5000);
        };

        // First toast after 3s, then every 30s
        const firstTimer = setTimeout(triggerToast, 3000);
        const interval = setInterval(triggerToast, 30000);

        return () => {
            clearTimeout(firstTimer);
            clearInterval(interval);
        }
    }, []);

    if (!toast) return null;

    return (
        <div className="toast-container">
            <div className="toast">
                <div style={{ background: 'var(--accent)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
                    <Heart size={16} color="var(--secondary)" fill="var(--secondary)" />
                </div>
                <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>New Donation!</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {toast.name} from {toast.loc} gave <strong>${toast.amt}</strong>
                    </span>
                </div>
            </div>
        </div>
    );
}
