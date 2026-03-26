"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/browser";

export function AttendeePasswordResetForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!password || !confirmPassword) {
      setError("Enter your new password twice to finish resetting your attendee account.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Those passwords do not match yet.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError("We couldn't update your password just now. Please open the reset link again and try once more.");
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setMessage("Your password has been updated. You can return to the Attendee Portal and sign in now.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="panel form-grid">
      <div className="field">
        <label htmlFor="attendee-new-password">New password</label>
        <input
          id="attendee-new-password"
          type="password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="attendee-confirm-password">Confirm new password</label>
        <input
          id="attendee-confirm-password"
          type="password"
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
      </div>

      {error ? <div className="empty-state">{error}</div> : null}
      {message ? <div className="announcement announcement--urgent">{message}</div> : null}

      <button type="submit" className="button" disabled={isPending}>
        {isPending ? "Updating..." : "Set new password"}
      </button>
    </form>
  );
}
