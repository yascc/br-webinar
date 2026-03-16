import { getSession, isWithinSlotWindow } from "@/lib/session";
import { redirect } from "next/navigation";
import { WatchRoom } from "@/components/watch-room";

export default async function WatchPage() {
  const session = await getSession();
  if (!session) redirect("/");

  // Server-side validation: must be within the 3-hour slot window
  if (!isWithinSlotWindow(session.slotTime)) {
    // If slot hasn't started, go to waiting
    if (session.slotTime > Date.now()) {
      redirect("/waiting");
    }
    // If expired, clear and go to landing
    redirect("/");
  }

  return (
    <WatchRoom
      name={session.name}
      email={session.email}
      slotTime={session.slotTime}
      timezone={session.timezone}
    />
  );
}
