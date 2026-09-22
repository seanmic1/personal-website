import { redirect } from "next/navigation";

/** Kept so the link that already exists out in the world still lands. */
export default function DearStranger() {
  redirect("https://dear-stranger.vercel.app/");
}
