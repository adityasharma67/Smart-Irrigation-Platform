"use client";

import { DashboardView } from "./DashboardView";
import { CropsView, IrrigationView, SoilView, TasksView, WeatherView } from "./OperationsViews";
import { AdminView, AnalyticsView, ExpensesView, ReportsView, SettingsView } from "./InsightsViews";

export function PortalView({ section, notice, onWater }) {
  if (section === "crops") return <CropsView />;
  if (section === "soil") return <SoilView />;
  if (section === "weather") return <WeatherView />;
  if (section === "irrigation") return <IrrigationView onWater={onWater} />;
  if (section === "tasks") return <TasksView />;
  if (section === "analytics") return <AnalyticsView />;
  if (section === "expenses") return <ExpensesView />;
  if (section === "reports") return <ReportsView />;
  if (section === "settings") return <SettingsView />;
  if (section === "admin") return <AdminView />;
  return <DashboardView onWater={onWater} notice={notice} />;
}
