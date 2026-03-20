import { logoutAdmin, logoutAttendee, logoutPortal } from "@/lib/actions/admin";

export function LogoutButton({
  destination = "admin"
}: {
  destination?: "admin" | "portal" | "attendee";
}) {
  const action =
    destination === "portal"
      ? logoutPortal
      : destination === "attendee"
        ? logoutAttendee
        : logoutAdmin;

  return (
    <form action={action}>
      <button type="submit" className="button-danger button-link">
        Sign out
      </button>
    </form>
  );
}
