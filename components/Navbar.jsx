import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function Bell() {
  const [data, setData] = useState({ items: [], unread: 0 });
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const load = () => api.get('/notifications').then((r) => setData(r.data)).catch(() => {});

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, []);

  const toggle = async () => {
    setOpen(!open);
    if (!open && data.unread) { await api.put('/notifications/read-all'); setTimeout(load, 1500); }
  };
  return (
    <div className="bell">
      <button className="btn ghost" onClick={toggle} aria-label="Notifications">
        Alerts{data.unread > 0 && <span className="dot">{data.unread}</span>}
      </button>
      {open && (
        <div className="panel">
          {data.items.length === 0 && <p className="muted small">No notifications yet.</p>}
          {data.items.map((n) => (
            <div key={n._id} className={`note ${n.read ? '' : 'new'}`} onClick={() => { setOpen(false); n.link && nav(n.link); }}>
              <p>{n.message}</p>
              <span className="muted small">{new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link to="/" className="brand">CareerConnect</Link>
        <nav>
          <NavLink to="/" end>Browse jobs</NavLink>
          {user && <NavLink to="/dashboard">{user.role === 'recruiter' ? 'Recruiter dashboard' : 'My applications'}</NavLink>}
          {user?.role === 'recruiter' && <NavLink to="/recruiter/post">Post a job</NavLink>}
        </nav>
        <div className="nav-r">
          {user ? (
            <>
              <Bell />
              <span className="muted small">{user.name}</span>
              <button className="btn ghost" onClick={() => { logout(); nav('/'); }}>Log out</button>
            </>
          ) : (
            <>
              <Link className="btn ghost" to="/login">Log in</Link>
              <Link className="btn" to="/register">Create account</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
