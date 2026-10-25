import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('cc_token'));

  useEffect(() => {
    if (!localStorage.getItem('cc_token')) return;
    api.get('/auth/me').then((r) => setUser(r.data)).catch(() => localStorage.removeItem('cc_token')).finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, body) => {
    const { data } = await api.post(`/auth/${path}`, body);
    localStorage.setItem('cc_token', data.token);
    setUser(data.user);
    return data.user;
  };
  const logout = () => { localStorage.removeItem('cc_token'); setUser(null); };

  return (
    <Ctx.Provider value={{ user, setUser, loading, login: (b) => authenticate('login', b), register: (b) => authenticate('register', b), logout }}>
      {children}
    </Ctx.Provider>
  );
}
