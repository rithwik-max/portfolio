import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(res.data.projects))
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false));
  }, []);

  const authors = ['all', ...new Set(projects.map(p => p.owner?.name).filter(Boolean))];
  const filtered = filter === 'all' ? projects : projects.filter(p => p.owner?.name === filter);

  if (loading) return <div className="page-center"><div className="spinner" /></div>;
  if (error) return <div className="page-center"><p className="error-text">{error}</p></div>;

  return (
    <main className="projects-page">
      <div className="page-header">
        <div className="section-label">Portfolio</div>
        <h1>All Projects</h1>
        <p>Work built by our community of developers.</p>
      </div>

      {/* Filter by author */}
      {authors.length > 2 && (
        <div className="filter-bar">
          {authors.map(a => (
            <button
              key={a}
              className={`filter-btn${filter === a ? ' active' : ''}`}
              onClick={() => setFilter(a)}
            >
              {a === 'all' ? '✦ All' : a}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0
        ? <div className="empty-state"><p>No projects yet. <a href="/signup">Sign up</a> and add yours!</p></div>
        : <div className="projects-grid">
            {filtered.map((p, i) => (
              <ProjectCard
                key={p._id}
                project={p}
                index={i}
                isOwner={user && p.owner?._id === user._id}
              />
            ))}
          </div>
      }
    </main>
  );
}

function ProjectCard({ project, index, isOwner }) {
  return (
    <div className={`project-card${project.featured ? ' featured' : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}>
      {project.featured && <div className="featured-label">FEATURED</div>}
      {project.imageUrl && (
        <div className="card-image">
          <img src={project.imageUrl} alt={project.title} loading="lazy" />
        </div>
      )}
      <div className="card-body">
        <div className="card-num">PROJECT_{String(index + 1).padStart(2, '0')}</div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        {project.techStack?.length > 0 && (
          <div className="tech-stack">
            {project.techStack.map(t => <span key={t} className="tech-tag">{t}</span>)}
          </div>
        )}

        {/* Author badge */}
        {project.owner?.name && (
          <div className="project-author">
            <span className="author-avatar">{project.owner.name[0].toUpperCase()}</span>
            <span className="author-name">{project.owner.name}</span>
            {isOwner && <span className="owner-badge">You</span>}
          </div>
        )}

        <div className="card-links">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Live ↗</a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">GitHub</a>
          )}
        </div>
      </div>
    </div>
  );
}