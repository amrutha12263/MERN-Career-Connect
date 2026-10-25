import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

export default function PostJob() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ title: '', company: user.company || '', location: '', type: 'Internship', mode: 'On-site', salary: '', skills: '', deadline: '', description: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/jobs', f); nav('/dashboard'); } catch (x) { setErr(errMsg(x)); }
  };

  return (
    <form className="card narrow wide" onSubmit={submit}>
      <h1>Post a job</h1>
      <label>Job title<input required value={f.title} onChange={set('title')} /></label>
      <div className="two">
        <label>Company<input required value={f.company} onChange={set('company')} /></label>
        <label>Location<input required value={f.location} onChange={set('location')} /></label>
        <label>Type<select value={f.type} onChange={set('type')}><option>Internship</option><option>Full-time</option><option>Part-time</option></select></label>
        <label>Work mode<select value={f.mode} onChange={set('mode')}><option>On-site</option><option>Remote</option><option>Hybrid</option></select></label>
        <label>Salary or stipend<input placeholder="₹20,000/month" value={f.salary} onChange={set('salary')} /></label>
        <label>Application deadline<input type="date" value={f.deadline} onChange={set('deadline')} /></label>
      </div>
      <label>Skills (comma separated)<input placeholder="React, Node.js" value={f.skills} onChange={set('skills')} /></label>
      <label>Description<textarea required rows={7} value={f.description} onChange={set('description')} /></label>
      {err && <p className="error">{err}</p>}
      <button className="btn">Publish job</button>
    </form>
  );
}
