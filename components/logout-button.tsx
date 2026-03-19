import { logoutAdmin, logoutPortal } from "@/lib/actions/admin";

export function LogoutButton({ destination = "admin" }: { destination?: "admin" | "portal" }) {
  return (
    <form action={destination === "portal" ? logoutPortal : logoutAdmin}>
      <button type="submit" className="button-danger button-link">
        Sign out
      </button>
    </form>
  );
}
