import { redirect } from "next/navigation";

/** Legacy route — use the main election voting UI */
export default function VoteRedirectPage() {
  redirect("/election");
}
