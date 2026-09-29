import { redirect } from "next/navigation";

/** Legacy route — use the main election voting UI */
export default async function ElectionIdRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  redirect(`/election/${resolved.id}`);
}
