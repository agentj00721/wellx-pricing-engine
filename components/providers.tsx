"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { Device, Mode, Theme } from "@/lib/types";

type ModeCtx = {
  mode: Mode;
  setMode: (m: Mode) => void;
};
type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};
type DeviceCtx = {
  device: Device;
};

const ModeContext = createContext<ModeCtx | null>(null);
const ThemeContext = createContext<ThemeCtx | null>(null);
const DeviceContext = createContext<DeviceCtx | null>(null);

const STORAGE_MODE = "wx.mode";
const STORAGE_THEME = "wx.theme";

/* ──────────────────────────────────────────────
   Persisted store — backed by localStorage and
   shared across tabs via storage events. Read
   via useSyncExternalStore so React handles the
   SSR → CSR boundary cleanly.
   ────────────────────────────────────────────── */

type StoredKey = typeof STORAGE_MODE | typeof STORAGE_THEME;

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", cb);
  window.addEventListener("wx-store", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("wx-store", cb);
  };
}

function readStored<T extends string>(
  key: StoredKey,
  guard: (v: string | null) => v is T,
  fallback: T,
): T {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  return guard(v) ? v : fallback;
}

function writeStored(key: StoredKey, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
  window.dispatchEvent(new Event("wx-store"));
}

const isTheme = (v: string | null): v is Theme =>
  v === "light" || v === "dark";
const isMode = (v: string | null): v is Mode =>
  v === "customer" || v === "team" || v === "founders";

function usePersistedTheme(): Theme {
  return useSyncExternalStore(
    subscribe,
    () => readStored<Theme>(STORAGE_THEME, isTheme, defaultTheme()),
    () => "dark" as Theme,
  );
}

function usePersistedMode(): Mode {
  return useSyncExternalStore(
    subscribe,
    () => readStored<Mode>(STORAGE_MODE, isMode, "customer"),
    () => "customer" as Mode,
  );
}

function defaultTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

/* ──────────────────────────────────────────────
   Device store — backed by window.innerWidth,
   subscribed via resize.
   ────────────────────────────────────────────── */

function resolveDevice(width: number): Device {
  if (width < 768) return "phone";
  if (width < 1280) return "tablet";
  return "desktop";
}

function deviceSubscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  let frame = 0;
  const handler = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(cb);
  };
  window.addEventListener("resize", handler);
  return () => {
    window.removeEventListener("resize", handler);
    cancelAnimationFrame(frame);
  };
}

function useDeviceStore(): Device {
  return useSyncExternalStore(
    deviceSubscribe,
    () => resolveDevice(window.innerWidth),
    () => "desktop" as Device,
  );
}

/* ──────────────────────────────────────────────
   Provider
   ────────────────────────────────────────────── */

export function AppProviders({ children }: { children: React.ReactNode }) {
  const theme = usePersistedTheme();
  const mode = usePersistedMode();
  const device = useDeviceStore();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback((t: Theme) => writeStored(STORAGE_THEME, t), []);
  const toggle = useCallback(
    () => writeStored(STORAGE_THEME, theme === "dark" ? "light" : "dark"),
    [theme],
  );
  const setMode = useCallback((m: Mode) => writeStored(STORAGE_MODE, m), []);

  const themeValue = useMemo(
    () => ({ theme, setTheme, toggle }),
    [theme, setTheme, toggle],
  );
  const modeValue = useMemo(() => ({ mode, setMode }), [mode, setMode]);
  const deviceValue = useMemo(() => ({ device }), [device]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <ModeContext.Provider value={modeValue}>
        <DeviceContext.Provider value={deviceValue}>
          {children}
        </DeviceContext.Provider>
      </ModeContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be inside AppProviders");
  return ctx;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside AppProviders");
  return ctx;
}

export function useDevice() {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDevice must be inside AppProviders");
  return ctx;
}
