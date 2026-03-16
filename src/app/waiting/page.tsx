import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { WaitingRoom } from "@/components/waiting-room";

export default async function WaitingPage() {
  const session = await getSession();
  if (!session) redirect("/");

  // Double-check: if slot started, redirect to watch
  if (session.slotTime <= Date.now()) {
    redirect("/watch");
  }

  return (
    <WaitingRoom
      name={session.name}
      email={session.email}
      slotTime={session.slotTime}
      timezone={session.timezone}
    />
  );
}
