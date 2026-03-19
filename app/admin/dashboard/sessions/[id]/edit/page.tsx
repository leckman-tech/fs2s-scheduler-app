import { notFound } from "next/navigation";
import { SessionForm } from "@/components/session-form";
import { getAdminSessionById } from "@/lib/queries";

export default async function EditSessionPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getAdminSessionById(id);

  if (!session) {
    notFound();
  }

  return <SessionForm session={session} />;
}
