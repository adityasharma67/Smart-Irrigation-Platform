"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  CalendarCheck2,
  ChevronDown,
  CloudSun,
  FileDown,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Moon,
  Settings,
  ShieldCheck,
  Sprout,
  Sun,
  Tractor,
  X,
  Droplets,
  WalletCards,
} from "lucide-react";
import { IconButton, LoadingCard, StatusChip } from "@/components/ui/Ui";
import { useAuth, useFarm, useTheme } from "@/components/providers/AppProviders";
import { PortalView } from "./PortalViews";

const primaryNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, section: "dashboard" },
  { href: "/crops", label: "Crops", icon: Sprout, section: "crops" },
  { href: "/soil", label: "Soil intelligence", icon: Leaf, section: "soil" },
  { href: "/weather", label: "Weather", icon: CloudSun, section: "weather" },
  { href: "/irrigation", label: "Irrigation", icon: Droplets, section: "irrigation" },
  { href: "/tasks", label: "Tasks", icon: CalendarCheck2, section: "tasks" },
];

const insightNav = [
  { href: "/analytics", label: "Analytics", icon: BarChart3, section: "analytics" },
  { href: "/expenses", label: "Expenses", icon: WalletCards, section: "expenses" },
  { href: "/reports", label: "Reports", icon: FileDown, section: "reports" },
];

function relativeTime(value) {
  const difference = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(difference / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function Sidebar({ open, onClose, section, user, activeFarm, onWater }) {
  const pathName = usePathname();
  const navGroup = (items) => items.map((item) => {
    const active = section === item.section || pathName === item.href;
    return <Link onClick={onClose} key={item.href} href={item.href} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-emerald-400 text-[#0d3927] shadow-lg shadow-emerald-950/15" : "text-emerald-50/68 hover:bg-white/8 hover:text-white"}`}><item.icon size={18} strokeWidth={active ? 2.4 : 2} />{item.label}</Link>;
  });
  const userInitials = user?.avatar || user?.name?.split(" ").map((word) => word[0]).join("").slice(0, 2) || "FR";
  return (
    <>
      <AnimatePresence>{open ? <motion.button aria-label="Close navigation" className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} /> : null}</AnimatePresence>
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col bg-[#0c3223] px-3 py-5 text-white transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-2"><Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5 font-extrabold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-300 text-[#0d3927]"><Leaf size={19} /></span><span>Smart Farming<br /><em className="not-italic text-emerald-300">Hub</em></span></Link><button aria-label="Close navigation" className="grid h-9 w-9 place-items-center rounded-xl text-emerald-50/75 hover:bg-white/10 lg:hidden" onClick={onClose}><X size={18} /></button></div>
        <div className="mt-7 px-2"><div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3"><p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-emerald-50/45">Active farm</p><p className="mt-1 truncate text-sm font-extrabold">{activeFarm?.name || "Loading farm…"}</p><p className="mt-0.5 text-xs text-emerald-50/58">{activeFarm?.location?.city || "Connected workspace"}</p></div></div>
        <nav className="scrollbar-none mt-5 flex-1 overflow-y-auto px-1"><p className="mb-2 px-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-emerald-50/40">Farm operations</p><div className="space-y-0.5">{navGroup(primaryNav)}</div><p className="mb-2 mt-7 px-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-emerald-50/40">Plan & learn</p><div className="space-y-0.5">{navGroup(insightNav)}</div></nav>
        <div className="mt-3 space-y-1 border-t border-white/10 pt-4"><Link onClick={onClose} href="/settings" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${section === "settings" ? "bg-white/13 text-white" : "text-emerald-50/68 hover:bg-white/8 hover:text-white"}`}><Settings size={18} />Farm settings</Link>{user?.role === "admin" ? <Link onClick={onClose} href="/admin" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${section === "admin" ? "bg-white/13 text-white" : "text-emerald-50/68 hover:bg-white/8 hover:text-white"}`}><ShieldCheck size={18} />Admin console</Link> : null}<button onClick={() => { onClose?.(); onWater?.(); }} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-extrabold text-emerald-100 transition hover:bg-white/15"><Droplets size={16} />Water a zone now</button></div>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-black/10 p-2.5"><span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-300 text-xs font-extrabold text-[#0d3927]">{userInitials}</span><div className="min-w-0"><p className="truncate text-xs font-extrabold">{user?.name || "Farm member"}</p><p className="mt-0.5 truncate text-[0.66rem] capitalize text-emerald-50/55">{user?.role || "farmer"}</p></div></div>
      </aside>
    </>
  );
}

export function PortalPage({ section }) {
  const router = useRouter();
  const { user, isAuthenticated, isReady, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { data, activeFarm, activeAlerts, activeSchedules, actions, isReady: dataReady } = useFarm();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (isReady && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isReady, router]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const pendingAlerts = useMemo(() => activeAlerts.filter((alert) => !alert.resolved), [activeAlerts]);
  const waterNow = () => {
    const schedule = activeSchedules.find((item) => item.enabled && item.mode === "manual") || activeSchedules.find((item) => item.enabled);
    if (!schedule) return setNotice("No active irrigation zone is available for this farm.");
    actions.waterNow(schedule.id);
    setNotice(`${schedule.name} started. The action was logged in your farm activity.`);
  };

  if (!isReady || !dataReady || !isAuthenticated) {
    return <div className="min-h-screen p-6 lg:pl-[19rem]"><div className="mx-auto max-w-7xl"><div className="h-10 w-44 animate-pulse rounded-xl bg-[var(--line)]" /><div className="mt-8 grid gap-4 md:grid-cols-3"><LoadingCard /><LoadingCard /><LoadingCard /></div></div></div>;
  }

  return (
    <div className="min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} section={section} user={user} activeFarm={activeFarm} onWater={waterNow} />
      <main className="min-h-screen lg:pl-[17rem]">
        <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:var(--canvas)]/86 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[104rem] items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3"><IconButton className="lg:hidden" label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={19} /></IconButton><div className="min-w-0"><p className="hidden text-xs font-semibold muted sm:block">Farm workspace</p><div className="flex min-w-0 items-center gap-1.5"><Tractor size={15} className="shrink-0 text-emerald-600" /><select value={data.activeFarmId || ""} onChange={(event) => actions.setActiveFarm(event.target.value)} className="max-w-[12rem] appearance-none bg-transparent pr-1 text-sm font-extrabold outline-none sm:max-w-xs"><option value="" disabled>Select farm</option>{data.farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</select><ChevronDown size={14} className="text-[var(--muted)]" /></div></div></div>
            <div className="flex items-center gap-2">
              <div className="relative"><IconButton label="Notifications" onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} className="relative"><Bell size={18} />{pendingAlerts.length ? <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[0.57rem] font-extrabold text-white">{pendingAlerts.length}</span> : null}</IconButton><AnimatePresence>{showNotifications ? <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute right-0 mt-2 w-[20rem] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-solid)] shadow-2xl"><div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3"><p className="font-extrabold">Alerts</p><StatusChip tone={pendingAlerts.length ? "warning" : "success"}>{pendingAlerts.length} open</StatusChip></div><div className="max-h-72 overflow-y-auto">{pendingAlerts.length ? pendingAlerts.slice(0, 4).map((alert) => <div className="border-b border-[var(--line)] p-3 last:border-0" key={alert.id}><p className="text-sm font-bold">{alert.title}</p><p className="mt-1 text-xs leading-5 muted">{alert.message}</p><p className="mt-1.5 text-[0.68rem] font-semibold text-emerald-700 dark:text-emerald-300">{relativeTime(alert.createdAt)}</p></div>) : <p className="p-5 text-center text-sm muted">You’re all clear.</p>}</div><Link onClick={() => setShowNotifications(false)} href="/tasks" className="block border-t border-[var(--line)] p-3 text-center text-sm font-extrabold text-emerald-700 dark:text-emerald-300">View action plan</Link></motion.div> : null}</AnimatePresence></div>
              <IconButton label="Toggle colour theme" onClick={toggleTheme}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</IconButton>
              <div className="relative"><button aria-label="Open profile menu" onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emerald-200 to-emerald-400 text-xs font-extrabold text-emerald-950 ring-2 ring-transparent transition hover:ring-emerald-500/25">{user?.avatar || "FR"}</button><AnimatePresence>{showProfile ? <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute right-0 mt-2 w-52 rounded-2xl border border-[var(--line)] bg-[var(--surface-solid)] p-2 shadow-2xl"><div className="border-b border-[var(--line)] px-2.5 py-2.5"><p className="truncate text-sm font-extrabold">{user?.name}</p><p className="mt-0.5 truncate text-xs muted">{user?.email}</p></div><Link href="/settings" onClick={() => setShowProfile(false)} className="mt-1 flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-bold hover:bg-[var(--surface-soft)]"><Settings size={16} />Profile & settings</Link><button onClick={() => { signOut(); setShowProfile(false); }} className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-bold text-rose-600 hover:bg-rose-500/8"><LogOut size={16} />Sign out</button></motion.div> : null}</AnimatePresence></div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-[104rem] px-4 py-6 sm:px-6 sm:py-8 lg:px-8"><PortalView section={section} notice={notice} onWater={waterNow} /></div>
      </main>
      <AnimatePresence>{notice ? <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="fixed bottom-5 right-5 z-[80] max-w-sm rounded-2xl border border-emerald-500/20 bg-[#0d3927] px-4 py-3 text-sm font-semibold text-emerald-50 shadow-2xl"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-300" />{notice}</motion.div> : null}</AnimatePresence>
    </div>
  );
}
