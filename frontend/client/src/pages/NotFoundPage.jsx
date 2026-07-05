import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
    <span className="font-display text-8xl italic text-gold">404</span>
    <h1 className="font-display text-2xl">Page not found</h1>
    <p className="text-sm text-stone">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary mt-2">
      Back to Home
    </Link>
  </div>
);

export default NotFoundPage;
