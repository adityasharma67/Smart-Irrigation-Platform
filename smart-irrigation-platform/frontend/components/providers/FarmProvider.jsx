"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CROP_GROWTH_STAGES,
  DEMO_DATA_VERSION,
  EXPENSE_CATEGORIES,
  FARM_ROLES,
  cloneDemoData,
  createDemoFarmData,
} from "../../lib/demo-data";

export const FARM_DATA_STORAGE_KEY = "smart-farming-hub:farm-data";

const FarmContext = createContext(null);

const EMPTY_DATA = {
  version: DEMO_DATA_VERSION,
  activeFarmId: null,
  profile: null,
  farms: [],
  crops: [],
  soilReadings: [],
  soilTrends: [],
  weather: null,
  irrigationSchedules: [],
  irrigationEvents: [],
  tasks: [],
  alerts: [],
  expenses: [],
  analytics: null,
  activity: [],
};

const dateOnly = () => new Date().toISOString().slice(0, 10);
const nowIso = () => new Date().toISOString();

const nextIso = (days = 1, hour = 6, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const makeId = (prefix) => {
  const randomPart =
    typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);
  return prefix + "-" + randomPart;
};

const numberOr = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const cleanText = (value, fallback = "") => {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
};

const persist = (value) => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(FARM_DATA_STORAGE_KEY, JSON.stringify(value));
    }
  } catch {
    // Private browsing or a full storage area should not break the dashboard.
  }
};

const getPersistedData = () => {
  try {
    if (typeof window === "undefined") return null;
    const rawValue = window.localStorage.getItem(FARM_DATA_STORAGE_KEY);
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue);
    if (!parsed || parsed.version !== DEMO_DATA_VERSION) return null;

    return parsed;
  } catch {
    return null;
  }
};

const normalizeData = (value) => {
  const defaults = createDemoFarmData();
  if (!value || typeof value !== "object") return defaults;

  return {
    ...defaults,
    ...value,
    profile: { ...defaults.profile, ...(value.profile || {}) },
    farms: Array.isArray(value.farms) ? value.farms : defaults.farms,
    crops: Array.isArray(value.crops) ? value.crops : defaults.crops,
    soilReadings: Array.isArray(value.soilReadings)
      ? value.soilReadings
      : defaults.soilReadings,
    soilTrends: Array.isArray(value.soilTrends) ? value.soilTrends : defaults.soilTrends,
    irrigationSchedules: Array.isArray(value.irrigationSchedules)
      ? value.irrigationSchedules
      : defaults.irrigationSchedules,
    irrigationEvents: Array.isArray(value.irrigationEvents)
      ? value.irrigationEvents
      : defaults.irrigationEvents,
    tasks: Array.isArray(value.tasks) ? value.tasks : defaults.tasks,
    alerts: Array.isArray(value.alerts) ? value.alerts : defaults.alerts,
    expenses: Array.isArray(value.expenses) ? value.expenses : defaults.expenses,
    activity: Array.isArray(value.activity) ? value.activity : defaults.activity,
    analytics: { ...defaults.analytics, ...(value.analytics || {}) },
  };
};

function getFarmForState(state, requestedFarmId) {
  return (
    requestedFarmId ||
    state.activeFarmId ||
    state.farms[0]?.id ||
    "farm-green-valley"
  );
}

function calculateStats(data, activeFarmId) {
  const farmCrops = data.crops.filter((crop) => crop.farmId === activeFarmId);
  const farmSchedules = data.irrigationSchedules.filter(
    (schedule) => schedule.farmId === activeFarmId,
  );
  const farmTasks = data.tasks.filter((task) => task.farmId === activeFarmId);
  const farmAlerts = data.alerts.filter((alert) => alert.farmId === activeFarmId);
  const farmExpenses = data.expenses.filter(
    (expense) => expense.farmId === activeFarmId,
  );

  return {
    cropCount: farmCrops.length,
    healthyCropCount: farmCrops.filter((crop) => crop.status === "healthy").length,
    pendingTaskCount: farmTasks.filter((task) => task.status !== "completed").length,
    openAlertCount: farmAlerts.filter((alert) => !alert.resolved).length,
    highAlertCount: farmAlerts.filter(
      (alert) => !alert.resolved && ["high", "critical"].includes(alert.severity),
    ).length,
    automaticScheduleCount: farmSchedules.filter(
      (schedule) => schedule.enabled && schedule.mode === "auto",
    ).length,
    totalExpenses: farmExpenses.reduce(
      (total, expense) => total + numberOr(expense.amount, 0),
      0,
    ),
    averageHealth: farmCrops.length
      ? Math.round(
          farmCrops.reduce((total, crop) => total + numberOr(crop.healthScore, 0), 0) /
            farmCrops.length,
        )
      : 0,
  };
}

/**
 * Client-side demo state. The actions intentionally mirror the REST mutations
 * being added under /api/v1, so screen code can swap implementations later.
 */
export function FarmProvider({ children, initialData = null }) {
  const [data, setData] = useState(() =>
    initialData ? normalizeData(cloneDemoData(initialData)) : null,
  );
  const [isReady, setIsReady] = useState(Boolean(initialData));

  useEffect(() => {
    // Read after hydration so a saved browser snapshot does not cause SSR markup
    // mismatches in a Next.js host.
    const saved = getPersistedData();
    setData(normalizeData(saved || initialData || createDemoFarmData()));
    setIsReady(true);
    // initialData is intended as one-time server/bootstrap data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isReady && data) persist(data);
  }, [data, isReady]);

  const commit = useCallback((updater) => {
    setData((current) => {
      const safeCurrent = current || createDemoFarmData();
      const updated = updater(safeCurrent);
      return {
        ...updated,
        version: DEMO_DATA_VERSION,
        lastUpdated: nowIso(),
      };
    });
  }, []);

  const setActiveFarm = useCallback(
    (farmId) => {
      commit((state) => {
        if (!state.farms.some((farm) => farm.id === farmId)) return state;
        return { ...state, activeFarmId: farmId };
      });
    },
    [commit],
  );

  const addCrop = useCallback(
    (input = {}) => {
      const crop = {
        id: makeId("crop"),
        farmId: input.farmId || null,
        name: cleanText(input.name, "New crop"),
        variety: cleanText(input.variety, "Not specified"),
        field: cleanText(input.field, "Unassigned field"),
        zone: cleanText(input.zone, "Unassigned zone"),
        acreage: Math.max(0.1, numberOr(input.acreage, 1)),
        plantedOn: input.plantedOn || dateOnly(),
        expectedHarvest: input.expectedHarvest || dateOnly(),
        growthStage: CROP_GROWTH_STAGES.includes(input.growthStage)
          ? input.growthStage
          : "Germination",
        stageProgress: clamp(numberOr(input.stageProgress, 8), 0, 100),
        status: input.status || "healthy",
        healthScore: clamp(numberOr(input.healthScore, 84), 0, 100),
        moistureTarget: {
          min: clamp(numberOr(input.moistureTarget?.min, 32), 0, 100),
          max: clamp(numberOr(input.moistureTarget?.max, 46), 0, 100),
          unit: "%",
        },
        latestMoisture: clamp(numberOr(input.latestMoisture, 39), 0, 100),
        yieldForecastTonnes: Math.max(0, numberOr(input.yieldForecastTonnes, 0)),
        yieldChangePercent: numberOr(input.yieldChangePercent, 0),
        notes: cleanText(input.notes),
        color: input.color || "#22C55E",
        createdAt: nowIso(),
      };

      commit((state) => {
        const farmId = getFarmForState(state, crop.farmId);
        const cropWithFarm = { ...crop, farmId };
        return {
          ...state,
          crops: [cropWithFarm, ...state.crops],
          activity: [
            {
              id: makeId("activity"),
              type: "crop",
              title: cropWithFarm.name + " added to " + cropWithFarm.field,
              detail: "Growth stage: " + cropWithFarm.growthStage,
              occurredAt: nowIso(),
            },
            ...state.activity,
          ],
        };
      });

      return crop;
    },
    [commit],
  );

  const addTask = useCallback(
    (input = {}) => {
      const task = {
        id: makeId("task"),
        farmId: input.farmId || null,
        cropId: input.cropId || null,
        title: cleanText(input.title, "Untitled task"),
        description: cleanText(input.description),
        category: input.category || "Maintenance",
        priority: input.priority || "medium",
        dueAt: input.dueAt || nextIso(1, 9),
        status: input.status === "completed" ? "completed" : "pending",
        assignedTo: cleanText(input.assignedTo, "Aisha Patel"),
        createdAt: nowIso(),
        completedAt: input.status === "completed" ? nowIso() : null,
      };

      commit((state) => {
        const taskWithFarm = {
          ...task,
          farmId: getFarmForState(state, task.farmId),
        };
        return {
          ...state,
          tasks: [taskWithFarm, ...state.tasks],
          activity: [
            {
              id: makeId("activity"),
              type: "task",
              title: "Task added: " + taskWithFarm.title,
              detail: "Due " + new Date(taskWithFarm.dueAt).toLocaleDateString(),
              occurredAt: nowIso(),
            },
            ...state.activity,
          ],
        };
      });

      return task;
    },
    [commit],
  );

  const toggleTask = useCallback(
    (taskId) => {
      commit((state) => {
        const task = state.tasks.find((item) => item.id === taskId);
        if (!task) return state;

        const isComplete = task.status === "completed";
        const status = isComplete ? "pending" : "completed";
        const taskTitle = task.title;

        return {
          ...state,
          tasks: state.tasks.map((item) =>
            item.id === taskId
              ? {
                  ...item,
                  status,
                  completedAt: status === "completed" ? nowIso() : null,
                }
              : item,
          ),
          activity:
            status === "completed"
              ? [
                  {
                    id: makeId("activity"),
                    type: "task",
                    title: "Task completed: " + taskTitle,
                    detail: "Marked complete from the dashboard.",
                    occurredAt: nowIso(),
                  },
                  ...state.activity,
                ]
              : state.activity,
        };
      });
    },
    [commit],
  );

  const addExpense = useCallback(
    (input = {}) => {
      const expense = {
        id: makeId("expense"),
        farmId: input.farmId || null,
        cropId: input.cropId || null,
        category: EXPENSE_CATEGORIES.includes(input.category)
          ? input.category
          : "Other",
        vendor: cleanText(input.vendor, "Unspecified vendor"),
        amount: Math.max(0, numberOr(input.amount, 0)),
        currency: input.currency || "INR",
        incurredOn: input.incurredOn || dateOnly(),
        note: cleanText(input.note),
        createdAt: nowIso(),
      };

      commit((state) => {
        const expenseWithFarm = {
          ...expense,
          farmId: getFarmForState(state, expense.farmId),
        };
        const analytics =
          state.analytics && state.analytics.farmId === expenseWithFarm.farmId
            ? {
                ...state.analytics,
                kpis: {
                  ...state.analytics.kpis,
                  operatingExpense:
                    numberOr(state.analytics.kpis?.operatingExpense, 0) +
                    expenseWithFarm.amount,
                },
              }
            : state.analytics;

        return {
          ...state,
          expenses: [expenseWithFarm, ...state.expenses],
          analytics,
          activity: [
            {
              id: makeId("activity"),
              type: "expense",
              title: "Expense recorded: " + expenseWithFarm.category,
              detail:
                expenseWithFarm.currency +
                " " +
                expenseWithFarm.amount.toLocaleString("en-IN"),
              occurredAt: nowIso(),
            },
            ...state.activity,
          ],
        };
      });

      return expense;
    },
    [commit],
  );

  const toggleIrrigationMode = useCallback(
    (scheduleId) => {
      commit((state) => ({
        ...state,
        irrigationSchedules: state.irrigationSchedules.map((schedule) =>
          schedule.id === scheduleId
            ? { ...schedule, mode: schedule.mode === "auto" ? "manual" : "auto" }
            : schedule,
        ),
      }));
    },
    [commit],
  );

  const waterNow = useCallback(
    (scheduleId) => {
      const event = {
        id: makeId("irrigation-event"),
        scheduleId,
        action: "manual_run",
        startedAt: nowIso(),
        durationMinutes: 0,
        appliedLitres: 0,
        triggeredBy: "Dashboard user",
      };

      commit((state) => {
        const schedule = state.irrigationSchedules.find(
          (item) => item.id === scheduleId,
        );
        if (!schedule) return state;

        const appliedLitres = numberOr(schedule.estimatedLitres, 0);
        const completedEvent = {
          ...event,
          farmId: schedule.farmId,
          durationMinutes: numberOr(schedule.durationMinutes, 0),
          appliedLitres,
        };
        const updatedSchedules = state.irrigationSchedules.map((item) =>
          item.id === scheduleId
            ? {
                ...item,
                lastRun: completedEvent.startedAt,
                nextRun: nextIso(1, Number(item.startTime?.slice(0, 2)) || 6),
                todayAppliedLitres:
                  numberOr(item.todayAppliedLitres, 0) + appliedLitres,
              }
            : item,
        );
        const analytics =
          state.analytics && state.analytics.farmId === schedule.farmId
            ? {
                ...state.analytics,
                kpis: {
                  ...state.analytics.kpis,
                  waterUsedLitres:
                    numberOr(state.analytics.kpis?.waterUsedLitres, 0) +
                    appliedLitres,
                },
                waterSeries: (state.analytics.waterSeries || []).map(
                  (item, index, collection) =>
                    index === collection.length - 1
                      ? {
                          ...item,
                          used: numberOr(item.used, 0) + appliedLitres,
                        }
                      : item,
                ),
              }
            : state.analytics;

        return {
          ...state,
          irrigationSchedules: updatedSchedules,
          irrigationEvents: [completedEvent, ...state.irrigationEvents],
          alerts: state.alerts.map((alert) =>
            alert.cropId === schedule.cropId &&
            alert.type === "low_moisture" &&
            !alert.resolved
              ? {
                  ...alert,
                  resolved: true,
                  resolvedAt: completedEvent.startedAt,
                  resolution: "Irrigation manually started from dashboard.",
                }
              : alert,
          ),
          analytics,
          activity: [
            {
              id: makeId("activity"),
              type: "irrigation",
              title: schedule.name + " started manually",
              detail:
                appliedLitres.toLocaleString("en-IN") +
                " L scheduled for " +
                schedule.durationMinutes +
                " minutes.",
              occurredAt: completedEvent.startedAt,
            },
            ...state.activity,
          ],
        };
      });

      return event;
    },
    [commit],
  );

  const updateSchedule = useCallback(
    (scheduleId, changes = {}) => {
      commit((state) => ({
        ...state,
        irrigationSchedules: state.irrigationSchedules.map((schedule) =>
          schedule.id === scheduleId
            ? {
                ...schedule,
                ...changes,
                id: schedule.id,
                farmId: schedule.farmId,
                cropId: changes.cropId ?? schedule.cropId,
                durationMinutes: Math.max(
                  1,
                  numberOr(changes.durationMinutes, schedule.durationMinutes),
                ),
                threshold: clamp(
                  numberOr(changes.threshold, schedule.threshold),
                  0,
                  100,
                ),
                targetMoisture: clamp(
                  numberOr(changes.targetMoisture, schedule.targetMoisture),
                  0,
                  100,
                ),
                days: Array.isArray(changes.days) ? changes.days : schedule.days,
              }
            : schedule,
        ),
      }));
    },
    [commit],
  );

  const resolveAlert = useCallback(
    (alertId, resolution = "Resolved from dashboard") => {
      commit((state) => ({
        ...state,
        alerts: state.alerts.map((alert) =>
          alert.id === alertId
            ? {
                ...alert,
                resolved: true,
                resolvedAt: nowIso(),
                resolution,
              }
            : alert,
        ),
      }));
    },
    [commit],
  );

  const updateFarm = useCallback(
    (changesOrFarmId = {}, optionalChanges = {}) => {
      const isIdFirst = typeof changesOrFarmId === "string";
      const requestedFarmId = isIdFirst ? changesOrFarmId : optionalChanges.farmId;
      const changes = isIdFirst ? optionalChanges : changesOrFarmId;

      commit((state) => {
        const farmId = getFarmForState(state, requestedFarmId);
        return {
          ...state,
          farms: state.farms.map((farm) =>
            farm.id === farmId
              ? {
                  ...farm,
                  ...changes,
                  id: farm.id,
                  ownerId: farm.ownerId,
                  location: {
                    ...farm.location,
                    ...(changes.location || {}),
                    coordinates: {
                      ...farm.location?.coordinates,
                      ...(changes.location?.coordinates || {}),
                    },
                  },
                  updatedAt: nowIso(),
                }
              : farm,
          ),
        };
      });
    },
    [commit],
  );

  const setDemoRole = useCallback(
    (role) => {
      const nextRole = String(role || "").toLowerCase();
      if (!FARM_ROLES.includes(nextRole)) return false;

      commit((state) => ({
        ...state,
        profile: { ...state.profile, role: nextRole },
      }));
      return true;
    },
    [commit],
  );

  const resetDemoData = useCallback(() => {
    const fresh = createDemoFarmData();
    setData(fresh);
    setIsReady(true);
    return fresh;
  }, []);

  const activeFarm = useMemo(
    () => data?.farms?.find((farm) => farm.id === data.activeFarmId) || null,
    [data],
  );

  const scopedData = useMemo(() => {
    const state = data || EMPTY_DATA;
    const activeFarmId = state.activeFarmId;
    return {
      activeCrops: state.crops.filter((crop) => crop.farmId === activeFarmId),
      activeSoilReadings: state.soilReadings.filter(
        (reading) => reading.farmId === activeFarmId,
      ),
      activeSchedules: state.irrigationSchedules.filter(
        (schedule) => schedule.farmId === activeFarmId,
      ),
      activeTasks: state.tasks.filter((task) => task.farmId === activeFarmId),
      activeAlerts: state.alerts.filter((alert) => alert.farmId === activeFarmId),
      activeExpenses: state.expenses.filter(
        (expense) => expense.farmId === activeFarmId,
      ),
      stats: calculateStats(state, activeFarmId),
    };
  }, [data]);

  const actions = useMemo(
    () => ({
      addCrop,
      addTask,
      toggleTask,
      addExpense,
      toggleIrrigationMode,
      waterNow,
      updateSchedule,
      resolveAlert,
      updateFarm,
      setDemoRole,
      setActiveFarm,
      resetDemoData,
    }),
    [
      addCrop,
      addExpense,
      addTask,
      resetDemoData,
      resolveAlert,
      setActiveFarm,
      setDemoRole,
      toggleIrrigationMode,
      toggleTask,
      updateFarm,
      updateSchedule,
      waterNow,
    ],
  );

  const value = useMemo(
    () => ({
      // Required integration contract: consumers can always check isReady
      // before rendering dense dashboard content.
      data: data || EMPTY_DATA,
      isReady,
      actions,
      activeFarm,
      ...scopedData,
    }),
    [actions, activeFarm, data, isReady, scopedData],
  );

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

export function useFarm() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error("useFarm must be used within a FarmProvider.");
  }
  return context;
}

