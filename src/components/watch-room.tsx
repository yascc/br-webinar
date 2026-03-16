"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Crown,
  Gift,
  MessageCircle,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { FAKE_MESSAGES, WEBINAR_PRODUCTS } from "@/lib/constants";

type Props = {
  name: string;
  email: string;
  slotTime: number;
  timezone: string;
};

type ChatMessage = {
  id: string;
  name: string;
  text: string;
  isSelf?: boolean;
};

// ========================================================================
// MAIN WATCH ROOM
// ========================================================================

export function WatchRoom({ name, slotTime }: Props) {
  const router = useRouter();
  const [startedAt] = useState(() => Date.now());
  const [showOffers, setShowOffers] = useState(false);
  // VIEW OFFERS BUTTON TIMING
  // Currently: always visible from the start.
  // To enable timed reveal: change useState(true) to the commented initializer,
  // and uncomment the useEffect below.
  // Timed mode: show only in last 15 min of a 1-hour slot (after 45 min)
  const [showOfferBtn, setShowOfferBtn] = useState(true);

  // const [showOfferBtn, setShowOfferBtn] = useState(() => {
  //   const revealTime = slotTime + 45 * 60 * 1000;
  //   return Date.now() >= revealTime;
  // });
  // useEffect(() => {
  //   if (showOfferBtn) return;
  //   const revealTime = slotTime + 45 * 60 * 1000;
  //   const msUntilReveal = revealTime - Date.now();
  //   if (msUntilReveal <= 0) {
  //     setShowOfferBtn(true);
  //     return;
  //   }
  //   const timer = setTimeout(() => setShowOfferBtn(true), msUntilReveal);
  //   return () => clearTimeout(timer);
  // }, [showOfferBtn, slotTime]);

  const handleReset = useCallback(async () => {
    await fetch("/api/reset", { method: "POST" });
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Sticky top bar */}
      <div className="bg-black/80 border-b border-white/5 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-red-300">LIVE</span>
            </div>
            <span className="text-sm font-medium text-white/70 hidden sm:inline">
              TikTok + AI Affiliate Marketing Training
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ViewerCount startedAt={startedAt} />
            <button
              type="button"
              onClick={handleReset}
              className="text-[10px] text-white/20 hover:text-white/40 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-[1fr_340px] gap-4">
          {/* Left column: video + offers */}
          <div className="space-y-4">
            <VideoPlayer />
            {showOffers && (
              <div id="offer-section">
                <OfferSection />
              </div>
            )}
          </div>

          {/* Right column: offer button + chat */}
          <div className="lg:h-[calc(100vh-72px)] lg:sticky lg:top-[52px] flex flex-col gap-3">
            {showOfferBtn && !showOffers && (
              <button
                type="button"
                onClick={() => {
                  setShowOffers(true);
                  setTimeout(() => {
                    document
                      .getElementById("offer-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-400 hover:via-purple-400 hover:to-fuchsia-400 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-400/50 hover:scale-[1.02] cursor-pointer border border-white/10"
              >
                <Gift className="w-5 h-5" />
                View Offers
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <ChatPanel name={name} startedAt={startedAt} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// VIEWER COUNT
// ========================================================================

function ViewerCount({ startedAt }: { startedAt: number }) {
  const [count, setCount] = useState(147);

  useEffect(() => {
    const iv = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      const base = Math.min(320, 147 + elapsed * 0.2);
      const noise = Math.floor(Math.random() * 20 - 10);
      setCount(Math.max(100, Math.floor(base + noise)));
    }, 8000);
    return () => clearInterval(iv);
  }, [startedAt]);

  return (
    <div className="flex items-center gap-1.5 text-sm text-white/50">
      <Users className="w-3.5 h-3.5" />
      <span>
        <strong className="text-white">{count}</strong> watching
      </span>
    </div>
  );
}

// ========================================================================
// VIDEO PLAYER
// ========================================================================

function VideoPlayer() {
  const videoId =
    process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || "dQw4w9WgXcQ";

  return (
    <div
      className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/5"
      onContextMenu={(e) => e.preventDefault()}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&disablekb=1&rel=0&modestbranding=1&showinfo=0&fs=0&iv_load_policy=3`}
        title="Live Training"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={false}
        className="absolute inset-0 w-full h-full"
      />
      {/* Transparent overlay to block interaction and right-click */}
      <div
        className="absolute inset-0 z-10"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}

// ========================================================================
// CHAT PANEL
// ========================================================================

function ChatPanel({
  name,
  startedAt,
}: {
  name: string;
  startedAt: number;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const fakeIndexRef = useRef(0);

  // Inject fake social-proof messages on a timer
  useEffect(() => {
    const iv = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      while (
        fakeIndexRef.current < FAKE_MESSAGES.length &&
        FAKE_MESSAGES[fakeIndexRef.current].delay <= elapsed
      ) {
        const fm = FAKE_MESSAGES[fakeIndexRef.current];
        setMessages((prev) => [
          ...prev,
          { id: `fake-${fakeIndexRef.current}`, name: fm.name, text: fm.text },
        ]);
        fakeIndexRef.current++;
      }
    }, 2000);
    return () => clearInterval(iv);
  }, [startedAt]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        id: `self-${Date.now()}`,
        name,
        text,
        isSelf: true,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] lg:max-h-full bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-violet-400" />
        <span className="text-sm font-semibold">Live Chat</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          <span className="text-xs text-white/40">
            {messages.length} messages
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 min-h-[300px]"
      >
        <div className="text-center py-2">
          <span className="text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full">
            Welcome to the live chat!
          </span>
        </div>
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                msg.isSelf
                  ? "bg-violet-500/30 text-violet-300"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {msg.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <span
                className={`text-xs font-semibold ${
                  msg.isSelf ? "text-violet-400" : "text-white/50"
                }`}
              >
                {msg.name}
              </span>
              <p className="text-sm text-white/80 break-words leading-relaxed">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Say something..."
            maxLength={500}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/40"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-violet-500/20 hover:bg-violet-500/30 disabled:opacity-30 text-violet-300 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// OFFER SECTION
// ========================================================================

function OfferSection() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-xl p-5 text-center">
        <h2 className="text-xl font-bold mb-1 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Special Offer — Available Now
        </h2>
        <p className="text-sm text-white/50">
          Exclusive pricing for today&apos;s live training attendees only
        </p>
      </div>

      {/* Featured product (Elite Business Partner) */}
      {WEBINAR_PRODUCTS.filter((p) => p.featured).map((p) => (
        <a
          key={p.planId}
          href={`https://whop.com/checkout/${p.planId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div
            className={`relative rounded-xl border-2 ${p.border} bg-gradient-to-br from-amber-500/5 via-black to-orange-500/5 p-6 hover:border-amber-500/50 transition-all`}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60" />
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-amber-500/15 rounded-full px-2.5 py-0.5 mb-2">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-lg font-bold">
                  {p.emoji} {p.name}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  ${p.price.toLocaleString()}
                </div>
                <div className="text-xs text-white/40">one-time</div>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-4">{p.tagline}</p>
            <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" /> Community access
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" /> 12 live
                classes/year
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" /> 30% affiliate
                commission
              </span>
            </div>
            <div
              className={`w-full text-center py-3 rounded-xl font-semibold text-sm bg-gradient-to-r ${p.color} text-white group-hover:opacity-90 transition-opacity`}
            >
              Enroll Now — ${p.price.toLocaleString()}
              <ArrowRight className="inline-block w-4 h-4 ml-1.5" />
            </div>
          </div>
        </a>
      ))}

      {/* Course cards grid */}
      <div className="grid sm:grid-cols-3 gap-3">
        {WEBINAR_PRODUCTS.filter((p) => !p.featured).map((p) => (
          <a
            key={p.planId}
            href={`https://whop.com/checkout/${p.planId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div
              className={`rounded-xl border ${p.border} bg-white/[0.03] hover:bg-white/[0.06] p-5 transition-all h-full flex flex-col`}
            >
              <div className="text-2xl mb-2">{p.emoji}</div>
              <h3 className="text-sm font-bold mb-1">{p.name}</h3>
              <p className="text-xs text-white/50 mb-4 flex-1">{p.tagline}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">${p.price}</span>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
