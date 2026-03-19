"use client";

import { useState } from "react";

export function FeedbackForm({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("saving");
    setMessage("");

    const payload = {
      sessionId,
      rating: Number(formData.get("rating")),
      mostUseful: String(formData.get("most_useful") ?? ""),
      improvements: String(formData.get("improvements") ?? ""),
      attendFuture: formData.get("attend_future") === "yes"
    };

    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setStatus("error");
      setMessage("We couldn't save your feedback just now. Please try again.");
      return;
    }

    const form = document.getElementById(`feedback-form-${sessionId}`) as HTMLFormElement | null;
    form?.reset();
    setStatus("success");
    setMessage("Thanks for the feedback. Your response was saved.");
  }

  return (
    <form
      id={`feedback-form-${sessionId}`}
      className="panel form-grid"
      action={handleSubmit}
    >
      <div className="section-heading">
        <h2>Session feedback</h2>
        <span className="hero-pill">1 minute</span>
      </div>

      <div className="form-grid form-grid--two">
        <div className="field">
          <label htmlFor="rating">Rating</label>
          <select id="rating" name="rating" defaultValue="5" required>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} / 5
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="attend_future">Would you attend a future session like this?</label>
          <select id="attend_future" name="attend_future" defaultValue="yes" required>
            <option value="yes">Yes</option>
            <option value="maybe">Maybe</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="most_useful">What was most useful?</label>
        <textarea id="most_useful" name="most_useful" required />
      </div>

      <div className="field">
        <label htmlFor="improvements">What should be improved?</label>
        <textarea id="improvements" name="improvements" required />
      </div>

      <div className="admin-actions">
        <button className="button" type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Submit feedback"}
        </button>
        {message ? <span className="muted">{message}</span> : null}
      </div>
    </form>
  );
}
