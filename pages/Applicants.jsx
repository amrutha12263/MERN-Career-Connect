import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import { Badge, fmt } from '../components/Bits';

const STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

function Applicant({ a, reload }) {
  const [open, setOpen] = useState(false);
  const [iv, setIv] = useState({ date: '', mode: 'Online', link: '', notes: '' });
  const [err, setErr] = useState('');

  const setStatus = async (status) => {
    if (status === 'Interview Scheduled') return setOpen(true); // needs date/time
    await api.put(`/applications/${a._id}/status`, { status }); reload();
  };
  const schedule = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.put(`/applications/${a._id}/interview`, iv); setOpen(false); reload(); } catch (x) { setErr(errMsg(x)); }
  };

  return (
    <div className="card">
      <div className="row">
        <div>
          <h3>{a.student.name}</h3>
          <p className="muted small">{a.student.email}{a.student.university && ` — ${a.student.university}`}</p>
          <div className="chips">{a.student.skills?.map((s) => <span key={s} className="chip">{s}</span>)}</div>
        </div>
        <Badge status={a.status} />
      </div>
      {a.coverLetter && <p className="pre small">{a.coverLetter}</p>}
      {a.interview?.date && <p className="interview small">Interview: {fmt(a.interview.date)} ({a.interview.mode})</p>}
      <div className="row">
        <a className="btn ghost" href={a.resume} target="_blank" rel="noreferrer">View resume</a>
        <select value={a.status} onChange={(e) => setStatus(e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <button className="btn" onClick={() => setOpen(!open)}>{a.interview?.date ? 'Reschedule interview' : 'Schedule interview'}</button>
      </div>
      {open && (
        <form className="sched" onSubmit={schedule}>
          <div className="two">
            <label>Date and time<input type="datetime-local" required value={iv.date} onChange={(e) => setIv({ ...iv, date: e.target.value })} /></label>
            <label>Format<select value={iv.mode} onChange={(e) => setIv({ ...iv, mode: e.target.value })}><option>Online</option><option>On-site</option><option>Phone</option></select></label>
          </div>
          <label>Meeting link or address<input value={iv.link} onChange={(e) => setIv({ ...iv, link: e.target.value })} /></label>
          <label>Notes for the candidate<textarea rows={2} value={iv.notes} onChange={(e) => setIv({ ...iv, notes: e.target.value })} /></label>
          {err && <p className="error">{err}</p>}
          <button className="btn">Send interview invite</button>
        </form>
      )}
    </div>
  );
}

export default function Applicants() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('');
  const load = () => api.get(`/applications/job/${id}`).then((r) => setData(r.data)).catch(() => setData(false));
  useEffect(() => { load(); }, [id]);

  if (data === false) return <p className="card">Job not found.</p>;
  if (!data) return <p className="muted pad">Loading…</p>;
  const list = data.applications.filter((a) => !filter || a.status === filter);

  return (
    <>
      <Link to="/dashboard" className="muted small">Back to dashboard</Link>
      <div className="row"><h1>{data.job.title}: applicants</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      {list.length === 0 && <p className="card">No applicants {filter ? `with status “${filter}”` : 'yet'}.</p>}
      {list.map((a) => <Applicant key={a._id} a={a} reload={load} />)}
    </>
  );
}
