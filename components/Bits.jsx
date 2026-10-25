import { Link } from 'react-router-dom';

export const STATUS_FLOW = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'];

export const Badge = ({ status }) => <span className={`badge s-${status.replace(/\s/g, '').toLowerCase()}`}>{status}</span>;

export const fmt = (d) => (d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '');
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '');

export function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job._id}`} className="job">
      <div className="job-top"><h3>{job.title}</h3><span className="tag">{job.type}</span></div>
      <p className="muted">{job.company} — {job.location} ({job.mode})</p>
      {job.salary && <p className="salary">{job.salary}</p>}
      <div className="chips">{job.skills.slice(0, 4).map((s) => <span key={s} className="chip">{s}</span>)}</div>
      {job.deadline && <p className="muted small">Apply by {fmtDate(job.deadline)}</p>}
    </Link>
  );
}

// Progress tracker for a student's application
export function Tracker({ status }) {
  if (status === 'Rejected') return <p className="rejected">This application was not selected.</p>;
  const idx = STATUS_FLOW.indexOf(status);
  return (
    <ol className="track">
      {STATUS_FLOW.map((s, i) => <li key={s} className={i < idx ? 'done' : i === idx ? 'now' : ''}>{s}</li>)}
    </ol>
  );
}
