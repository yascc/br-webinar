// ---- TIMEZONE OPTIONS ----
export const TIMEZONE_OPTIONS = [
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur (MYT)" },
  { value: "Asia/Jakarta", label: "Jakarta (WIB)" },
  { value: "Asia/Manila", label: "Manila (PHT)" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Seoul", label: "Seoul (KST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "America/New_York", label: "New York (ET)" },
  { value: "America/Chicago", label: "Chicago (CT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
  { value: "Pacific/Auckland", label: "Auckland (NZST)" },
];

// ---- WEBINAR PRODUCTS ----
export const WEBINAR_PRODUCTS = [
  {
    name: "Sora 2",
    planId: "plan_B41deY2WYgjXy",
    price: 450,
    tagline: "Master AI video generation with OpenAI's Sora 2",
    emoji: "🎬",
    color: "from-cyan-500 to-blue-500",
    border: "border-cyan-500/30",
    featured: false,
  },
  {
    name: "AIGC Advanced",
    planId: "plan_dzQshfiTTDLQg",
    price: 388,
    tagline: "Advanced AI content generation techniques for professionals",
    emoji: "⚡",
    color: "from-violet-500 to-purple-500",
    border: "border-violet-500/30",
    featured: false,
  },
  {
    name: "TikTok Content Creation",
    planId: "plan_HXtysJLuJ3YOC",
    price: 890,
    tagline: "Master TikTok from zero to viral with proven frameworks",
    emoji: "📱",
    color: "from-pink-500 to-rose-500",
    border: "border-pink-500/30",
    featured: false,
  },
  {
    name: "Elite Business Partner",
    planId: "plan_C4INnfgBORUj3",
    price: 2500,
    tagline:
      "Full access to everything + Mentorship + Community + 3D2N Bali Trip + 12 live classes/year",
    emoji: "👑",
    color: "from-amber-500 to-orange-500",
    border: "border-amber-500/30",
    featured: true,
  },
];

// ---- FAKE CHAT MESSAGES ----
export const FAKE_MESSAGES: { delay: number; name: string; text: string }[] = [
  { delay: 5, name: "Alex M.", text: "Excited to be here! 🔥" },
  { delay: 18, name: "Jessica L.", text: "Joining from Australia!" },
  { delay: 35, name: "Marcus T.", text: "This is my second time watching, so much value" },
  { delay: 60, name: "Priya S.", text: "Can't wait to learn about the AI tools" },
  { delay: 90, name: "David K.", text: "Already made $500 from the last training 💰" },
  { delay: 130, name: "Sophia R.", text: "The TikTok strategy is insane" },
  { delay: 180, name: "James W.", text: "Is there a replay available after this?" },
  { delay: 240, name: "Emma C.", text: "Taking so many notes right now 📝" },
  { delay: 300, name: "Ryan B.", text: "This is way better than any course I've bought" },
  { delay: 380, name: "Aisha N.", text: "The faceless strategy is exactly what I needed" },
  { delay: 450, name: "Carlos G.", text: "Just signed up for the AIGC course! 🎉" },
  { delay: 540, name: "Nina P.", text: "Who else is going all in on this?" },
  { delay: 640, name: "Tom H.", text: "The affiliate commission structure is incredible" },
  { delay: 750, name: "Luna W.", text: "Elite Business Partner looks like the move 👀" },
  { delay: 870, name: "Daniel F.", text: "Can someone help me with the checkout?" },
  { delay: 1000, name: "Olivia M.", text: "Just enrolled in Elite! See you all in the community 🙌" },
];

// ---- TESTIMONIALS ----
export const WEBINAR_TESTIMONIALS = [
  {
    name: "Sarah T.",
    avatar: "S",
    text: "I went from zero followers to making consistent affiliate income in under 30 days. The AI tools they showed me changed everything.",
    result: "$3,200/mo",
    resultLabel: "Monthly Income",
    color: "bg-violet-500/30 text-violet-300",
  },
  {
    name: "Marcus L.",
    avatar: "M",
    text: "I was skeptical about the faceless approach, but now I post 3 videos a day without showing my face. The commissions keep growing.",
    result: "500K+",
    resultLabel: "Views in 2 Weeks",
    color: "bg-cyan-500/30 text-cyan-300",
  },
  {
    name: "Priya K.",
    avatar: "P",
    text: "This training opened my eyes. I didn't know AI could do all of this. I'm now building a real business, not just posting content.",
    result: "$5K",
    resultLabel: "First 60 Days",
    color: "bg-pink-500/30 text-pink-300",
  },
];

// ---- TIME SLOT GENERATION ----
// Generate 3-hour-aligned sessions in Singapore Time, filtering out 2am–6am SGT
export function generateTimeSlots(displayTimezone: string): {
  time: number;
  label: string;
  sublabel: string;
  spotsLeft: number;
}[] {
  const now = Date.now();
  const slots: { time: number; label: string; sublabel: string; spotsLeft: number }[] = [];
  const spotsPool = [12, 7, 19, 4, 15, 9];

  const d = new Date(now);
  d.setUTCMinutes(0, 0, 0);
  d.setUTCHours(d.getUTCHours() + 1);
  const sgtHour = (d.getUTCHours() + 8) % 24;
  const remainder = sgtHour % 3;
  if (remainder !== 0) d.setUTCHours(d.getUTCHours() + (3 - remainder));
  if (d.getTime() <= now) d.setUTCHours(d.getUTCHours() + 3);

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: displayTimezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const dayFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: displayTimezone,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const todayStr = dayFormatter.format(new Date(now));
  const tomorrowStr = dayFormatter.format(new Date(now + 86400000));

  let candidate = d.getTime();
  while (slots.length < 5) {
    const candDate = new Date(candidate);
    const candSGTHour = (candDate.getUTCHours() + 8) % 24;

    if (candSGTHour < 2 || candSGTHour >= 6) {
      const timeStr = timeFormatter.format(candDate);
      const candDayStr = dayFormatter.format(candDate);

      let dayLabel: string;
      if (candDayStr === todayStr) dayLabel = "Today";
      else if (candDayStr === tomorrowStr) dayLabel = "Tomorrow";
      else dayLabel = candDayStr;

      const diff = candidate - now;
      const sublabel =
        diff < 3600000
          ? `Starting in ${Math.max(1, Math.floor(diff / 60000))} min`
          : `${dayLabel} at ${timeStr}`;

      slots.push({
        time: candidate,
        label: `${dayLabel}, ${timeStr}`,
        sublabel,
        spotsLeft: spotsPool[slots.length % spotsPool.length],
      });
    }
    candidate += 3 * 60 * 60 * 1000;
  }
  return slots;
}
