import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <div className="football-graphic">
        <div className="football"></div>
      </div>
      <Link to="/" className="btn home-btn">Return to Home</Link>
    </div>
  );
}

export default NotFound; 