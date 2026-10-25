import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api';

export default function Auth({ mode }) {
  const { login, register } = useAuth();
  const isReg = mode === 'register';
  const [f, setF] = useState({ role: 'student', name: '', email: '', password: '', university: '', company: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await (isReg ? register(f) : login(f)); } catch (x) { setErr(errMsg(x)); setBusy(false); }
  };

  return (
    <form className="card narrow" onSubmit={submit}>
      <h1>{isReg ? 'Create your account' : 'Log in'}</h1>
      {isReg && (
        <div className="seg">
          {['student', 'recruiter'].map((r) => (
            <button type="button" key={r} className={f.role === r ? 'on' : ''} onClick={() => setF({ ...f, role: r })}>
              {r === 'student' ? 'I’m a student' : 'I’m a recruiter'}
            </button>
          ))}
        </div>
      )}
      {isReg && <label>Full name<input required value={f.name} onChange={set('name')} /></label>}
      <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
      <label>Password<input type="password" required minLength={6} value={f.password} onChange={set('password')} /></label>
      {isReg && f.role === 'student' && <label>University<input value={f.university} onChange={set('university')} /></label>}
      {isReg && f.role === 'recruiter' && <label>Company<input required value={f.company} onChange={set('company')} /></label>}
      {err && <p className="error">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Please wait…' : isReg ? 'Create account' : 'Log in'}</button>
      <p className="muted small">
        {isReg ? <>Already have an account? <Link to="/login">Log in</Link></> : <>New here? <Link to="/register">Create an account</Link></>}
      </p>
    </form>
  );
}
