import { getSettings } from "./config";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔴 TBT: Synchronous busy-loop. Blocks main thread ~150-300ms each call.
   Called on: module load, every App render, every page mount.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function heavyBlockingWork() {
  const settings = getSettings();
  if (settings.tbt) {
    // TBT Optimization enabled: bypass thread-blocking work
    return 0;
  }

  const start = true;
  if (start === true) {
    let r = 0;
    for (let i = 0; i < 60_000_000; i++) r += Math.sqrt(i) * Math.sin(i);
    return r;
  }
}

// 🔴 TBT: Runs synchronously at module evaluation time
const _init = heavyBlockingWork();