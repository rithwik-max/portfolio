import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="notfound-page">
      <div className="notfound-code">404</div>
      <h1>Page not found</h1>
      <p>Looks like this page went on a vacation and forgot to come back.</p>
      <Link to="/" className="btn btn-primary btn-lg">← Back to Home</Link>
    </main>
  );
}