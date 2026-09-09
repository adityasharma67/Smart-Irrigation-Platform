"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CloudRain,
  CloudSun,
  Droplets,
  Play,
  Sprout,
  TrendingUp,
  Tractor,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button, MetricCard, ProgressBar, SectionHeader, StatusChip } from "@/components/ui/Ui";
import { useFarm } from "@/components/providers/AppProviders";
import { formatDate, formatNumber, relativeDue, toneForCrop, toneForSeverity } from "./format";

const CustomTooltip = ({ active, payload, label }) => active && payload?.length ? <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-solid)] px-3 py-2 shadow-lg"><p className="text-xs font-bold muted">{label}</p><p className="mt-1 text-sm font-extrabold">{payload[0].value}% moisture</p></div> : null;

function WeatherIcon({ icon, size = 18 }) {
  if (icon?.includes("rain") || icon?.includes("lightning")) return <CloudRain size={size} />;
  return <CloudSun size={size} />;
}

export function DashboardView({ onWater, notice }) {
  const { activeFarm, activeCrops, activeAlerts, activeTasks, activeSchedules, data, stats } = useFarm();
  const weather = data.weather;
  const analytics = data.analytics;
  const current = weather?.current;
  const openAlerts = activeAlerts.filter((alert) => !alert.resolved);
  const pendingTasks = activeTasks.filter((task) => task.status !== "completed").slice(0, 4);
  const nextSchedule = activeSchedules.filter((schedule) => schedule.enabled).sort((a, b) => new Date(a.nextRun) - new Date(b.nextRun))[0];
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const averageMoisture = Math.round(activeCrops.reduce((total, crop) => total + crop.latestMoisture, 0) / Math.max(activeCrops.length, 1));

  return (
    <div className="space-y-6 fade-enter">
      <section className="relative overflow-hidden rounded-[1.55rem] bg-[#0d3927] p-5 text-white shadow-[0_18px_45px_rgba(12,66,40,.18)] sm:p-7">
        <div className="absolute -right-14 -top-16 h-56 w-56 rounded-full bg-emerald-400/13 blur-3xl" /><div className="absolute bottom-0 right-0 h-36 w-2/3 opacity-25 [background-image:linear-gradient(rgba(132,244,180,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(132,244,180,.22)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative grid gap-6 xl:grid-cols-[1fr_auto] xl:items-center"><div><span className="eyebrow text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />All field systems reporting</span><h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{greeting}, {data.profile?.firstName || "Farhan"}.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/72">Your farm is in a good rhythm. One moisture zone and two weather-aware actions need attention today.</p><div className="mt-5 flex flex-wrap gap-2"><Button className="!bg-emerald-300 !text-[#0d3927] hover:!bg-emerald-200" onClick={onWater}><Play size={15} fill="currentColor" />Water a zone now</Button><Link href="/tasks" className="btn border border-white/15 bg-white/7 text-emerald-50 hover:bg-white/13">Open daily plan <ArrowRight size={15} /></Link></div></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:w-[25rem]"><div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3.5"><p className="text-[0.65rem] font-bold uppercase tracking-wide text-emerald-100/55">Next irrigation</p><p className="mt-2 text-sm font-extrabold">{nextSchedule ? nextSchedule.startTime : "No run"}</p><p className="mt-1 text-xs text-emerald-100/65">{nextSchedule?.name || "Add a schedule"}</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3.5"><p className="text-[0.65rem] font-bold uppercase tracking-wide text-emerald-100/55">Farm health</p><p className="mt-2 text-sm font-extrabold">{stats.averageHealth}%</p><p className="mt-1 text-xs text-emerald-100/65">Across active crops</p></div><div className="col-span-2 rounded-2xl border border-emerald-300/15 bg-emerald-300/10 p-3.5 sm:col-span-1"><p className="text-[0.65rem] font-bold uppercase tracking-wide text-emerald-100/55">Water saved</p><p className="mt-2 text-sm font-extrabold text-emerald-200">{formatNumber(analytics?.kpis?.waterSavedLitres)} L</p><p className="mt-1 text-xs text-emerald-100/65">{analytics?.kpis?.waterSavingsPercent}% vs. last season</p></div></div>
        </div>
      </section>
      {notice ? <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm font-semibold text-emerald-800 dark:text-emerald-200"><CheckCircle2 className="mr-2 inline" size={16} />{notice}</div> : null}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Droplets} label="Average moisture" value={String(averageMoisture) + "%"} change={{ label: "Within target", tone: "success" }} detail="Updated from 8 sensors" tone="blue" />
        <MetricCard icon={Sprout} label="Active crops" value={stats.cropCount} change={{ label: String(stats.healthyCropCount) + " healthy", tone: "success" }} detail={String(activeFarm?.cultivatedAcres || 0) + " cultivated acres"} tone="green" />
        <MetricCard icon={AlertTriangle} label="Open alerts" value={stats.openAlertCount.toString().padStart(2, "0")} change={{ label: stats.highAlertCount ? String(stats.highAlertCount) + " need action" : "All clear", tone: stats.highAlertCount ? "warning" : "success" }} detail="Across soil, weather & tasks" tone="amber" />
        <MetricCard icon={TrendingUp} label="Yield forecast" value={formatNumber(analytics?.kpis?.forecastYieldTonnes) + " t"} change={{ label: "+" + String(analytics?.kpis?.yieldVsLastSeasonPercent) + "% season-on-season", tone: "success" }} detail="Latest model estimate" tone="coral" />
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.55fr_0.95fr]">
        <div className="card min-w-0 p-5 sm:p-6"><SectionHeader title="Soil moisture trend" subtitle="North, East and West fields · last 7 days" action={<Link href="/soil" className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">Soil details</Link>} /><div className="h-64 sm:h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.soilTrends} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}><defs><linearGradient id="moistureGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#20a36b" stopOpacity={0.32} /><stop offset="100%" stopColor="#20a36b" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="4 4" /><XAxis dataKey="date" tickFormatter={(value) => formatDate(value)} axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} /><YAxis domain={[20, 60]} tickFormatter={(value) => String(value) + "%"} axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} /><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="moisture" stroke="#15966a" strokeWidth={3} fill="url(#moistureGradient)" /></AreaChart></ResponsiveContainer></div><div className="mt-1 flex flex-wrap gap-4 text-xs font-semibold muted"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-600" />Current average 44%</span><span>Target range 38–48%</span><span>pH stable at 6.7</span></div></div>
        <div className="card overflow-hidden"><div className="border-b border-[var(--line)] p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow"><CloudSun size={14} /> Live conditions</p><h2 className="mt-2 section-title">{weather?.location || "Field weather"}</h2></div><StatusChip tone="info">Updated 4m ago</StatusChip></div><div className="mt-5 flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-400/15 text-amber-600"><WeatherIcon icon={current?.icon} size={29} /></span><div><p className="text-3xl font-extrabold tracking-tight">{current?.temperature || "—"}°</p><p className="mt-0.5 text-sm muted">{current?.condition || "Awaiting sensor data"}</p></div></div><div className="mt-5 grid grid-cols-3 border-t border-[var(--line)] pt-4 text-center"><div><p className="text-sm font-extrabold">{current?.humidity || "—"}%</p><p className="mt-1 text-[0.66rem] uppercase tracking-wide muted">Humidity</p></div><div className="border-x border-[var(--line)]"><p className="text-sm font-extrabold">{current?.rainfallChance || "—"}%</p><p className="mt-1 text-[0.66rem] uppercase tracking-wide muted">Rain chance</p></div><div><p className="text-sm font-extrabold">{current?.windKph || "—"} km/h</p><p className="mt-1 text-[0.66rem] uppercase tracking-wide muted">Wind</p></div></div></div><div className="p-4"><p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] muted">Next 4 days</p><div className="grid grid-cols-4 gap-1.5">{weather?.forecast?.slice(1).map((day) => <div key={day.date} className="rounded-xl bg-[var(--surface-soft)] p-2 text-center"><p className="text-[0.65rem] font-bold muted">{day.label}</p><span className="my-2 inline-grid text-sky-600"><WeatherIcon icon={day.icon} size={17} /></span><p className="text-xs font-extrabold">{day.high}°</p><p className="mt-1 text-[0.6rem] text-sky-600">{day.precipitationChance}%</p></div>)}</div><Link href="/weather" className="mt-4 flex items-center justify-center gap-1 text-sm font-extrabold text-emerald-700 dark:text-emerald-300">Open weather center <ArrowRight size={14} /></Link></div></div>
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.9fr_0.9fr]">
        <div className="card p-5 sm:p-6"><SectionHeader title="Crop pulse" subtitle="Health and harvest outlook" action={<Link href="/crops" className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">All crops</Link>} /><div className="space-y-4">{activeCrops.slice(0, 3).map((crop) => <div key={crop.id}><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-extrabold">{crop.name} <span className="font-medium muted">· {crop.field}</span></p><p className="mt-1 text-xs muted">{crop.growthStage} · harvest {formatDate(crop.expectedHarvest)}</p></div><StatusChip tone={toneForCrop(crop.status)}>{crop.healthScore}%</StatusChip></div><div className="mt-2"><ProgressBar value={crop.healthScore} color={crop.color} /></div></div>)}</div></div>
        <div className="card p-5 sm:p-6"><SectionHeader title="Today’s plan" subtitle={String(stats.pendingTaskCount) + " open task" + (stats.pendingTaskCount === 1 ? "" : "s")} action={<Link href="/tasks" className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">View plan</Link>} /><div className="space-y-3">{pendingTasks.length ? pendingTasks.map((task) => <div className="flex gap-3" key={task.id}><span className={task.priority === "high" ? "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" : task.priority === "medium" ? "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" : "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-sky-500"} /><div className="min-w-0"><p className="text-sm font-bold">{task.title}</p><p className="mt-1 text-xs muted">{relativeDue(task.dueAt)} · {task.assignedTo}</p></div></div>) : <p className="text-sm muted">Your task list is clear.</p>}</div></div>
        <div className="card p-5 sm:p-6"><SectionHeader title="Needs attention" subtitle="Prioritized alerts" action={<Link href="/tasks" className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">Resolve</Link>} /><div className="space-y-3">{openAlerts.slice(0, 3).map((alert) => <div className="rounded-xl bg-[var(--surface-soft)] p-3" key={alert.id}><div className="flex items-start justify-between gap-2"><p className="text-sm font-bold">{alert.title}</p><StatusChip tone={toneForSeverity(alert.severity)}>{alert.severity}</StatusChip></div><p className="mt-1.5 text-xs leading-5 muted">{alert.message}</p></div>)}{!openAlerts.length ? <p className="text-sm muted">No active alerts—great work.</p> : null}</div></div>
      </section>
    </div>
  );
}
