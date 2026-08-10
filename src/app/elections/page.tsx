import { redirect } from "next/navigation";

/** Legacy route — use the main election list */
export default function ElectionsRedirectPage() {
  redirect("/election");
}
