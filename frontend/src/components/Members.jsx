export default function Members() {
    const team = [
        {
            name: "Maitri Makwana",
            role: "Project Lead / Frontend Developer",
            bio: "Led CrisisConnect end-to-end UI development with a focus on clarity, accessibility, and responsive design for volunteers, coordinators, and responders.",
            skills: ["React", "UI/UX", "Accessibility", "Project Mgmt"],
            email: "maitrinmakwana9@gmail.com",
            linkedin: "https://www.linkedin.com/in/maitrimakwanaa/",
            img: "https://ui-avatars.com/api/?name=Maitri+Makwana&background=random&size=200",
        },
        {
            name: "Harshil Rao",
            role: "Backend Developer / Admin",
            bio: "Contributed to system architecture and backend planning for scalable management of users, resources, and requests in real-world emergency scenarios.",
            skills: ["Node.js", "API Design", "Architecture", "Problem Solving"],
            email: "harshilrao567@gmail.com",
            linkedin: "https://www.linkedin.com/in/harshil-rao-aa44281b0/",
            img: "https://ui-avatars.com/api/?name=Harshil+Rao&background=random&size=200",
        },
        {
            name: "Shivani Patel",
            role: "Quality Assurance / Documentation",
            bio: "Handled testing, validation, and documentation to ensure features meet requirements and remain easy to understand for technical and non-technical users.",
            skills: ["Testing", "Documentation", "Bug Tracking", "Communication"],
            email: "shivani.patel@email.com",
            linkedin: "https://www.linkedin.com/in/shivani-patel-079447294/",
            img: "https://ui-avatars.com/api/?name=Shivani+Patel&background=random&size=200",
        },
        {
            name: "Jalpan Patel",
            role: "System Design / Research",
            bio: "Researched disaster-response workflows and translated them into practical system features supporting coordination between volunteers and responders.",
            skills: ["System Design", "Research", "Process Modeling", "Planning"],
            email: "jalpan.patel@email.com",
            linkedin: "https://www.linkedin.com/in/jalpan-patel-63841a1b5/",
            img: "https://ui-avatars.com/api/?name=Jalpan+Patel&background=random&size=200",
        },
    ];

    return (
        <section className="section py-5">
            <div className="container">
                <div className="page-head">
                    <span className="kicker">Team</span>
                    <h1 className="section-title">Member Profiles</h1>
                    <p className="section-subtitle">
                        CrisisConnect is a capstone platform designed to improve community disaster response through centralized coordination of volunteers, resources, and support.
                    </p>
                </div>

                <div className="card intro-card">
                    <div className="card-body">
                        <h2 className="intro-title">Made By</h2>
                        <p className="intro-names">
                            Maitri Makwana • Harshil Rao • Shivani Patel • Jalpan Patel
                        </p>
                        <p className="intro-text">
                            This project demonstrates full-stack planning, system design thinking, documentation/testing practices, and a real-world product mindset.
                        </p>
                    </div>
                </div>

                <div className="grid-2 member-grid">
                    {team.map((m) => (
                        <article className="card member-card" key={m.name} style={{ padding: '0', overflow: 'hidden' }}>
                            <div className="card-body" style={{ padding: '2rem' }}>
                                <div className="member-top">
                                    <img className="member-avatar" src={m.img} alt={m.name} />
                                    <div>
                                        <h3 className="member-name">{m.name}</h3>
                                        <p className="member-role">{m.role}</p>
                                    </div>
                                </div>

                                <p className="member-bio">{m.bio}</p>

                                <div className="skill-row">
                                    {m.skills.map((s) => (
                                        <span className="chip" key={s}>
                                            {s}
                                        </span>
                                    ))}
                                </div>

                                <div className="member-actions">
                                    <a className="btn btn-ghost" href={`mailto:${m.email}`}>
                                        Email
                                    </a>
                                    <a className="btn btn-primary btn-sm" href={m.linkedin} target="_blank" rel="noreferrer">
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <p className="page-note">
                    CrisisConnect reflects our focus on building meaningful technology that supports communities during critical situations.
                </p>
            </div>
        </section>
    );
}
