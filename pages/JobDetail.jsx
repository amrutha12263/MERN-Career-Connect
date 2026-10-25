import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { fmtDate } from '../components/Bits';

export default function JobDetail() {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  const [job, setJob] = useState(null);
  const [cover, setCover] = useState('');
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState({ ok: '', err: '' });

  useEffect(() => { api.get(`/jobs/${id}`).then((r) => setJob(r.data)).catch(() => setJob(false)); }, [id]);
  if (job === false) return <p className="card">This job could not be found.</p>;
  if (!job) return <p className="muted pad">Loading…</p>;

  const apply = async (e) => {
    e.preventDefault(); setMsg({ ok: '', err: '' });
    const fd = new FormData();
    fd.append('coverLetter', cover);
    if (file) fd.append('resume', file);
    try {
      await api.post(`/applications/${id}`, fd);
      const me = await api.get('/auth/me'); setUser(me.data);
      setMsg({ ok: 'Application sent. Track it from My applications.', err: '' });
      setTimeout(() => nav('/dashboard'), 1200);
    } catch (x) { setMsg({ ok: '', err: errMsg(x) }); }
  };

  return (
    <div className="layout detail">
      <article className="card">
        <h1>{job.title}</h1>
        <p className="muted">{job.company} — {job.location} ({job.mode})</p>
        <div className="chips"><span className="tag">{job.type}</span>{job.salary && <span className="tag">{job.salary}</span>}</div>
        <h3>About the role</h3>
        <p className="pre">{job.description}</p>
        <h3>Skills</h3>
        <div className="chips">{job.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
        {job.deadline && <p className="muted">Apply by {fmtDate(job.deadline)}</p>}
      </article>
      <aside className="card">
        <h3>Apply</h3>
        {!user && <p>Log in as a student to apply. <Link to="/login">Log in</Link> or <Link to="/register">create an account</Link>.</p>}
        {user?.role === 'recruiter' && <p className="muted">Recruiter accounts can’t apply to jobs.</p>}
        {user?.role === 'student' && (
          <form onSubmit={apply}>
            <label>Cover note (optional)<textarea rows={4} value={cover} onChange={(e) => setCover(e.target.value)} /></label>
            <label>Resume (PDF or Word, max 2 MB)
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
            </label>
            {user.resume && !file && <p className="muted small">Your saved resume will be used. <a href={user.resume} target="_blank" rel="noreferrer">View</a></p>}
            {msg.err && <p className="error">{msg.err}</p>}
            {msg.ok && <p className="ok">{msg.ok}</p>}
            <button className="btn">Submit application</button>
          </form>
        )}
      </aside>
    </div>
  );
}
