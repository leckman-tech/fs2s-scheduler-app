import Link from "next/link";
import { saveWorkshopSlot } from "@/lib/actions/admin";
import { getWorkshopSessions } from "@/lib/queries";
import { formatDateLabel, formatTimeRange } from "@/lib/utils";

function speakerLines(value: Awaited<ReturnType<typeof getWorkshopSessions>>[number]) {
  return value.speakers
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
        .map((entry) => entry ?? "")
        .join(" | ")
    )
    .join("\n");
}

export default async function WorkshopsAdminPage() {
  const workshops = await getWorkshopSessions();

  return (
    <div className="stack">
      <section className="hero-card">
        <h1>Workshop planner</h1>
        <p>
          All workshop placeholders live here. Update the placeholder code, assign the final title,
          and add presenters when those details are finalized.
        </p>
      </section>

      <div className="stack">
        {workshops.map((workshop) => (
          <form key={workshop.id} action={saveWorkshopSlot} className="panel form-grid">
            <input type="hidden" name="id" value={workshop.id} />
            <div className="section-heading">
              <h2>{workshop.placeholder_code ? `Workshop ${workshop.placeholder_code}` : workshop.title}</h2>
              <Link
                href={`/admin/dashboard/sessions/${workshop.id}/edit`}
                className="button-secondary button-link"
              >
                Full edit
              </Link>
            </div>

            <div className="muted">
              {formatDateLabel(workshop.date)} - {formatTimeRange(workshop.starts_at, workshop.ends_at)}
            </div>

            <div className="form-grid form-grid--two">
              <div className="field">
                <label htmlFor={`placeholder_code-${workshop.id}`}>Placeholder code</label>
                <input
                  id={`placeholder_code-${workshop.id}`}
                  name="placeholder_code"
                  defaultValue={workshop.placeholder_code ?? ""}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor={`final_title-${workshop.id}`}>Final title</label>
                <input
                  id={`final_title-${workshop.id}`}
                  name="final_title"
                  defaultValue={workshop.final_title ?? ""}
                  placeholder="Leave blank until confirmed"
                />
              </div>
            </div>

            <div className="form-grid form-grid--two">
              <div className="field">
                <label htmlFor={`venue-${workshop.id}`}>Venue</label>
                <input id={`venue-${workshop.id}`} name="venue" defaultValue={workshop.venue} required />
              </div>

              <div className="field">
                <label htmlFor={`room-${workshop.id}`}>Room</label>
                <input id={`room-${workshop.id}`} name="room" defaultValue={workshop.room} required />
              </div>
            </div>

            <div className="field">
              <label htmlFor={`speakers-${workshop.id}`}>Presenters and logistics</label>
              <textarea
                id={`speakers-${workshop.id}`}
                name="speakers"
                defaultValue={speakerLines(workshop)}
                placeholder="Name | Title | Organization | workshop_presenter | pending | 2026-04-01T10:15 | Laptop + HDMI | Jamie Carter 202-555-0199 | Meet AV staff 15 minutes early"
              />
            </div>

            <div className="field">
              <label htmlFor={`published-${workshop.id}`}>Published</label>
              <input
                id={`published-${workshop.id}`}
                type="checkbox"
                name="published"
                defaultChecked={workshop.published}
              />
            </div>

            <div className="admin-actions">
              <button type="submit" className="button">
                Save workshop slot
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
