import { deleteAttendeeAccount, updateAttendeeAccount } from "@/lib/actions/admin";
import { getAdminAttendeeAccounts } from "@/lib/queries";
import { formatTimestamp } from "@/lib/utils";

export default async function AdminAccountsPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const accounts = await getAdminAttendeeAccounts();

  const now = Date.now();
  const recentCount = accounts.filter((account) => {
    const createdAt = new Date(account.created_at).getTime();
    return Number.isFinite(createdAt) && now - createdAt <= 24 * 60 * 60 * 1000;
  }).length;
  const publicDirectoryCount = accounts.filter((account) => account.share_with_attendees).length;
  const authOnlyCount = accounts.filter((account) => account.sync_status === "auth only").length;

  return (
    <div className="stack">
      {params.error ? <div className="empty-state">{params.error}</div> : null}
      {params.success ? <div className="announcement announcement--urgent">{params.success}</div> : null}

      <section className="hero-card">
        <h1>Attendee accounts</h1>
        <p>
          Review the attendee accounts that have been created, keep the planner-side roster tidy,
          and update public directory sharing preferences as needed.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">{accounts.length} attendee account{accounts.length === 1 ? "" : "s"}</span>
          <span className="hero-pill">{recentCount} created in the last 24 hours</span>
          <span className="hero-pill">{publicDirectoryCount} visible in the attendee directory</span>
          {authOnlyCount ? <span className="hero-pill">{authOnlyCount} waiting on full sync</span> : null}
        </div>
      </section>

      <section className="panel detail-side-panel">
        <div className="section-heading">
          <div>
            <h2>Account activity</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              New attendee accounts are added here automatically when people create their own portal login.
            </p>
          </div>
        </div>
        <div className="story-stat-grid">
          <article className="story-stat">
            <strong>{accounts.length}</strong>
            <span>Attendee accounts on file</span>
          </article>
          <article className="story-stat">
            <strong>{recentCount}</strong>
            <span>New accounts in the last 24 hours</span>
          </article>
          <article className="story-stat">
            <strong>{publicDirectoryCount}</strong>
            <span>Accounts shared with the attendee directory</span>
          </article>
          <article className="story-stat">
            <strong>{authOnlyCount}</strong>
            <span>New logins seen before full attendee sync</span>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Manage attendee accounts</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Email stays tied to the attendee login. You can update the displayed name, contact card,
              and sharing settings here.
            </p>
          </div>
        </div>

        <div className="resource-list">
          {accounts.length ? (
            accounts.map((account) => (
              <details key={account.id} className="announcement attendee-account-card">
                <summary className="attendee-account-card__summary">
                  <div className="attendee-account-card__summary-copy">
                    <strong>{account.full_name}</strong>
                    <div className="muted">
                      {[account.email || "Email on file", `Created ${formatTimestamp(account.created_at)}`].join(" · ")}
                    </div>
                  </div>
                  <div className="attendee-account-card__summary-meta">
                    <span className="chip">
                      {account.sync_status === "synced"
                        ? "Fully synced"
                        : account.sync_status === "auth only"
                          ? "Sync pending"
                          : account.sync_status === "profile only"
                            ? "Profile only"
                            : account.sync_status === "directory only"
                              ? "Directory only"
                              : "On file"}
                    </span>
                    <span className="chip">
                      {account.share_with_attendees ? "Visible in directory" : "Planner-only"}
                    </span>
                  </div>
                </summary>

                <div className="attendee-account-card__body">
                  <div className="detail-list">
                    <div>
                      <strong>Sync status</strong>
                      <span className="muted">
                        {account.sync_status === "synced"
                          ? "Fully synced"
                          : account.sync_status === "auth only"
                            ? "Login created, profile sync pending"
                            : account.sync_status === "profile only"
                              ? "Profile exists, directory sync pending"
                              : account.sync_status === "directory only"
                                ? "Directory record found"
                                : "Account record available"}
                      </span>
                    </div>
                    <div>
                      <strong>Phone</strong>
                      <span className="muted">{account.phone || "Not provided"}</span>
                    </div>
                    <div>
                      <strong>Organization</strong>
                      <span className="muted">{account.organization || "Not provided"}</span>
                    </div>
                    <div>
                      <strong>Directory status</strong>
                      <span className="muted">
                        {account.share_with_attendees ? "Visible to attendees" : "Planner-only"}
                      </span>
                    </div>
                  </div>

                  <details className="admin-edit-details">
                    <summary>Edit attendee account</summary>
                    <form action={updateAttendeeAccount} className="form-grid admin-edit-details__form">
                      <input type="hidden" name="id" value={account.id} />
                      <input type="hidden" name="email" value={account.email} />

                      <div className="form-grid form-grid--two">
                        <div className="field">
                          <label htmlFor={`account-name-${account.id}`}>Full name</label>
                          <input
                            id={`account-name-${account.id}`}
                            name="full_name"
                            defaultValue={account.full_name}
                            required
                          />
                        </div>
                        <div className="field">
                          <label htmlFor={`account-phone-${account.id}`}>Phone</label>
                          <input
                            id={`account-phone-${account.id}`}
                            name="phone"
                            defaultValue={account.phone ?? ""}
                          />
                        </div>
                      </div>

                      <div className="form-grid form-grid--two">
                        <div className="field">
                          <label htmlFor={`account-title-${account.id}`}>Title</label>
                          <input
                            id={`account-title-${account.id}`}
                            name="title"
                            defaultValue={account.title ?? ""}
                          />
                        </div>
                        <div className="field">
                          <label htmlFor={`account-organization-${account.id}`}>Organization</label>
                          <input
                            id={`account-organization-${account.id}`}
                            name="organization"
                            defaultValue={account.organization ?? ""}
                          />
                        </div>
                      </div>

                      <div className="sharing-choice-grid">
                        <label className="sharing-choice-card">
                          <input
                            type="checkbox"
                            name="share_with_planners"
                            defaultChecked={account.share_with_planners}
                          />
                          <span className="sharing-choice-card__box" aria-hidden="true" />
                          <span className="sharing-choice-card__content">
                            <strong>Share with planners</strong>
                            <span>Keep this contact information available to the conference team.</span>
                          </span>
                        </label>
                        <label className="sharing-choice-card">
                          <input
                            type="checkbox"
                            name="share_with_attendees"
                            defaultChecked={account.share_with_attendees}
                          />
                          <span className="sharing-choice-card__box" aria-hidden="true" />
                          <span className="sharing-choice-card__content">
                            <strong>Share with attendees</strong>
                            <span>Allow this attendee to appear in the live attendee directory.</span>
                          </span>
                        </label>
                      </div>

                      <div className="admin-actions">
                        <button type="submit" className="button-secondary">
                          Save account changes
                        </button>
                      </div>
                    </form>
                  </details>

                  <details className="admin-edit-details admin-edit-details--danger">
                    <summary>Delete attendee account</summary>
                    <div className="admin-edit-details__danger-copy">
                      This removes the attendee login, attendee directory card, and all attendee-board
                      activity connected to this account.
                    </div>
                    <form action={deleteAttendeeAccount} className="admin-actions">
                      <input type="hidden" name="id" value={account.id} />
                      <input type="hidden" name="full_name" value={account.full_name} />
                      <button type="submit" className="button-secondary attendee-danger-button">
                        Delete account permanently
                      </button>
                    </form>
                  </details>
                </div>
              </details>
            ))
          ) : (
            <div className="empty-state">
              No attendee accounts are visible yet. If attendees have already created logins, run
              <strong> 022_attendee_account_management.sql </strong>
              and
              <strong> 027_fix_admin_attendee_roster_signature.sql </strong>
              in Supabase so the admin roster can surface both fully synced accounts and brand-new attendee logins.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
