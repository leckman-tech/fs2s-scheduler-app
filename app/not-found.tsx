import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <section className="hero-card">
        <h1>Page not found</h1>
        <p>The page you requested is not available. Head back to the conference schedule.</p>
        <Link href="/" className="button button-link" style={{ marginTop: "1rem", display: "inline-flex" }}>
          Return to schedule
        </Link>
      </section>
    </div>
  );
}
