import Link from "next/link";
import type { SessionCategory } from "@/lib/constants";
import { getFeedbackBySession, getFeedbackSummary } from "@/lib/queries";
import { displaySessionTitle, formatTimestamp } from "@/lib/utils";

function resolveTitle(
  value:
    | { title: string; final_title: string | null; placeholder_code: string | null; category: string }
    | {
        title: string;
        final_title: string | null;
        placeholder_code: string | null;
        category: string;
      }[]
    | null
) {
  if (!value) {
    return "Unknown session";
  }
  const session = Array.isArray(value) ? value[0] : value;
  if (!session) {
    return "Unknown session";
  }

  return displaySessionTitle({
    title: session.title,
    category: session.category as SessionCategory,
    final_title: session.final_title,
    placeholder_code: session.placeholder_code
  });
}

export default async function FeedbackAdminPage() {
  const [summary, feedback] = await Promise.all([getFeedbackSummary(), getFeedbackBySession()]);

  return (
    <div className="stack">
      <section className="panel">
        <div className="section-heading">
          <h2>Feedback summary</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Session</th>
                <th>Responses</th>
                <th>Average rating</th>
                <th>Export</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.feedbackCount}</td>
                  <td>{item.averageRating ?? "No ratings yet"}</td>
                  <td>
                    <Link
                      href={`/admin/dashboard/feedback/export?sessionId=${item.id}`}
                      className="button-secondary button-link"
                    >
                      CSV
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Recent responses</h2>
        </div>
        <div className="stack">
          {feedback.map((entry) => (
            <article key={entry.id} className="card">
              <div className="session-card__top">
                <span className="chip">{resolveTitle(entry.sessions)}</span>
                <span className="chip">{entry.rating} / 5</span>
                <span className="chip">{entry.attend_future ? "Would attend again" : "Would not attend again"}</span>
              </div>
              <div className="detail-list">
                <div>
                  <strong>Most useful</strong>
                  <span className="muted">{entry.most_useful}</span>
                </div>
                <div>
                  <strong>Should improve</strong>
                  <span className="muted">{entry.improvements}</span>
                </div>
              </div>
              <div className="muted">Submitted {formatTimestamp(entry.created_at)}</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
