import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { Badge, Tracker, fmt } from '../components/Bits';

export default function StudentDashboard() {
  const { user, setUser } = useAuth();
  const [apps, setApps] = useState(null);
  const [p, setP] = useState({ university: user.university || '', skills: (user.skills || []).join(', ') });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => api.get('/applications/mine').then((r) => setApps(r.data));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('university', p.university); fd.append('skills', p.skills);
    if (file) fd.append('resume', file);
    try { const { data } = await api.put('/auth/profile', fd); setUser(data); setFile(null); setMsg('Profile saved.'); }
    catch (x) { setMsg(errMsg(x)); }
  };
  const withdraw = async (id) => { if (confirm('Withdraw this application?')) { await api.delete(`/applications/${id}`); load(); } };

  return (
    <div className="layout detail">
      <section>
        <h1>My applications</h1>
        {apps === null && <p className="muted">Loading…</p>}
        {apps?.length === 0 && <p className="card">You haven’t applied anywhere yet. <Link to="/">Browse jobs</Link> to get started.</p>}
        {apps?.map((a) => (
          <div className="card" key={a._id}>
            <div className="row"><div><h3><Link to={`/jobs/${a.job._id}`}>{a.job.title}</Link></h3><p className="muted">{a.job.company}</p></div><Badge status={a.status} /></div>
            <Tracker status={a.status} />
            {a.interview?.date && (
              <div className="interview">
                <strong>Interview: {fmt(a.interview.date)}</strong> ({a.interview.mode || 'Online'})
                {a.interview.link && <> — <a href={a.interview.link} target="_blank" rel="noreferrer">Join link</a></>}
                {a.interview.notes && <p className="small">{a.interview.notes}</p>}
              </div>
            )}
            <div className="row"><span className="muted small">Applied {fmt(a.createdAt)}</span>
              {a.status !== 'Selected' && <button className="btn ghost danger" onClick={() => withdraw(a._id)}>Withdraw</button>}</div>
          </div>
        ))}
      </section>
      <aside className="card">
        <h3>Profile and resume</h3>
        <form onSubmit={save}>
          <label>University<input value={p.university} onChange={(e) => setP({ ...p, university: e.target.value })} /></label>
          <label>Skills (comma separated)<input value={p.skills} onChange={(e) => setP({ ...p, skills: e.target.value })} /></label>
          <label>Resume<input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} /></label>
          {user.resume ? <p className="small"><a href={user.resume} target="_blank" rel="noreferrer">View current resume</a></p> : <p className="muted small">No resume uploaded yet.</p>}
          {msg && <p className="ok">{msg}</p>}
          <button className="btn">Save profile</button>
        </form>
      </aside>
    </div>
  );
}
