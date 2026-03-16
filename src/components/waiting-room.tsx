"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, Mail, Sparkles } from "lucide-react";

type Props = {
  name: string;
  email: string;
  slotTime: number;
  timezone: string;
};

export function WaitingRoom({ name, email, slotTime, timezone }: Props) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, slotTime - Date.now())
  );

  const handleReset = useCallback(async () => {
    await fetch("/api/reset", { method: "POST" });
    router.push("/");
  }, [router]);

  useEffect(() => {
    const iv = setInterval(() => {
      const remaining = Math.max(0, slotTime - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(iv);
        // Server-validated redirect to watch page
        router.push("/watch");
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [slotTime, router]);

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const displayTz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet-600/[0.08] rounded-full blur-[180px]" />
      </div>
      <div className="relative max-w-lg mx-auto px-4 text-center">
        {/* Checkmark */}
        <div className="w-20 h-20 bg-emerald-500/15 border-2 border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8">
          <Check className="w-10 h-10 text-emerald-400" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          You&apos;re Registered, {name.split(" ")[0]}! 🎉
        </h1>
        <p className="text-white/50 text-lg mb-10">
          Your session starts{" "}
          {new Intl.DateTimeFormat("en-US", {
            timeZone: displayTz,
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(slotTime))}
        </p>

        {/* Countdown */}
        <div className="flex justify-center gap-4 mb-10">
          {[
            { val: hours, label: "Hours" },
            { val: minutes, label: "Minutes" },
            { val: seconds, label: "Seconds" },
          ].map((unit) => (
            <div key={unit.label} className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center justify-center mb-2">
                <span className="text-3xl sm:text-4xl font-bold font-mono tabular-nums">
                  {String(unit.val).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs text-white/40 font-medium">{unit.label}</span>
            </div>
          ))}
        </div>

        <p className="text-white/40 text-sm mb-3">
          Your session will begin automatically when the countdown reaches zero.
        </p>
        <p className="text-white/30 text-xs mb-6 flex items-center justify-center gap-1.5">
          <Mail className="w-3.5 h-3.5" />A confirmation email has been sent to{" "}
          <span className="text-white/50 font-medium">{email}</span>
        </p>

        {/* Reminders */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 text-left">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            While You Wait:
          </h3>
          <div className="space-y-2.5 text-sm text-white/50">
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Make sure you&apos;re in a quiet place where you can take notes</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Have a notebook ready — there will be actionable steps</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Stay for the full 60 minutes — the best part is at the end</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-white/20 hover:text-white/40 mt-8 transition-colors cursor-pointer"
        >
          Choose a different time
        </button>
      </div>
    </div>
  );
}
