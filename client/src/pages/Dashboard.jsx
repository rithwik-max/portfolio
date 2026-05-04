import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const EMPTY = { title: '', description: '', techStack: '', liveUrl: '', githubUrl: '', imageUrl: '', featured: false };

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState({});

  useEffect(() => { fetchMyProjects(); fetchMessages(); }, []);

  // Dashboard only fetches projects that belong to this user
  const fetchMyProjects = async () => {
    try {
      // Get all projects then filter by owner on client
      const res = await api.get('/projects');
      const mine = res.data.projects.filter(p =>
        p.owner === user?._id || p.owner?._id === user?._id || p.owner?.toString() === user?._id?.toString()
      );
      setProjects(mine);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const change = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const openNew = () => { setForm(EMPTY); setEditId(null); setFormOpen(true); setStatus({}); };
  const openEdit = p => {
    setForm({ ...p, techStack: p.techStack?.join(', ') || '' });
    setEditId(p._id);
    setFormOpen(true);
    setStatus({});
  };

  const submit = async e => {
    e.preventDefault();
    setStatus({ loading: true });
    try {
      const payload = {
        ...form,
        techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean)
      };
      if (editId) {
        await api.put(`/projects/${editId}`, payload);
        setStatus({ success: 'Project updated!' });
      } else {
        await api.post('/projects', payload);
        setStatus({ success: 'Project created!' });
      }
      await fetchMyProjects();
      setTimeout(() => { setFormOpen(false); setStatus({}); }, 1200);
    } catch (err) {
      setStatus({ error: err.response?.data?.message || 'Failed. Try again.' });
    }
  };

  const deleteProject = async id => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(p => p.filter(x => x._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete.');
    }
  };

  const markRead = async id => {
    try {
      await api.patch(`/messages/${id}/read`);
      setMessages(m => m.map(x => x._id === id ? { ...x, read: true } : x));
    } catch {}
  };

  const deleteMsg = async id => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages(m => m.filter(x => x._id !== id));
    } catch {}
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <main className="dashboard">
      <div className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, <strong>{user?.name}</strong> — manage your portfolio here</p>
        </div>
        {tab === 'projects' && (
          <button className="btn btn-primary" onClick={openNew}>+ Add Project</button>
        )}
      </div>

      <div className="dash-stats">
        {[
          [projects.length, 'My Projects'],
          [messages.length, 'Messages'],
          [unread, 'Unread'],
          [projects.filter(p => p.featured).length, 'Featured'],
        ].map(([n, l]) => (
          <div key={l} className="dash-stat">
            <div className="stat-num">{n}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      <div className="dash-tabs">
        <button className={`tab-btn${tab === 'projects' ? ' active' : ''}`} onClick={() => setTab('projects')}>
          My Projects
        </button>
        <button className={`tab-btn${tab === 'messages' ? ' active' : ''}`} onClick={() => setTab('messages')}>
          Messages {unread > 0 && <span className="badge">{unread}</span>}
        </button>
      </div>

      {tab === 'projects' && (
        <div>
          {formOpen && (
            <div className="project-form-card">
              <h3>{editId ? 'Edit Project' : 'New Project'}</h3>
              <form className="project-form" onSubmit={submit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title *</label>
                    <input name="title" value={form.title} onChange={change} placeholder="My Awesome App" required />
                  </div>
                  <div className="form-group">
                    <label>Tech Stack (comma-separated)</label>
                    <input name="techStack" value={form.techStack} onChange={change} placeholder="React, Node.js, MongoDB" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea name="description" value={form.description} onChange={change} rows={3} placeholder="What does this project do?" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Live URL</label>
                    <input name="liveUrl" value={form.liveUrl} onChange={change} placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label>GitHub URL</label>
                    <input name="githubUrl" value={form.githubUrl} onChange={change} placeholder="https://github.com/..." />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input name="imageUrl" value={form.imageUrl} onChange={change} placeholder="https://..." />
                </div>
                <div className="form-check">
                  <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={change} />
                  <label htmlFor="featured">Mark as featured</label>
                </div>
                {status.error && <p className="error-text">{status.error}</p>}
                {status.success && <p className="success-text">✅ {status.success}</p>}
                <div className="form-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setFormOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={status.loading}>
                    {status.loading ? 'Saving...' : editId ? 'Update Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {projects.length === 0
            ? <div className="empty-state">
                <p>No projects yet. Add your first one!</p>
                <button className="btn btn-primary" onClick={openNew}>+ Add Project</button>
              </div>
            : <div className="dash-projects">
                {projects.map(p => (
                  <div key={p._id} className="dash-project-row">
                    <div className="project-info">
                      <div className="project-title-row">
                        <strong>{p.title}</strong>
                        {p.featured && <span className="featured-label" style={{ fontSize: '.62rem', padding: '2px 8px' }}>FEATURED</span>}
                      </div>
                      <p>{p.description}</p>
                      {p.techStack?.length > 0 && (
                        <div className="tech-stack">
                          {p.techStack.map(t => <span key={t} className="tech-tag">{t}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="project-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteProject(p._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {tab === 'messages' && (
        <div>
          {messages.length === 0
            ? <div className="empty-state"><p>No messages yet.</p></div>
            : <div className="messages-list">
                {messages.map(m => (
                  <div key={m._id} className={`message-card${m.read ? '' : ' unread'}`}>
                    <div className="msg-header">
                      <div>
                        <strong>{m.name}</strong>
                        <span className="msg-email">{m.email}</span>
                      </div>
                      <div className="msg-meta">
                        {!m.read && <span className="unread-dot" />}
                        <span className="msg-date">{new Date(m.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="msg-body">{m.message}</p>
                    <div className="msg-actions">
                      {!m.read && (
                        <button className="btn btn-ghost btn-sm" onClick={() => markRead(m._id)}>Mark read</button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => deleteMsg(m._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      )}
    </main>
  );
}