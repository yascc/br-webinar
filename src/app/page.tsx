import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing-page";

export default async function Home() {
  // If already registered, redirect to appropriate page
  const session = await getSession();
  if (session) {
    const now = Date.now();
    if (now >= session.slotTime) {
      redirect("/watch");
    } else {
      redirect("/waiting");
    }
  }

  return <LandingPage />;
}
