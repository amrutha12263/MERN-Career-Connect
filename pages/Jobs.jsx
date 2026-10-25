import { useEffect, useState } from 'react';
import api from '../api';
import { JobCard } from '../components/Bits';

const empty = { q: '', type: '', mode: '', location: '', skills: '' };

export default function Jobs() {
  const [f, setF] = useState(empty);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ jobs: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setPage(1); };

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      api.get('/jobs', { params: { ...f, page } }).then((r) => setData(r.data)).finally(() => setLoading(false));
    }, 300); // debounce typing
    return () => clearTimeout(t);
  }, [f, page]);

  return (
    <>
      <section className="hero">
        <h1>Your first role starts with one application.</h1>
        <p className="muted">Search internships and entry-level jobs, apply with your resume and follow every step.</p>
        <input className="big" placeholder="Search by title, company or keyword" value={f.q} onChange={set('q')} />
      </section>
      <div className="layout">
        <aside className="filters card">
          <h3>Filters</h3>
          <label>Job type
            <select value={f.type} onChange={set('type')}><option value="">All</option><option>Internship</option><option>Full-time</option><option>Part-time</option></select>
          </label>
          <label>Work mode
            <select value={f.mode} onChange={set('mode')}><option value="">All</option><option>On-site</option><option>Remote</option><option>Hybrid</option></select>
          </label>
          <label>Location<input placeholder="e.g. Bengaluru" value={f.location} onChange={set('location')} /></label>
          <label>Skills<input placeholder="React, SQL" value={f.skills} onChange={set('skills')} /></label>
          <button className="btn ghost" onClick={() => { setF(empty); setPage(1); }}>Clear filters</button>
        </aside>
        <section>
          <p className="muted small">{loading ? 'Searching…' : `${data.total} job${data.total === 1 ? '' : 's'} found`}</p>
          <div className="grid">{data.jobs.map((j) => <JobCard key={j._id} job={j} />)}</div>
          {!loading && data.jobs.length === 0 && <p className="card">No jobs match these filters. Clear a filter or try a different keyword.</p>}
          {data.pages > 1 && (
            <div className="pager">
              <button className="btn ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span className="muted">Page {page} of {data.pages}</span>
              <button className="btn ghost" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
