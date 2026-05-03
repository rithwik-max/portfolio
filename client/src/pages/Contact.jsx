import { useState } from 'react';
import api from '../api/axios';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      await api.post('/messages', form);
      setStatus({ loading: false, success: true, error: '' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.response?.data?.message || 'Failed to send. Try again.' });
    }
  };

  return (
    <main className="contact-page">
      <div className="page-header">
        <div className="section-label">Contact</div>
        <h1>Let's Talk</h1>
        <p>Have a project in mind or want to discuss an opportunity? I'd love to hear from you.</p>
      </div>

      <div className="contact-layout">
        <div className="contact-info">
          <h3>Get in touch</h3>
          <p>I'm currently open to internship opportunities and freelance projects. Feel free to reach out!</p>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span>rithwikgundarapu@gmail.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>Hyderabad, India</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">💼</span>
              <span>Open to work</span>
            </div>
          </div>
          <div className="social-links">
            <a href="https://github.com/rithwik-max" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
            <a href="https://www.linkedin.com/in/rithwik-g-a8109034a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Tell me about your project or opportunity..."
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          {status.error && <p className="error-text">{status.error}</p>}
          {status.success && <p className="success-text">✅ Message sent! I'll get back to you soon.</p>}

          <button type="submit" className="btn btn-primary btn-lg" disabled={status.loading}>
            {status.loading ? 'Sending...' : 'Send Message →'}
          </button>
        </form>
      </div>
    </main>
  );
}
