import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const emptyForm = { title: '', description: '', techStack: '', liveUrl: '', githubUrl: '', imageUrl: '', featured: false };

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  useEffect(() => { fetchProjects(); fetchMessages(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.projects);
    } catch {}
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data.messages);
    } catch {}
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const openNew = () => { setForm(emptyForm); setEditId(null); setFormOpen(true); setStatus({}); };
  const openEdit = (p) => {
    setForm({ ...p, techStack: p.techStack?.join(', ') || '' });
    setEditId(p._id);
    setFormOpen(true);
    setStatus({});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      const payload = { ...form, techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean) };
      if (editId) {
        await api.put(`/projects/${editId}`, payload);
        setStatus({ loading: false, success: 'Project updated!' });
      } else {
        await api.post('/projects', payload);
        setStatus({ loading: false, success: 'Project created!' });
      }
      await fetchProjects();
      setTimeout(() => { setFormOpen(false); setStatus({}); }, 1200);
    } catch (err) {
      setStatus({ loading: false, error: err.response?.data?.message || 'Failed. Try again.' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch {}
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/messages/${id}/read`);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
    } catch {}
  };

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch {}
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <main className="dashboard">
      <div className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, <strong>{user?.name}</strong></p>
        </div>
        {tab === 'projects' && (
          <button className="btn btn-primary" onClick={openNew}>+ Add Project</button>
        )}
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="dash-stat">
          <div className="stat-num">{projects.length}</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="dash-stat">
          <div className="stat-num">{messages.length}</div>
          <div className="stat-label">Messages</div>
        </div>
        <div className="dash-stat">
          <div className="stat-num">{unreadCount}</div>
          <div className="stat-label">Unread</div>
        </div>
        <div className="dash-stat">
          <div className="stat-num">{projects.filter(p => p.featured).length}</div>
          <div className="stat-label">Featured</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        <button className={`tab-btn ${tab === 'projects' ? 'active' : ''}`} onClick={() => setTab('projects')}>Projects</button>
        <button className={`tab-btn ${tab === 'messages' ? 'active' : ''}`} onClick={() => setTab('messages')}>
          Messages {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </button>
      </div>

      {/* Projects Tab */}
      {tab === 'projects' && (
        <div className="dash-content">
          {formOpen && (
            <div className="project-form-card">
              <h3>{editId ? 'Edit Project' : 'New Project'}</h3>
              <form onSubmit={handleSubmit} className="project-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Title *</label>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="My Awesome App" required />
                  </div>
                  <div className="form-group">
                    <label>Tech Stack (comma-separated)</label>
                    <input name="techStack" value={form.techStack} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="What does this project do?" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Live URL</label>
                    <input name="liveUrl" value={form.liveUrl} onChange={handleChange} placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label>GitHub URL</label>
                    <input name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="https://github.com/..." />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="form-check">
                  <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} />
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

          {projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects yet.</p>
              <button className="btn btn-primary" onClick={openNew}>Add your first project</button>
            </div>
          ) : (
            <div className="dash-projects">
              {projects.map(p => (
                <div key={p._id} className="dash-project-row">
                  <div className="project-info">
                    <div className="project-title-row">
                      <strong>{p.title}</strong>
                      {p.featured && <span className="featured-badge">Featured</span>}
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
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages Tab */}
      {tab === 'messages' && (
        <div className="dash-content">
          {messages.length === 0 ? (
            <div className="empty-state"><p>No messages yet.</p></div>
          ) : (
            <div className="messages-list">
              {messages.map(m => (
                <div key={m._id} className={`message-card ${m.read ? 'read' : 'unread'}`}>
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
                    {!m.read && <button className="btn btn-ghost btn-sm" onClick={() => markRead(m._id)}>Mark read</button>}
                    <button className="btn btn-danger btn-sm" onClick={() => deleteMsg(m._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
