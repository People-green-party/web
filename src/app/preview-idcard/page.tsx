import { redirect } from "next/navigation";

/**
 * Old local UI mock with hardcoded fake member data.
 * Must never be publicly reachable on production.
 */
export default function IdCardPreviewPage() {
  redirect("/login");
}
