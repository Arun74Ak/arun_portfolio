import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { submitContact } from './api';

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ['Home', 'About', 'Experience', 'Projects', 'Skills', 'Certifications', 'Contact'];

const SKILLS = {
  'Backend Development': ['Node.js', 'Express.js', 'Python', 'Django'],
  'Frontend Development': ['React.js', 'JavaScript', 'Redux', 'HTML5', 'CSS3'],
  'Database & Tools': ['MongoDB', 'MySQL', 'SQL'],
  'Soft Skills': ['Code Reviews', 'Debugging & Optimization', 'Agile Collaboration', 'RBAC Design'],
};

const PROJECTS = [
  {
    name: 'Humb Exchange',
    type: 'Cryptocurrency Trading Platform',
    emoji: '₿',
    color: '#f59e0b',
    points: [
      'Implemented secure user authentication & onboarding workflows: login, registration, OTP verification, email verification, and social login (Google).',
      'Developed real-time support chat and notifications using Socket.io for low-latency, bi-directional data flow.',
      'Integrated security and anti-fraud mechanisms including Google reCAPTCHA, Twilio SMS OTP, and SMTP-based email services.',
    ],
    tags: ['Node.js', 'React', 'Socket.io', 'MongoDB', 'Twilio'],
  },
  {
    name: 'Ryfin Exchange',
    type: 'P2P Trading & Launchpad Platform',
    emoji: '🔄',
    color: '#6366f1',
    points: [
      'Implemented application security mechanisms: password encryption, data encryption/decryption using CryptoJS, and JWT-based authentication.',
      'Built real-time transaction updates and notifications using Socket.io for P2P trading activities.',
      'Developed core wallet functionalities including user deposit and withdrawal flows with secure and reliable transaction handling.',
    ],
    tags: ['Node.js', 'CryptoJS', 'JWT', 'Socket.io', 'Express'],
  },
  {
    name: 'Lumina Trading',
    type: 'Trading & Exchange Platform',
    emoji: '🌐',
    color: '#10b981',
    points: [
      'Designed and developed a Liquidity Provider (LP) Vault module enabling users to deposit funds and receive non-transferable LP tokens with auto-compounding yield based on trading profits and fees.',
      'Developed an Automated AI-based trading bot for executing user orders with optimized entry/exit strategies, improving trade efficiency and reducing manual intervention.',
      'nsured high-performance backend services using Node.js, Express, and MongoDB, handling concurrent transactions in a trading environment.',
    ],
    tags: ['React', 'Redux', 'Socket.io', 'Node.js'],
  },
];

const CERTIFICATIONS = [
  {
    title: 'Full Stack Development',
    issuer: 'Gtech Computer Education',
    period: 'Aug 2023 – Feb 2024',
    icon: '🎓',
    color: '#6366f1',
  },
  {
    title: 'Data Structures and Algorithms',
    issuer: 'Udemy',
    period: '2023',
    icon: '📊',
    color: '#f59e0b',
  },
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Navbar({ active, onNav }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <span className="navbar__logo" onClick={() => onNav('Home')}>
          <span className="logo-bracket">&lt;</span>AJ<span className="logo-bracket">/&gt;</span>
        </span>
        <button className="navbar__toggle" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span className={`burger ${open ? 'burger--open' : ''}`} />
        </button>
        <ul className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
          {NAV_LINKS.map(link => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className={`navbar__link ${active === link ? 'navbar__link--active' : ''}`}
                onClick={() => { onNav(link); setOpen(false); }}
              >{link}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function HeroSection() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="home" className="hero" ref={ref}>
      <div className={`hero__content ${inView ? 'fade-up' : ''}`}>
        <div className="hero__tag">// Full Stack Developer</div>
        <h1 className="hero__name">
          Arunkumar<br />
          <span className="hero__name--accent">J.</span>
        </h1>
        <p className="hero__bio">
          Full Stack Developer with<strong> 2+ years of experience</strong> building scalable trading and financial systems using Node.js,
Express, and MongoDB. Experienced in designing real-time, transaction-driven architectures, with a strong
focus on performance, data accuracy, and secure system design.
        </p>
        <div className="hero__cta">
          <a href="#projects" className="btn btn--primary">View Projects</a>
          <a href="#contact" className="btn btn--ghost">Get In Touch</a>
        </div>
        <div className="hero__socials">
          <a href="https://github.com/Arun74Ak" target="_blank" rel="noreferrer" className="social-link" aria-label="GitHub">
            <GitHubIcon />
          </a>
          <a href="https://www.linkedin.com/in/arunkumar-techie/" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
        </div>
      </div>
      <div className={`hero__visual ${inView ? 'fade-in' : ''}`}>
        <div className="code-block">
          <div className="code-block__bar">
            <span /><span /><span />
          </div>
          <pre className="code-block__pre">{`const developer = {
  name: "Arunkumar J",
  role: "Full Stack Developer",
  stack: ["Node.js","React","MongoDB"],
  experience: "2+ year",
  location: "Madurai, India",
  passion: "Building real-time
            & secure apps 🚀"
};`}</pre>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const [ref, inView] = useInView();
  return (
    <section id="about" className="section" ref={ref}>
      <div className={`section__inner ${inView ? 'fade-up' : ''}`}>
        <SectionHeading label="01" title="About Me" />
        <div className="about__grid">
          <div className="about__text">
            <p>
              I'm a <strong>Full Stack Developer</strong> based in Madurai, India, with hands-on experience building
              scalable blockchain and crypto trading products using the MERN stack.
            </p>
            <p>
              I specialize in <strong>secure authentication systems</strong> — from RBAC and JWT to OTP flows and social login —
              and I love building real-time features using Socket.io. My work spans high-traffic production environments
              for crypto exchanges and social applications.
            </p>
            <p>
              When I'm not coding, I'm sharpening my DSA skills and exploring new patterns in distributed system architecture.
            </p>
            <div className="about__meta">
              <div className="meta-item">
                <span className="meta-label">Location</span>
                <span className="meta-value">Madurai, India</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Email</span>
                <span className="meta-value">itsarun1404@gmail.com</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Phone</span>
                <span className="meta-value">+91 9750180400</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Education</span>
                <span className="meta-value">B.E. Electrical Engineering</span>
              </div>
            </div>
          </div>
          <div className="about__stats">
            {[
              { val: '2+', label: 'Years Experience' },
              { val: '5+', label: 'Production Projects' },
              { val: '10+', label: 'Tech Stack' },
              { val: '∞', label: 'Lines of Code' },
            ].map(s => (
              <div className="stat-card" key={s.label}>
                <span className="stat-card__val">{s.val}</span>
                <span className="stat-card__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const [ref, inView] = useInView();
  return (
    <section id="experience" className="section section--dark" ref={ref}>
      <div className={`section__inner ${inView ? 'fade-up' : ''}`}>
        <SectionHeading label="02" title="Experience" light />
        <div className="timeline">
          <div className="timeline__item">
            <div className="timeline__dot" />
            <div className="timeline__card">
              <div className="exp-header">
                <div>
                  <h3 className="exp-title">Full Stack Developer</h3>
                  <span className="exp-company">Maticz Technologies</span>
                </div>
                <span className="exp-period">May 2024 – Present</span>
              </div>
              <ul className="exp-points">
                <li>Owned end-to-end development of <strong>scalable full-stack applications</strong> using MongoDB, Express.js, React.js, and Node.js, supporting blockchain and crypto trading products.</li>
                <li>Designed and implemented <strong>secure authentication and authorization systems</strong>, including user onboarding, login flows, and Role-Based Access Control (RBAC) for high-traffic production environments.</li>
                <li>Improved <strong>system performance and code quality</strong> through modular architecture, reusable components, debugging, and performance tuning in staging and production.</li>
              </ul>
              <div className="exp-tags">
                {['MERN Stack', 'RBAC', 'Socket.io', 'Blockchain', 'JWT',"Node.js", "Express.js", "RESTful APIs", "Microservices","React.js"].map(t => (
                  <span key={t} className="tag tag--light">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="timeline__item">
            <div className="timeline__dot timeline__dot--edu" />
            <div className="timeline__card">
              <div className="exp-header">
                <div>
                  <h3 className="exp-title">B.E. Electrical Engineering</h3>
                  <span className="exp-company">Sethu Institute of Technology</span>
                </div>
                <span className="exp-period">Jul 2018 – May 2022</span>
              </div>
              <p className="exp-note">CGPA: <strong>7.6</strong> — Built a strong foundation in problem-solving, mathematics, and analytical thinking.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const [ref, inView] = useInView();
  return (
    <section id="projects" className="section" ref={ref}>
      <div className={`section__inner ${inView ? 'fade-up' : ''}`}>
        <SectionHeading label="03" title="Projects" />
        <div className="projects__grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} project={p} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, delay }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`project-card ${inView ? 'fade-up' : ''}`}
      style={{ '--accent': project.color, '--delay': `${delay}ms` }}
    >
      <div className="project-card__emoji">{project.emoji}</div>
      <h3 className="project-card__name">{project.name}</h3>
      <span className="project-card__type">{project.type}</span>
      <ul className="project-card__points">
        {project.points.map((pt, i) => <li key={i}>{pt}</li>)}
      </ul>
      <div className="project-card__tags">
        {project.tags.map(t => (
          <span key={t} className="tag" style={{ '--accent': project.color }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function SkillsSection() {
  const [ref, inView] = useInView();
  return (
    <section id="skills" className="section section--dark" ref={ref}>
      <div className={`section__inner ${inView ? 'fade-up' : ''}`}>
        <SectionHeading label="04" title="Skills" light />
        <div className="skills__grid">
          {Object.entries(SKILLS).map(([category, items], ci) => (
            <div key={category} className="skill-group" style={{ '--delay': `${ci * 80}ms` }}>
              <h3 className="skill-group__title">{category}</h3>
              <div className="skill-group__items">
                {items.map((skill, si) => (
                  <SkillPill key={skill} skill={skill} delay={ci * 80 + si * 40} inView={inView} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillPill({ skill, delay, inView }) {
  return (
    <span
      className={`skill-pill ${inView ? 'pop-in' : ''}`}
      style={{ '--delay': `${delay}ms` }}
    >
      {skill}
    </span>
  );
}

function CertificationsSection() {
  const [ref, inView] = useInView();
  return (
    <section id="certifications" className="section" ref={ref}>
      <div className={`section__inner ${inView ? 'fade-up' : ''}`}>
        <SectionHeading label="05" title="Certifications" />
        <div className="certs__grid">
          {CERTIFICATIONS.map((cert, i) => (
            <div
              key={cert.title}
              className={`cert-card ${inView ? 'fade-up' : ''}`}
              style={{ '--accent': cert.color, '--delay': `${i * 120}ms` }}
            >
              <div className="cert-card__icon">{cert.icon}</div>
              <div className="cert-card__body">
                <h3 className="cert-card__title">{cert.title}</h3>
                <p className="cert-card__issuer">{cert.issuer}</p>
                <span className="cert-card__period">{cert.period}</span>
              </div>
              <div className="cert-card__badge">Certified</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [ref, inView] = useInView();
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [status, setStatus]   = useState('idle'); // idle | loading | success | error
  const [feedback, setFeedback] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');
    try {
      const res = await submitContact(form);
      setStatus('success');
      setFeedback(res.message || 'Message sent! I\'ll get back to you soon.');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setFeedback(err.message || 'Something went wrong. Please try again.');
    }
  };

  const sent = status === 'success';
  return (
    <section id="contact" className="section section--dark" ref={ref}>
      <div className={`section__inner ${inView ? 'fade-up' : ''}`}>
        <SectionHeading label="06" title="Contact" light />
        <div className="contact__grid">
          <div className="contact__info">
            <h3 className="contact__heading">Let's build something together</h3>
            <p className="contact__sub">I'm open to full-time opportunities, freelance projects, and collaborations.</p>
            <div className="contact__details">
              {[
                { icon: '📍', label: 'Location', val: 'Madurai, India' },
                { icon: '📧', label: 'Email', val: 'itsarun1404@gmail.com' },
                { icon: '📱', label: 'Phone', val: '+91 9750180400' },
              ].map(d => (
                <div key={d.label} className="contact__detail-item">
                  <span className="contact__detail-icon">{d.icon}</span>
                  <div>
                    <span className="contact__detail-label">{d.label}</span>
                    <span className="contact__detail-val">{d.val}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="contact__socials">
              <a href="https://github.com/Arun74Ak" target="_blank" rel="noreferrer" className="social-link social-link--light"><GitHubIcon /></a>
              <a href="https://www.linkedin.com/in/arunkumar-techie/" target="_blank" rel="noreferrer" className="social-link social-link--light"><LinkedInIcon /></a>
            </div>
          </div>
          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                disabled={status === 'loading'}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                disabled={status === 'loading'}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className="form-input form-input--textarea"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                rows={5}
                required
                disabled={status === 'loading'}
              />
            </div>

            {feedback && (
              <div className={`form-feedback ${status === 'error' ? 'form-feedback--error' : 'form-feedback--success'}`}>
                {status === 'success' ? '✓ ' : '⚠ '}{feedback}
              </div>
            )}

            <button
              type="submit"
              className={`btn btn--primary btn--full ${sent ? 'btn--sent' : ''} ${status === 'loading' ? 'btn--loading' : ''}`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending…' : sent ? '✓ Message Sent!' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>Designed & built by <strong>Arunkumar J</strong></span>
      <span className="footer__sep">·</span>
      <span>Full Stack Developer · Madurai, India</span>
    </footer>
  );
}

function SectionHeading({ label, title, light }) {
  return (
    <div className={`section-heading ${light ? 'section-heading--light' : ''}`}>
      <span className="section-heading__label">{label}</span>
      <h2 className="section-heading__title">{title}</h2>
    </div>
  );
}

// SVG icons
function GitHubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
    </svg>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState('Home');
  useEffect(() => {
    const handler = () => {
      const sections = NAV_LINKS.map(l => document.getElementById(l.toLowerCase())).filter(Boolean);
      const scrollY = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollY >= sections[i].offsetTop) {
          setActiveNav(NAV_LINKS[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <div className="app">
      <Navbar active={activeNav} onNav={setActiveNav} />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
