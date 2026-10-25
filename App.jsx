import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Auth from './pages/Auth';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import Applicants from './pages/Applicants';

function Guard({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="muted pad">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <main className="wrap">
        <Routes>
          <Route path="/" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Auth mode="login" />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Auth mode="register" />} />
          <Route path="/dashboard" element={<Guard>{user?.role === 'recruiter' ? <RecruiterDashboard /> : <StudentDashboard />}</Guard>} />
          <Route path="/recruiter/post" element={<Guard role="recruiter"><PostJob /></Guard>} />
          <Route path="/recruiter/jobs/:id" element={<Guard role="recruiter"><Applicants /></Guard>} />
          <Route path="*" element={<p className="muted pad">Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
