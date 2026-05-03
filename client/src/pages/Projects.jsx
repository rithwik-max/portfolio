import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(res.data.projects))
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-center"><div className="spinner" /></div>;
  if (error) return <div className="page-center"><p className="error-text">{error}</p></div>;

  return (
    <main className="projects-page">
      <div className="page-header">
        <div className="section-label">Portfolio</div>
        <h1>My Work</h1>
        <p>A collection of projects I've built — from frontend UIs to full stack applications.</p>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <p>No projects yet.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}

function ProjectCard({ project }) {
  return (
    <div className={`project-card ${project.featured ? 'featured' : ''}`}>
      {project.featured && <div className="featured-badge">Featured</div>}
      {project.imageUrl && (
        <div className="card-image">
          <img src={project.imageUrl} alt={project.title} loading="lazy" />
        </div>
      )}
      <div className="card-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {project.techStack?.length > 0 && (
          <div className="tech-stack">
            {project.techStack.map(tech => (
              <span key={tech} className="tech-tag">{tech}</span>
            ))}
          </div>
        )}
        <div className="card-links">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Live Demo ↗
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}