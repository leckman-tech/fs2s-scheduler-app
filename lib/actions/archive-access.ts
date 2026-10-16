"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export async function setArchiveAccess(formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const userId = String(formData.get("user_id") ?? "");
  const action = String(formData.get("action") ?? "");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    redirect("/admin/dashboard/archive-access?error=Invalid%20account");
  }
  if (userId === user.id && action === "revoke") {
    redirect("/admin/dashboard/archive-access?error=Cannot%20revoke%20your%20own%20access");
  }
  if (action !== "grant" && action !== "revoke") {
    redirect("/admin/dashboard/archive-access?error=Invalid%20action");
  }
  const { error } = action === "grant"
    ? await supabase.from("archive_access_grants").upsert({ user_id: userId, granted_by: user.id }, { onConflict: "user_id" })
    : await supabase.from("archive_access_grants").delete().eq("user_id", userId);
  if (error) {
    redirect("/admin/dashboard/archive-access?error=Unable%20to%20update%20permission");
  }
  revalidatePath("/2026-archive");
  revalidatePath("/admin/dashboard/archive-access");
  redirect("/admin/dashboard/archive-access?success=Archive%20permission%20updated");
}
