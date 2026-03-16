"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  Globe,
  Play,
  Shield,
  Star,
  TrendingUp,
  Phone,
  Users,
  Zap,
} from "lucide-react";
import {
  TIMEZONE_OPTIONS,
  WEBINAR_TESTIMONIALS,
  generateTimeSlots,
} from "@/lib/constants";

export function LandingPage() {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [timezone, setTimezone] = useState(() =>
    typeof window !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "Asia/Singapore"
  );
  const slots = useMemo(() => generateTimeSlots(timezone), [timezone]);
  const timezoneOptions = useMemo(() => {
    const detected =
      typeof window !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "Asia/Singapore";
    if (TIMEZONE_OPTIONS.some((o) => o.value === detected))
      return TIMEZONE_OPTIONS;
    return [
      { value: detected, label: `${detected.replace(/_/g, " ")} (detected)` },
      ...TIMEZONE_OPTIONS,
    ];
  }, []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wantSms, setWantSms] = useState(false);
  const [countryCode, setCountryCode] = useState("+65");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSlotPick = (time: number) => {
    setSelectedSlot(time);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !email.trim() || !selectedSlot || submitting) return;

      setSubmitting(true);
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() ? `${countryCode}${phone.trim()}` : "",
            wantSms,
            slotTime: selectedSlot,
            timezone,
          }),
        });
        const data = await res.json();
        if (data.success) {
          router.push(data.redirectTo);
        }
      } catch {
        setSubmitting(false);
      }
    },
    [name, email, phone, countryCode, wantSms, selectedSlot, timezone, submitting, router]
  );

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-violet-600/[0.08] rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[400px] bg-cyan-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[300px] bg-pink-500/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* Top urgency bar */}
      <div className="relative bg-gradient-to-r from-violet-600/90 via-pink-600/90 to-violet-600/90 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span>
            🔥 FREE Live Training — Limited Spots Per Session — Reserve Yours Now
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-4 pt-12 sm:pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/[0.12] border border-emerald-500/20 rounded-full px-5 py-2 mb-8">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-emerald-300">
              FREE Live Training — Watch From Anywhere
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] mb-6 tracking-tight">
            How I Use{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              TikTok + AI
            </span>{" "}
            to Generate
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}$5K–$10K/Month
            </span>{" "}
            in Affiliate Income
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-4 leading-relaxed">
            …even with zero followers, no tech skills, and without ever showing
            your face on camera.
          </p>

          <p className="text-base text-white/40 max-w-xl mx-auto mb-10">
            Join this free 60-minute training to see the exact system, tools,
            and AI workflows behind it all — then decide if it&apos;s for you.
          </p>

          <button
            type="button"
            onClick={() => {
              document
                .getElementById("time-slots")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white font-bold text-lg py-4 px-10 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-violet-500/20"
          >
            <Play className="w-5 h-5 fill-white" />
            Choose Your Time Slot
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="relative border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-x-10 gap-y-3">
          {[
            { icon: Users, val: "2,847+", label: "have watched this training" },
            { icon: Star, val: "4.9/5", label: "average rating" },
            { icon: TrendingUp, val: "78%", label: "start earning within 30 days" },
            { icon: Zap, val: "15+", label: "countries represented" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-white/50 text-sm">
              <s.icon className="w-4 h-4 text-violet-400" />
              <span>
                <strong className="text-white">{s.val}</strong> {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* What you'll learn */}
      <section className="relative max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What You&apos;ll Discover in This{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Free Training
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            60 minutes of pure, actionable content — no fluff, no filler
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: "🎯", title: "The Viral Niche Formula", desc: "The 3-step system to find niches that pay $50–$200+ per sale — before you post a single video.", gradient: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/15" },
            { icon: "🤖", title: "AI Content Machine", desc: "How to use AI to create 10x more content in 1/10th the time — scripts, videos, captions, all automated.", gradient: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/15" },
            { icon: "👻", title: "Faceless Strategy", desc: "The exact faceless approach that lets you build a following without ever showing your face or using your voice.", gradient: "from-pink-500/20 to-pink-500/5", border: "border-pink-500/15" },
            { icon: "💰", title: "First Commission in 14 Days", desc: "The fast-start blueprint that got 78% of our students their first affiliate sale within their first 14 days.", gradient: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/15" },
            { icon: "📈", title: "Scale to $10K/Month", desc: "How top performers scaled from $0 to $10K/month using just TikTok, AI tools, and affiliate offers.", gradient: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/15" },
            { icon: "🚀", title: "Live Q&A + Next Steps", desc: "Get your questions answered and learn about the advanced programs available if you want to go deeper.", gradient: "from-rose-500/20 to-rose-500/5", border: "border-rose-500/15" },
          ].map((item) => (
            <div
              key={item.title}
              className={`bg-gradient-to-br ${item.gradient} border ${item.border} rounded-2xl p-6 hover:border-white/15 transition-colors`}
            >
              <span className="text-3xl mb-4 block">{item.icon}</span>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Time Slot Selector + Registration */}
      <section id="time-slots" className="relative max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Session Time
            </span>
          </h2>
          <p className="text-white/40 text-lg mb-1">
            Pick a time that works for you. Sessions run every few hours.
          </p>
          <p className="text-white/30 text-sm mb-5 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Sessions scheduled in Singapore Time (SGT)
          </p>
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5">
            <Globe className="w-4 h-4 text-violet-400 shrink-0" />
            <span className="text-xs text-white/40 shrink-0">Show times in:</span>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer"
            >
              {timezoneOptions.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#1a1a1f] text-white">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time slots grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {slots.map((slot, i) => {
            const isSelected = selectedSlot === slot.time;
            const isFirst = i === 0;
            return (
              <button
                key={slot.time}
                type="button"
                onClick={() => handleSlotPick(slot.time)}
                className={`relative text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                {isFirst && (
                  <div className="absolute -top-2.5 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    NEXT SESSION
                  </div>
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold">{slot.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-violet-400" />}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isFirst ? "text-emerald-400 font-semibold" : "text-white/40"}`}>
                    {slot.sublabel}
                  </span>
                  <span className="text-xs text-amber-400/80">{slot.spotsLeft} spots left</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Registration form */}
        <div
          ref={formRef}
          className={`transition-all duration-500 ${selectedSlot ? "opacity-100 translate-y-0" : "opacity-40 translate-y-2 pointer-events-none"}`}
        >
          <div className="bg-gradient-to-br from-violet-500/10 via-[#0a0a0f] to-pink-500/10 border border-violet-500/20 rounded-2xl p-6 sm:p-8 max-w-lg mx-auto">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Play className="w-7 h-7 text-white fill-white" />
              </div>
              <h3 className="text-xl font-bold mb-1">Reserve Your Spot — It&apos;s Free</h3>
              {selectedSlot && (
                <p className="text-sm text-violet-300">
                  Session:{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    timeZone: timezone,
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }).format(new Date(selectedSlot))}
                </p>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="w-name" className="block text-xs font-medium text-white/50 mb-1.5">
                  Your Name *
                </label>
                <input
                  id="w-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="w-email" className="block text-xs font-medium text-white/50 mb-1.5">
                  Email Address *
                </label>
                <input
                  id="w-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                />
              </div>

              {/* SMS opt-in */}
              <div>
                <label htmlFor="w-sms" className="flex items-center gap-3 cursor-pointer group">
                  <input
                    id="w-sms"
                    type="checkbox"
                    checked={wantSms}
                    onChange={(e) => setWantSms(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      wantSms
                        ? "bg-violet-500 border-violet-500"
                        : "border-white/20 bg-white/5 group-hover:border-white/30"
                    }`}
                  >
                    {wantSms && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-sm text-white/70">
                    I Would Like to Receive an SMS Text Alert Before The Event Starts
                  </span>
                </label>

                {wantSms && (
                  <div className="mt-3 ml-8">
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                      >
                        <option value="+65" className="bg-[#1a1a1f]">🇸🇬 +65</option>
                        <option value="+60" className="bg-[#1a1a1f]">🇲🇾 +60</option>
                        <option value="+62" className="bg-[#1a1a1f]">🇮🇩 +62</option>
                        <option value="+63" className="bg-[#1a1a1f]">🇵🇭 +63</option>
                        <option value="+66" className="bg-[#1a1a1f]">🇹🇭 +66</option>
                        <option value="+84" className="bg-[#1a1a1f]">🇻🇳 +84</option>
                        <option value="+852" className="bg-[#1a1a1f]">🇭🇰 +852</option>
                        <option value="+86" className="bg-[#1a1a1f]">🇨🇳 +86</option>
                        <option value="+81" className="bg-[#1a1a1f]">🇯🇵 +81</option>
                        <option value="+82" className="bg-[#1a1a1f]">🇰🇷 +82</option>
                        <option value="+91" className="bg-[#1a1a1f]">🇮🇳 +91</option>
                        <option value="+971" className="bg-[#1a1a1f]">🇦🇪 +971</option>
                        <option value="+44" className="bg-[#1a1a1f]">🇬🇧 +44</option>
                        <option value="+33" className="bg-[#1a1a1f]">🇫🇷 +33</option>
                        <option value="+49" className="bg-[#1a1a1f]">🇩🇪 +49</option>
                        <option value="+1" className="bg-[#1a1a1f]">🇺🇸 +1</option>
                        <option value="+61" className="bg-[#1a1a1f]">🇦🇺 +61</option>
                        <option value="+64" className="bg-[#1a1a1f]">🇳🇿 +64</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone number"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-white/30 mt-2 leading-relaxed">
                      (Optional But Highly Recommended) Select your country code and enter your mobile phone number to receive a text alert reminder before the event starts.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-lg shadow-lg shadow-violet-500/20"
              >
                {submitting ? "Registering..." : "Reserve My Free Spot"}
                {!submitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
            <div className="mt-4 flex items-center justify-center gap-5 text-xs text-white/30">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> No spam ever</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 60 min session</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3" /> 100% free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Students Who Took Action</h2>
            <p className="text-white/40">
              Real results from people who watched this training and applied what they learned
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {WEBINAR_TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((k) => (
                    <Star key={k} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center text-xs font-bold`}>
                      {t.avatar}
                    </div>
                    <span className="text-sm font-medium">{t.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">{t.result}</div>
                    <div className="text-[10px] text-white/30">{t.resultLabel}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Your Future Self Will Thank You
        </h2>
        <p className="text-white/40 text-lg mb-8 max-w-lg mx-auto">
          One free training. 60 minutes. The system that&apos;s helping everyday
          people build real affiliate income with AI.
        </p>
        <button
          type="button"
          onClick={() => {
            document.getElementById("time-slots")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white font-bold text-lg py-4 px-10 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-violet-500/20"
        >
          <Play className="w-5 h-5 fill-white" />
          Pick Your Time Slot — It&apos;s Free
        </button>
        <p className="text-white/20 text-xs mt-6">
          No credit card required · Instant access · Watch from anywhere
        </p>
      </section>
    </div>
  );
}
