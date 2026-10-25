import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { fmtDate } from '../components/Bits';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState(null);
  const [stats, setStats] = useState(null);
  const load = () => {
    api.get('/jobs/mine').then((r) => setJobs(r.data));
    api.get('/applications/stats').then((r) => setStats(r.data));
  };
  useEffect(load, []);

  const toggle = async (j) => { await api.put(`/jobs/${j._id}`, { isActive: !j.isActive }); load(); };
  const remove = async (j) => { if (confirm(`Delete "${j.title}" and all its applications?`)) { await api.delete(`/jobs/${j._id}`); load(); } };

  return (
    <>
      <div className="row"><h1>Recruiter dashboard</h1><Link className="btn" to="/recruiter/post">Post a job</Link></div>
      {stats && (
        <div className="stats">
          <div className="stat"><b>{stats.jobs}</b><span>Jobs posted</span></div>
          <div className="stat"><b>{stats.total}</b><span>Applications</span></div>
          {Object.entries(stats.byStatus).map(([k, v]) => <div className="stat" key={k}><b>{v}</b><span>{k}</span></div>)}
        </div>
      )}
      <h2>Your jobs</h2>
      {jobs?.length === 0 && <p className="card">You haven’t posted a job yet. Post your first role to start receiving applications.</p>}
      {jobs?.map((j) => (
        <div className="card row" key={j._id}>
          <div>
            <h3>{j.title} {!j.isActive && <span className="tag">Closed</span>}</h3>
            <p className="muted small">{j.type} — {j.location} — Posted {fmtDate(j.createdAt)}</p>
          </div>
          <div className="actions">
            <Link className="btn" to={`/recruiter/jobs/${j._id}`}>{j.applicants} applicant{j.applicants === 1 ? '' : 's'}</Link>
            <button className="btn ghost" onClick={() => toggle(j)}>{j.isActive ? 'Close job' : 'Reopen job'}</button>
            <button className="btn ghost danger" onClick={() => remove(j)}>Delete</button>
          </div>
        </div>
      ))}
    </>
  );
}
