"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Check,
  ChevronRight,
  CloudSun,
  Droplets,
  Leaf,
  Menu,
  Moon,
  Play,
  ShieldCheck,
  Sparkles,
  Sun,
  Tractor,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button, IconButton, StatusChip } from "@/components/ui/Ui";
import { useTheme } from "@/components/providers/AppProviders";

const features = [
  {
    icon: Droplets,
    title: "Precision irrigation",
    copy: "Turn soil data and rainfall forecasts into confident watering decisions.",
    tint: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: CloudSun,
    title: "Weather intelligence",
    copy: "See field-level conditions, rain probability, and timely risk alerts.",
    tint: "bg-amber-400/15 text-amber-600",
  },
  {
    icon: BarChart3,
    title: "Farm performance",
    copy: "Follow yield, spend, crop health, and water efficiency in one clear view.",
    tint: "bg-emerald-500/10 text-emerald-700",
  },
  {
    icon: BellRing,
    title: "Actionable alerts",
    copy: "Catch moisture dips, pest risk, and overdue work before they cost you.",
    tint: "bg-rose-500/10 text-rose-600",
  },
];

const socialProof = [
  ["31%", "less water used"],
  ["4.8×", "faster field checks"],
  ["96%", "tasks completed on time"],
];

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[43rem]">
      <div className="absolute -inset-7 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_40%_40%,rgba(53,184,113,.28),transparent_56%)] blur-2xl" />
      <div className="overflow-hidden rounded-[1.6rem] border border-white/60 bg-white/90 p-3 shadow-[0_30px_75px_rgba(4,74,44,.24)] backdrop-blur-xl dark:border-white/10 dark:bg-[#10281d]/90">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-2 pb-3">
          <div className="flex gap-1.5"><i className="h-2 w-2 rounded-full bg-rose-400" /><i className="h-2 w-2 rounded-full bg-amber-400" /><i className="h-2 w-2 rounded-full bg-emerald-400" /></div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[0.62rem] font-bold text-emerald-700 dark:text-emerald-300">LIVE FIELD DATA</span>
          <span className="h-3 w-10" />
        </div>
        <div className="grid gap-3 p-2 pt-4 sm:grid-cols-[10.4rem_1fr]">
          <aside className="hidden rounded-xl bg-[#0d3927] p-3 text-white sm:block">
            <div className="flex items-center gap-2 text-[0.63rem] font-extrabold"><span className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-400 text-[#0d3927]"><Leaf size={13} /></span>SMART FARMING</div>
            <div className="mt-6 space-y-1 text-[0.62rem] text-emerald-100/70">
              {["Overview", "Crops", "Soil intelligence", "Irrigation", "Analytics"].map((item, index) => <div className={`rounded-lg px-2 py-2 ${index === 0 ? "bg-white/13 text-white" : ""}`} key={item}>{item}</div>)}
            </div>
            <div className="mt-8 rounded-lg bg-emerald-300/10 p-2">
              <p className="text-[0.57rem] text-emerald-100/65">Water efficiency</p>
              <p className="mt-1 text-base font-extrabold">88.4%</p>
              <div className="mt-2 h-1 rounded-full bg-white/10"><div className="h-full w-[88%] rounded-full bg-emerald-300" /></div>
            </div>
          </aside>
          <main className="min-w-0">
            <div className="flex items-center justify-between"><div><p className="text-[0.58rem] font-bold uppercase tracking-widest text-[var(--muted)]">Tuesday, 9 September</p><h3 className="mt-1 text-sm font-extrabold">Good morning, Farhan</h3></div><span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-[0.65rem] font-bold text-emerald-800">FR</span></div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ["Moisture", "64%", "text-sky-600", "bg-sky-500/10"],
                ["Open alerts", "02", "text-amber-600", "bg-amber-400/15"],
                ["Water saved", "31%", "text-emerald-700", "bg-emerald-500/10"],
              ].map(([label, value, text, bg]) => <div className={`rounded-xl p-2 ${bg}`} key={label}><p className="text-[0.52rem] font-semibold text-[var(--muted)]">{label}</p><p className={`mt-1 text-sm font-extrabold ${text}`}>{value}</p></div>)}
            </div>
            <div className="mt-3 rounded-xl border border-[var(--line)] p-3">
              <div className="flex items-center justify-between"><div><p className="text-[0.62rem] font-extrabold">Soil moisture trend</p><p className="mt-0.5 text-[0.52rem] text-[var(--muted)]">North field · last 7 days</p></div><StatusChip tone="success">Healthy</StatusChip></div>
              <div className="mt-2 flex h-16 items-end gap-1.5">{[36, 52, 45, 67, 57, 71, 64, 80, 71, 75, 63, 67].map((height, index) => <span key={index} className="flex-1 rounded-t bg-gradient-to-t from-emerald-500 to-emerald-300" style={{ height: `${height}%`, opacity: 0.48 + index * 0.04 }} />)}</div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#0d3927] p-2.5 text-white"><span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-400 text-[#0d3927]"><Droplets size={14} /></span><div className="min-w-0 flex-1"><p className="text-[0.61rem] font-extrabold">Irrigation set for 6:00 AM</p><p className="text-[0.52rem] text-emerald-100/75">Auto mode · weather checked</p></div><ChevronRight size={14} /></div>
          </main>
        </div>
      </div>
      <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-white/70 bg-white/95 p-3 shadow-lg dark:border-white/10 dark:bg-[#10281d]/95 sm:block">
        <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-400/15 text-amber-600"><Sparkles size={15} /></span><div><p className="text-[0.68rem] font-extrabold">Rain predicted tomorrow</p><p className="text-[0.58rem] muted">Schedule automatically adjusted</p></div></div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="overflow-x-hidden">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-[#0b5d3b] text-white shadow-lg shadow-emerald-900/20"><Leaf size={19} /></span>
          <span>Smart Farming <em className="not-italic text-emerald-600">Hub</em></span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-[var(--muted)] md:flex">
          <a href="#features" className="hover:text-[var(--forest)]">Platform</a>
          <a href="#outcomes" className="hover:text-[var(--forest)]">Outcomes</a>
          <a href="#stories" className="hover:text-[var(--forest)]">Stories</a>
          <a href="#pricing" className="hover:text-[var(--forest)]">For teams</a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <IconButton label="Toggle colour theme" onClick={toggleTheme}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</IconButton>
          <Link href="/login" className="btn btn-ghost">Log in</Link>
          <Link href="/signup" className="btn btn-primary">Start free <ArrowRight size={16} /></Link>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <IconButton label="Toggle colour theme" onClick={toggleTheme}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</IconButton>
          <IconButton label="Open navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</IconButton>
        </div>
      </header>

      {menuOpen ? <div className="mx-5 mb-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-solid)] p-3 shadow-xl md:hidden"><nav className="grid gap-1 text-sm font-semibold"><a href="#features" className="rounded-xl p-3">Platform</a><a href="#outcomes" className="rounded-xl p-3">Outcomes</a><a href="#stories" className="rounded-xl p-3">Stories</a><Link href="/login" className="rounded-xl p-3">Log in</Link><Link href="/signup" className="btn btn-primary mt-1">Start free</Link></nav></div> : null}

      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 lg:grid-cols-[0.94fr_1.06fr] lg:px-8 lg:pb-28 lg:pt-20">
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="eyebrow rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5"><Sparkles size={13} /> Intelligence that grows with you</span>
              <h1 className="display mt-6 max-w-xl text-[3.25rem] font-extrabold sm:text-6xl lg:text-[4.25rem]">Grow with more <span className="bg-gradient-to-r from-emerald-600 to-[#59b882] bg-clip-text text-transparent">clarity.</span></h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-[var(--muted)] sm:text-lg">Smart Farming Hub turns scattered field signals into simple, useful decisions—so every crop gets the care it needs, exactly when it needs it.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="btn btn-primary px-5">Build your farm command center <ArrowRight size={17} /></Link>
                <a href="#preview" className="btn btn-secondary"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Play size={10} fill="currentColor" /></span> See how it works</a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-[var(--muted)]">
                {["No credit card", "Works on any device", "Built for real farm teams"].map((text) => <span className="flex items-center gap-1.5" key={text}><Check size={16} className="text-emerald-600" />{text}</span>)}
              </div>
            </motion.div>
          </div>
          <motion.div id="preview" initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.12 }}>
            <ProductPreview />
          </motion.div>
        </section>

        <section id="outcomes" className="border-y border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto grid max-w-7xl divide-y divide-[var(--line)] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
            {socialProof.map(([value, label]) => <div className="px-6 py-7 text-center sm:px-8" key={label}><p className="text-3xl font-extrabold tracking-tight text-[var(--forest)]">{value}</p><p className="mt-1 text-sm muted">{label}</p></div>)}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl"><span className="eyebrow"><Tractor size={14} /> One calm command center</span><h2 className="display mt-4 text-4xl font-extrabold sm:text-5xl">Everything your farm needs to move with confidence.</h2><p className="mt-5 text-base leading-7 muted">From soil to sale, every operational signal has a useful place—and every action is just a click away.</p></div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => <motion.article key={feature.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="card card-hover p-5"><span className={`grid h-11 w-11 place-items-center rounded-2xl ${feature.tint}`}><feature.icon size={21} /></span><h3 className="mt-6 font-extrabold">{feature.title}</h3><p className="mt-2 text-sm leading-6 muted">{feature.copy}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-emerald-700 dark:text-emerald-300">Explore <ArrowRight size={14} /></span></motion.article>)}
          </div>
        </section>

        <section id="stories" className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28">
          <div className="overflow-hidden rounded-[2rem] bg-[#0d3927] px-6 py-10 text-white sm:px-10 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:px-14 lg:py-14">
            <div><span className="eyebrow text-emerald-200"><ShieldCheck size={14} /> Built around crop care</span><h2 className="display mt-5 max-w-xl text-4xl font-extrabold sm:text-5xl">“I no longer have to guess which field needs me first.”</h2><p className="mt-6 max-w-xl text-base leading-7 text-emerald-50/76">Smart Farming Hub gave our small team a shared rhythm. We plan faster, use less water, and spend more time growing instead of chasing updates.</p><div className="mt-7 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-300 font-bold text-[#0d3927]">AK</span><div><p className="text-sm font-extrabold">Aisha Khan</p><p className="text-xs text-emerald-100/65">Farm manager, Green Valley Farms</p></div></div></div>
            <div className="mt-10 grid grid-cols-2 gap-3 lg:mt-0"><div className="rounded-2xl bg-white/8 p-5"><p className="text-3xl font-extrabold text-emerald-300">12 ha</p><p className="mt-2 text-xs text-emerald-100/65">farm footprint monitored</p></div><div className="mt-8 rounded-2xl bg-emerald-400 p-5 text-[#0d3927]"><p className="text-3xl font-extrabold">7 days</p><p className="mt-2 text-xs text-[#0d3927]/70">of action-ready forecasts</p></div><div className="-mt-2 rounded-2xl border border-white/10 p-5"><p className="text-3xl font-extrabold">24/7</p><p className="mt-2 text-xs text-emerald-100/65">field signals, neatly organized</p></div><div className="mt-6 rounded-2xl bg-white/8 p-5"><p className="text-3xl font-extrabold text-amber-300">4.8×</p><p className="mt-2 text-xs text-emerald-100/65">faster daily field checks</p></div></div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-4xl px-5 pb-20 text-center lg:pb-28"><span className="eyebrow"><Leaf size={14} /> Ready when you are</span><h2 className="display mt-4 text-4xl font-extrabold sm:text-5xl">Make every growing day count.</h2><p className="mx-auto mt-4 max-w-xl leading-7 muted">Start with a fully working farm workspace. Invite your team when you’re ready.</p><div className="mt-7"><Link href="/signup"><Button>Start your free workspace <ArrowRight size={16} /></Button></Link></div></section>
      </main>
      <footer className="border-t border-[var(--line)] bg-[var(--surface)]"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between lg:px-8"><span className="flex items-center gap-2 font-bold text-[var(--ink)]"><Leaf size={16} className="text-emerald-600" /> Smart Farming Hub</span><span>Built for resilient, more thoughtful farming.</span><div className="flex gap-4"><Link href="/login">Log in</Link><Link href="/signup">Create account</Link></div></div></footer>
    </div>
  );
}
