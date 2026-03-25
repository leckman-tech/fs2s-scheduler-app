import { SESSION_CATEGORIES, SESSION_STATUSES } from "@/lib/constants";
import type { SessionRecord } from "@/lib/types";
import { saveSession } from "@/lib/actions/admin";

function toLocalDateTime(value: string) {
  return value ? value.slice(0, 16) : "";
}

export function SessionForm({ session }: { session?: SessionRecord | null }) {
  const speakerText = session?.speakers
    .map((speaker) =>
      [
        speaker.name,
        speaker.title,
        speaker.organization,
        speaker.sessionRole,
        speaker.confirmationStatus,
        speaker.arrivalTime ? speaker.arrivalTime.slice(0, 16) : "",
        speaker.avNeeds,
        speaker.staffContact,
        speaker.privateLogisticsNote
      ]
        .map((value) => value ?? "")
        .join(" | ")
    )
    .join("\n");

  return (
    <form action={saveSession} className="panel form-grid">
      <div className="section-heading">
        <h2>{session ? "Edit session" : "Create session"}</h2>
      </div>

      {session ? <input type="hidden" name="id" value={session.id} /> : null}

      <div className="form-grid form-grid--two">
        <div className="field">
          <label htmlFor="session_code">Session code</label>
          <input id="session_code" name="session_code" defaultValue={session?.session_code ?? ""} />
        </div>

        <div className="field">
          <label htmlFor="date">Day</label>
          <input id="date" type="date" name="date" defaultValue={session?.date} required />
        </div>
      </div>

      <div className="form-grid form-grid--two">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" defaultValue={session?.title} required />
        </div>

        <div className="field">
          <label htmlFor="venue">Venue</label>
          <input id="venue" name="venue" defaultValue={session?.venue ?? ""} required />
        </div>
      </div>

      <div className="form-grid form-grid--two">
        <div className="field">
          <label htmlFor="starts_at">Start time</label>
          <input
            id="starts_at"
            type="datetime-local"
            name="starts_at"
            defaultValue={toLocalDateTime(session?.starts_at ?? "")}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="ends_at">End time</label>
          <input
            id="ends_at"
            type="datetime-local"
            name="ends_at"
            defaultValue={toLocalDateTime(session?.ends_at ?? "")}
          />
        </div>
      </div>

      <div className="form-grid form-grid--two">
        <div className="field">
          <label htmlFor="category">Session type</label>
          <select id="category" name="category" defaultValue={session?.category ?? "panel"} required>
            {SESSION_CATEGORIES.map((category) => (
              <option value={category} key={category}>
                {category.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={session?.status ?? "scheduled"} required>
            {SESSION_STATUSES.map((status) => (
              <option value={status} key={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-grid form-grid--two">
        <div className="field">
          <label htmlFor="room">Room</label>
          <input id="room" name="room" defaultValue={session?.room} required />
        </div>

        <div className="field">
          <label htmlFor="placeholder_code">Workshop placeholder code</label>
          <input id="placeholder_code" name="placeholder_code" defaultValue={session?.placeholder_code ?? ""} />
        </div>
      </div>

      <div className="form-grid form-grid--two">
        <div className="field">
          <label htmlFor="final_title">Workshop final title</label>
          <input id="final_title" name="final_title" defaultValue={session?.final_title ?? ""} />
        </div>

        <div className="field">
          <label htmlFor="published">Publish to attendee view</label>
          <input id="published" type="checkbox" name="published" defaultChecked={session?.published ?? true} />
        </div>
      </div>

      <div className="form-grid form-grid--two">
        <div className="field">
          <label htmlFor="featured">Featured session</label>
          <input id="featured" type="checkbox" name="featured" defaultChecked={session?.featured ?? false} />
        </div>

        <div className="field">
          <label htmlFor="is_placeholder">Keep as placeholder</label>
          <input
            id="is_placeholder"
            type="checkbox"
            name="is_placeholder"
            defaultChecked={session?.is_placeholder ?? false}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="short_description">Short description</label>
        <textarea id="short_description" name="short_description" defaultValue={session?.short_description} required />
      </div>

      <div className="field">
        <label htmlFor="description">Full description</label>
        <textarea id="description" name="description" defaultValue={session?.description} required />
      </div>

      <div className="field">
        <label htmlFor="speakers">Speakers</label>
        <textarea
          id="speakers"
          name="speakers"
          defaultValue={speakerText}
          placeholder="Name | Title | Organization | Role | Confirmation | Arrival YYYY-MM-DDTHH:MM | AV Needs | Staff Contact | Private Logistics Note"
        />
        <span className="muted">
          One person per line. Confirmation and logistics stay private to admin and speaker views.
        </span>
      </div>

      <div className="field">
        <label htmlFor="live_updates">Live updates</label>
        <textarea
          id="live_updates"
          name="live_updates"
          defaultValue={session?.live_updates ?? ""}
          placeholder="Add same-day notes, room shifts, or capacity updates."
        />
      </div>

      <section className="panel detail-side-panel">
        <div className="section-heading">
          <h2>Optional RSVP / sign-up</h2>
        </div>

        <div className="form-grid form-grid--two">
          <div className="field">
            <label htmlFor="signup_enabled">Enable sign-up form for this session</label>
            <input
              id="signup_enabled"
              type="checkbox"
              name="signup_enabled"
              defaultChecked={session?.signup_enabled ?? false}
            />
          </div>

          <div className="field">
            <label htmlFor="signup_capacity">Capacity</label>
            <input
              id="signup_capacity"
              type="number"
              min="1"
              name="signup_capacity"
              defaultValue={session?.signup_capacity ?? ""}
              placeholder="50"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="signup_instructions">Sign-up instructions</label>
          <textarea
            id="signup_instructions"
            name="signup_instructions"
            defaultValue={session?.signup_instructions ?? ""}
            placeholder="Add any note attendees should see, such as first-come-first-served details or text update guidance."
          />
        </div>
      </section>

      <div className="admin-actions">
        <button type="submit" className="button">
          {session ? "Save changes" : "Create session"}
        </button>
      </div>
    </form>
  );
}
