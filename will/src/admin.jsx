import { useEffect, useState } from 'react';

const api = '';

export default function AdminPanel() {
  const [token, setToken] = useState(() => localStorage.getItem('rel4d-admin-token') || '');
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const request = async (path, options = {}) => {
    const authHeaders = token ? { Authorization: 'Bearer ' + token } : {};
    const response = await fetch(`${api}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...authHeaders, ...(options.headers || {}) },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('rel4d-admin-token');
    setToken('');
    setUser(null);
  };

  const load = async () => {
    try {
      const [me, statsData, messageData, contentData] = await Promise.all([
        request('/api/auth/me'),
        request('/api/admin/stats'),
        request('/api/admin/messages'),
        request('/api/admin/content/project'),
      ]);
      setUser(me.user);
      setStats(statsData);
      setMessages(messageData);
      setProjects(contentData);
      setError('');
    } catch (e) {
      setError(e.message);
      if (e.message.toLowerCase().includes('sign') || e.message.toLowerCase().includes('expired') || e.message.toLowerCase().includes('forbidden')) logout();
    }
  };

  useEffect(() => {
    if (!token) return;
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [token]);

  const submitLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await fetch(`${api}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) }).then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || 'Login failed');
        return body;
      });
      if (data.user.role !== 'admin') throw new Error('This account does not have administrator access.');
      localStorage.setItem('rel4d-admin-token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (e) {
      setError(e.message);
    }
  };

  const closeAdmin = () => {
    window.location.hash = '';
    window.location.reload();
  };

  const markRead = async (id) => {
    await request(`/api/admin/messages/${id}/read`, { method: 'PATCH' });
    setMessages((current) => current.map((item) => item.id === id ? { ...item, is_read: true } : item));
  };

  const deleteMessage = async (id) => {
    await request(`/api/admin/messages/${id}`, { method: 'DELETE' });
    setMessages((current) => current.filter((item) => item.id !== id));
  };

  const saveProject = async (event, id = null) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = { title: form.get('title'), category: form.get('category'), description: form.get('description'), image: form.get('image') };
    if (id) await request(`/api/admin/content/${id}`, { method: 'PUT', body: JSON.stringify({ data, published: true }) });
    else await request('/api/admin/content/project', { method: 'POST', body: JSON.stringify({ data, published: true }) });
    await load();
  };

  const deleteProject = async (id) => {
    await request(`/api/admin/content/${id}`, { method: 'DELETE' });
    await load();
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-[var(--gs)] px-5 py-16">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">
          <button type="button" onClick={closeAdmin} className="mb-6 text-sm font-bold text-[var(--gd)]">← Back to website</button>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--o)]">REL4D administration</p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--gd)]">Admin login</h1>
          <form onSubmit={submitLogin} className="mt-7 space-y-4">
            <label className="block text-sm font-semibold text-[var(--gd)]">Email<input required type="email" autoComplete="email" value={credentials.email} onChange={(e) => setCredentials((c) => ({ ...c, email: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3" /></label>
            <label className="block text-sm font-semibold text-[var(--gd)]">Password<input required type="password" autoComplete="current-password" value={credentials.password} onChange={(e) => setCredentials((c) => ({ ...c, password: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3" /></label>
            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <button className="w-full rounded-xl bg-[var(--gd)] py-3.5 font-bold text-white hover:bg-[var(--o)]">Sign in</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--gs)]">
      <header className="bg-[var(--gd)] px-5 py-5 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div><p className="text-xs text-white/60">REL4D administration</p><h1 className="text-xl font-bold">{user?.name || 'Dashboard'}</h1></div>
          <div className="flex gap-2"><button onClick={closeAdmin} className="rounded-lg border border-white/20 px-4 py-2 text-sm">Website</button><button onClick={logout} className="rounded-lg bg-[var(--o)] px-4 py-2 text-sm font-bold">Logout</button></div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8">
        {error && <p role="alert" className="mb-5 rounded-xl bg-red-100 px-4 py-3 text-red-700">{error}</p>}
        {stats && <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">{Object.entries(stats).map(([key, value]) => <div key={key} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-3xl font-bold text-[var(--gd)]">{value}</p><p className="mt-1 text-xs font-bold uppercase text-black/50">{key}</p></div>)}</div>}

        <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[var(--gd)]">Projects</h2>
          <form onSubmit={(event) => saveProject(event)} className="mt-5 grid gap-3 md:grid-cols-4">
            <input name="title" required placeholder="Project title" className="rounded-xl border px-3 py-2" />
            <input name="category" placeholder="Category" className="rounded-xl border px-3 py-2" />
            <input name="image" placeholder="Image URL" className="rounded-xl border px-3 py-2" />
            <button className="rounded-xl bg-[var(--g)] px-4 py-2 font-bold text-white">Add project</button>
            <textarea name="description" required placeholder="Description" rows="3" className="rounded-xl border px-3 py-2 md:col-span-4" />
          </form>
          <div className="mt-6 space-y-3">{projects.map((project) => <form key={project.id} onSubmit={(event) => saveProject(event, project.id)} className="grid gap-2 rounded-xl border p-4 md:grid-cols-[1fr_160px_1fr_auto]"><input name="title" defaultValue={project.data?.title || ''} className="rounded-lg border px-3 py-2" /><input name="category" defaultValue={project.data?.category || ''} className="rounded-lg border px-3 py-2" /><input name="image" defaultValue={project.data?.image || ''} className="rounded-lg border px-3 py-2" /><button className="rounded-lg bg-[var(--gd)] px-3 text-sm font-bold text-white">Save</button><textarea name="description" defaultValue={project.data?.description || ''} className="rounded-lg border px-3 py-2 md:col-span-4" /></form>)}</div>
          <div className="mt-3 space-y-2">{projects.map((project) => <button key={`delete-${project.id}`} type="button" onClick={() => deleteProject(project.id)} className="mr-2 rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700">Delete: {project.data?.title}</button>)}</div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[var(--gd)]">Received messages</h2>
          <div className="mt-5 space-y-3">{messages.map((message) => <article key={message.id} className={`rounded-2xl border p-5 ${message.is_read ? 'border-black/10' : 'border-[var(--o)] bg-orange-50/30'}`}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-[var(--gd)]">{message.name} · {message.email}</p>{message.organization && <p className="text-sm text-black/60">{message.organization}</p>}</div><div className="flex gap-2"><button onClick={() => markRead(message.id)} className="rounded-lg border px-3 py-1.5 text-xs">Mark read</button><button onClick={() => deleteMessage(message.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700">Delete</button></div></div>{message.service && <p className="mt-3 text-xs font-bold text-[var(--o)]">{message.service}</p>}<p className="mt-3 whitespace-pre-wrap text-sm text-black/70">{message.message}</p></article>)}</div>
          {!messages.length && <p className="mt-5 text-sm text-black/50">No messages yet.</p>}
        </section>
      </div>
    </main>
  );
}
