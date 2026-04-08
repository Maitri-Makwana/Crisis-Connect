async function run() {
    try {
        const res = await fetch('http://127.0.0.1:5000/api/tasks/1/assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({volunteer_ids: [5], assigned_by: 2})
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Body:', data);
    } catch(err) {
        console.error('Fetch error:', err);
    }
}
run();
