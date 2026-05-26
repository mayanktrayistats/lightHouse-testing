// Configuration utility for performance settings
// Syncs with localStorage and URL parameters to survive page reloads (critical for Lighthouse audits)

export const DEFAULT_SETTINGS = {
  cssFonts: false, // FCP
  lcp: false,      // LCP
  tbt: false,      // TBT
  si: false,       // Speed Index
  cls: false       // CLS
};

// Helper to check settings synchronously (safe for module evaluation)
export function getSettings() {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  const params = new URLSearchParams(window.location.search);
  
  // If master 'optimized' query param is set, override all
  const optParam = params.get("optimized");
  if (optParam !== null) {
    const val = optParam === "true";
    return { cssFonts: val, lcp: val, tbt: val, si: val, cls: val };
  }

  // If master 'optimized' is in localStorage, override all
  const optStored = localStorage.getItem("nexus_optimized");
  if (optStored !== null) {
    const val = optStored === "true";
    return { cssFonts: val, lcp: val, tbt: val, si: val, cls: val };
  }

  // Try granular settings from localStorage
  const stored = localStorage.getItem("nexus_settings");
  let current = stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : { ...DEFAULT_SETTINGS };

  // Allow individual query parameters to override (e.g. ?tbt=true)
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (params.has(key)) {
      current[key] = params.get(key) === "true";
    }
  }

  return current;
}

export function saveSettings(settings) {
  if (typeof window === "undefined") return;

  localStorage.setItem("nexus_settings", JSON.stringify(settings));

  // Determine if all are true (optimized) or false (unoptimized) to update master state
  const allOptimized = Object.values(settings).every(v => v === true);
  const allUnoptimized = Object.values(settings).every(v => v === false);

  if (allOptimized) {
    localStorage.setItem("nexus_optimized", "true");
  } else if (allUnoptimized) {
    localStorage.setItem("nexus_optimized", "false");
  } else {
    localStorage.removeItem("nexus_optimized");
  }

  // Sync settings to URL parameters
  const url = new URL(window.location.href);
  
  // Clean up existing params
  url.searchParams.delete("optimized");
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    url.searchParams.delete(key);
  }

  if (allOptimized) {
    url.searchParams.set("optimized", "true");
  } else if (allUnoptimized) {
    url.searchParams.set("optimized", "false");
  } else {
    // Save granular parameters
    for (const [key, value] of Object.entries(settings)) {
      if (value) {
        url.searchParams.set(key, "true");
      }
    }
  }

  window.history.replaceState({}, "", url.toString());
}
