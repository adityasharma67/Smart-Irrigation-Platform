"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FARM_ROLES } from "../../lib/demo-data";

export const AUTH_STORAGE_KEY = "smart-farming-hub:auth-session";

const AuthContext = createContext(null);

const isEmail = (value) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const makeToken = () => {
  const entropy =
    typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return "demo_" + entropy;
};

const initialsFor = (name) =>
  String(name || "Farmer")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const saveSession = (session) => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      // Preserve compatibility with the original CRA authentication UI while
      // screens migrate to this provider.
      window.localStorage.setItem("token", session.token);
      window.localStorage.setItem("user", JSON.stringify(session.user));
    }
  } catch {
    // Storage can be unavailable in privacy-sensitive browser contexts.
  }
};

const clearSession = () => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
    }
  } catch {
    // No recovery is required; in-memory session state still gets cleared.
  }
};

const readSession = () => {
  try {
    if (typeof window === "undefined") return null;
    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (rawSession) {
      const session = JSON.parse(rawSession);
      if (session?.token && session?.user) return session;
    }

    // Gracefully adopt the session shape used by the pre-existing React app.
    const token = window.localStorage.getItem("token");
    const rawUser = window.localStorage.getItem("user");
    if (token && rawUser) {
      return { token, user: JSON.parse(rawUser), issuedAt: new Date().toISOString() };
    }
  } catch {
    return null;
  }

  return null;
};

const normalizeRole = (value) => {
  const role = String(value || "farmer").toLowerCase();
  return FARM_ROLES.includes(role) ? role : "farmer";
};

const createUser = ({ name, email, role, phone }) => ({
  id: "demo-user-" + makeToken().slice(-12),
  name: name?.trim() || "Farm Manager",
  email: email.trim().toLowerCase(),
  role: normalizeRole(role),
  phone: phone?.trim() || "",
  avatar: initialsFor(name),
});

/**
 * A small client-side auth adapter for the demo. Its public functions have the
 * same signature a real API adapter would use, which keeps form components
 * independent from the eventual backend implementation.
 */
export function AuthProvider({ children, initialSession = null }) {
  const [session, setSession] = useState(initialSession || null);
  const [isReady, setIsReady] = useState(Boolean(initialSession));

  useEffect(() => {
    setSession(readSession() || initialSession || null);
    setIsReady(true);
    // initialSession is bootstrap data and is purposefully read once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applySession = useCallback((nextSession) => {
    setSession(nextSession);
    saveSession(nextSession);
    return nextSession;
  }, []);

  const signIn = useCallback(
    async ({ email, password, role = "farmer", name } = {}) => {
      if (!isEmail(email)) {
        throw new Error("Enter a valid email address.");
      }
      if (typeof password !== "string" || password.trim().length < 4) {
        throw new Error("Password must contain at least 4 characters.");
      }

      const localPart = email.trim().split("@")[0].replace(/[._-]+/g, " ");
      const displayName =
        name?.trim() ||
        localPart.replace(/\b\w/g, (letter) => letter.toUpperCase()) ||
        "Farm Manager";
      const nextSession = {
        token: makeToken(),
        user: createUser({
          name: displayName,
          email,
          role,
        }),
        issuedAt: new Date().toISOString(),
        mode: "demo",
      };

      return applySession(nextSession);
    },
    [applySession],
  );

  const signUp = useCallback(
    async (data = {}) => {
      const name = String(data.name || "").trim();
      const email = String(data.email || "").trim();
      const password = String(data.password || "");

      if (name.length < 2) {
        throw new Error("Enter your full name.");
      }
      if (!isEmail(email)) {
        throw new Error("Enter a valid email address.");
      }
      if (password.length < 6) {
        throw new Error("Choose a password with at least 6 characters.");
      }
      if (data.confirmPassword && data.confirmPassword !== password) {
        throw new Error("Passwords do not match.");
      }

      const nextSession = {
        token: makeToken(),
        user: createUser({
          name,
          email,
          phone: data.phone,
          role: data.role,
        }),
        issuedAt: new Date().toISOString(),
        mode: "demo",
      };

      return applySession(nextSession);
    },
    [applySession],
  );

  const signOut = useCallback(() => {
    setSession(null);
    clearSession();
  }, []);

  const updateUser = useCallback(
    (changes = {}) => {
      setSession((current) => {
        if (!current) return current;
        const user = {
          ...current.user,
          ...changes,
          email: changes.email
            ? String(changes.email).trim().toLowerCase()
            : current.user.email,
          role: normalizeRole(changes.role || current.user.role),
          avatar: changes.name ? initialsFor(changes.name) : current.user.avatar,
        };
        const nextSession = { ...current, user };
        saveSession(nextSession);
        return nextSession;
      });
    },
    [],
  );

  const hasRole = useCallback(
    (...roles) => {
      if (!session?.user?.role) return false;
      return roles.flat().includes(session.user.role);
    },
    [session?.user?.role],
  );

  const value = useMemo(
    () => ({
      user: session?.user || null,
      token: session?.token || null,
      session,
      isReady,
      isAuthenticated: Boolean(session?.token),
      signIn,
      signUp,
      signOut,
      updateUser,
      hasRole,
    }),
    [hasRole, isReady, session, signIn, signOut, signUp, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}

