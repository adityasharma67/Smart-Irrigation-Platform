"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Leaf, LockKeyhole, Mail, Moon, ShieldCheck, Sun } from "lucide-react";
import { Button, IconButton } from "@/components/ui/Ui";
import { useAuth, useTheme } from "@/components/providers/AppProviders";

const benefitItems = [
  "See your field status at a glance",
  "Turn data into an easy daily plan",
  "Keep every farm decision in one place",
];

function AuthFrame({ children, eyebrow, title, copy }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <main className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-[#0d3927] p-10 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(150,244,184,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(150,244,184,.08)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="relative flex items-center gap-2.5 font-extrabold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-300 text-[#0d3927]"><Leaf size={19} /></span>Smart Farming Hub</div>
        <div className="relative my-auto max-w-md"><span className="eyebrow text-emerald-200"><Leaf size={14} /> Farm intelligence, made human</span><h1 className="display mt-5 text-5xl font-extrabold">{title}</h1><p className="mt-5 text-base leading-7 text-emerald-50/72">{copy}</p><div className="mt-9 space-y-4">{benefitItems.map((item) => <p key={item} className="flex items-center gap-3 text-sm font-semibold text-emerald-50/85"><CheckCircle2 size={18} className="shrink-0 text-emerald-300" />{item}</p>)}</div></div>
        <p className="relative text-xs text-emerald-100/55">Your farm data stays organized, visible, and in your control.</p>
      </section>
      <section className="relative flex min-h-screen items-center justify-center px-5 py-8 sm:p-10">
        <div className="absolute right-5 top-5 flex items-center gap-2"><Link href="/" className="btn btn-ghost !min-h-10 !px-3 text-sm"><ArrowLeft size={16} /> <span className="hidden sm:inline">Back home</span></Link><IconButton label="Toggle colour theme" onClick={toggleTheme}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</IconButton></div>
        <div className="w-full max-w-md fade-enter">
          <Link href="/" className="mb-12 inline-flex items-center gap-2 font-extrabold tracking-tight lg:hidden"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-[#0b5d3b] text-white"><Leaf size={19} /></span>Smart Farming Hub</Link>
          <p className="eyebrow">{eyebrow}</p>
          {children}
        </div>
      </section>
    </main>
  );
}

function Field({ label, error, ...props }) {
  return <label className="block"><span className="field-label">{label}</span><input className="field-input" {...props} />{error ? <span className="mt-1.5 block text-xs font-semibold text-rose-600">{error}</span> : null}</label>;
}

export function LoginPanel() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "farhan@greenvalley.farm", password: "farmdemo" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (form.password.length < 6) nextErrors.password = "Use at least 6 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    setServerError("");
    try {
      await signIn(form);
      router.push("/dashboard");
    } catch (error) {
      setServerError(error?.message || "We could not sign you in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFrame eyebrow="Welcome back" title="Your farm, in focus." copy="Sign in to see your latest field signals, plans, and opportunities.">
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Welcome back</h2><p className="mt-2 text-sm muted">Use the prefilled demo account or your own workspace.</p>
      <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
        <Field label="Email address" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <Field label="Password" type="password" autoComplete="current-password" value={form.password} error={errors.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <div className="flex items-center justify-between gap-3"><label className="flex cursor-pointer items-center gap-2 text-sm muted"><input type="checkbox" defaultChecked className="accent-emerald-600" />Keep me signed in</label><Link href="/forgot-password" className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Forgot password?</Link></div>
        {serverError ? <p className="rounded-xl bg-rose-500/10 px-3 py-2.5 text-sm font-semibold text-rose-700 dark:text-rose-300">{serverError}</p> : null}
        <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Signing you in…" : <>Sign in <ArrowRight size={16} /></>}</Button>
      </form>
      <p className="mt-7 text-center text-sm muted">New to Smart Farming Hub? <Link href="/signup" className="font-extrabold text-emerald-700 dark:text-emerald-300">Create a free account</Link></p>
      <div className="mt-8 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-3.5 text-xs leading-5 text-[var(--muted)]"><span className="font-extrabold text-emerald-700 dark:text-emerald-300">Demo tip:</span> any valid email and a 6+ character password will open a safe demo workspace.</div>
    </AuthFrame>
  );
}

export function SignupPanel() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", farmName: "", password: "", role: "farmer" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const ready = useMemo(() => form.name.trim() && form.farmName.trim() && /^\S+@\S+\.\S+$/.test(form.email) && form.password.length >= 6, [form]);
  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (form.farmName.trim().length < 2) nextErrors.farmName = "Add your farm or team name.";
    if (form.password.length < 6) nextErrors.password = "Use at least 6 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    setServerError("");
    try {
      await signUp(form);
      router.push("/dashboard");
    } catch (error) {
      setServerError(error?.message || "We could not create the workspace. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <AuthFrame eyebrow="Create your workspace" title="Grow your best season yet." copy="Set up a living, shared view of the farm in just a few thoughtful steps.">
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Start for free</h2><p className="mt-2 text-sm muted">Create a workspace that is ready to become your farm’s daily rhythm.</p>
      <form className="mt-7 grid gap-4 sm:grid-cols-2" onSubmit={submit} noValidate>
        <div className="sm:col-span-2"><Field label="Your name" autoComplete="name" value={form.name} error={errors.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
        <div className="sm:col-span-2"><Field label="Email address" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
        <div className="sm:col-span-2"><Field label="Farm or team name" value={form.farmName} error={errors.farmName} onChange={(event) => setForm({ ...form, farmName: event.target.value })} /></div>
        <Field label="Password" type="password" autoComplete="new-password" value={form.password} error={errors.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <label className="block"><span className="field-label">Your role</span><select className="field-select" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="farmer">Farmer / owner</option><option value="manager">Farm manager</option><option value="admin">Platform administrator</option></select></label>
        {serverError ? <p className="sm:col-span-2 rounded-xl bg-rose-500/10 px-3 py-2.5 text-sm font-semibold text-rose-700 dark:text-rose-300">{serverError}</p> : null}
        <div className="sm:col-span-2"><Button type="submit" className="w-full" disabled={!ready || submitting}>{submitting ? "Creating workspace…" : <>Create workspace <ArrowRight size={16} /></>}</Button></div>
      </form>
      <p className="mt-6 text-center text-sm muted">Already have an account? <Link href="/login" className="font-extrabold text-emerald-700 dark:text-emerald-300">Sign in</Link></p>
    </AuthFrame>
  );
}

export function ForgotPasswordPanel() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter the email address connected to your workspace.");
      return;
    }
    setError("");
    setSent(true);
  };
  return (
    <AuthFrame eyebrow="Reset access" title="We’ll help you find your way back." copy="A secure reset link will be sent to your inbox.">
      <span className="mt-4 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"><LockKeyhole size={22} /></span>
      <h2 className="mt-5 text-3xl font-extrabold tracking-tight">{sent ? "Check your inbox" : "Forgot your password?"}</h2>
      {sent ? <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-4 text-sm leading-6 text-[var(--muted)]"><p className="flex items-center gap-2 font-extrabold text-emerald-700 dark:text-emerald-300"><CheckCircle2 size={17} /> Reset instructions sent</p><p className="mt-2">If an account exists for <strong className="text-[var(--ink)]">{email}</strong>, a reset link is on its way. In a production connection, this screen calls the password-reset API.</p></div> : <><p className="mt-2 text-sm leading-6 muted">Enter your email and we’ll send a link to reset your password.</p><form className="mt-7 space-y-5" onSubmit={submit} noValidate><Field label="Email address" type="email" autoComplete="email" value={email} error={error} onChange={(event) => setEmail(event.target.value)} /><Button type="submit" className="w-full"><Mail size={16} /> Send reset link</Button></form></>}
      <p className="mt-7 text-center text-sm muted"><Link href="/login" className="inline-flex items-center gap-1 font-extrabold text-emerald-700 dark:text-emerald-300"><ArrowLeft size={14} /> Back to sign in</Link></p>
      <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs muted"><ShieldCheck size={14} className="text-emerald-600" /> Your account is protected with secure access controls.</p>
    </AuthFrame>
  );
}
