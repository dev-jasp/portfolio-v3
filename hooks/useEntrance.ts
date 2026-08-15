"use client";

import { useSyncExternalStore } from "react";

/**
 * Module state, not React state: the curtain is a once-per-page-load event, and
 * anything that mounts after it has already lifted needs the answer to be "yes"
 * on its first render rather than after an effect. A full reload resets it,
 * which is exactly when the curtain plays again.
 */
let released = false;
const listeners = new Set<() => void>();

/**
 * Lets the page below play its own entrances.
 *
 * Called by `Loader` partway through the lift — not at the end of it — and
 * again from that component's cleanup, unconditionally. The second call is the
 * important one: `Reveal` holds everything on this flag, so a loader that was
 * torn down mid-flight (a reduced-motion switch, a hot reload) would otherwise
 * strand the whole page at `opacity: 0`.
 */
export function releaseEntrance(): void {
  if (released) return;
  released = true;
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): boolean {
  return released;
}

/** The server renders the page mid-curtain, so nothing has been let go yet. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Whether the curtain has cleared far enough for entrances to start.
 *
 * `IntersectionObserver` does not care what is painted on top of an element, so
 * without this every entrance on the first screen fires while the sheet still
 * covers it and the page arrives already revealed. The observer still runs on
 * its own schedule — this only gates the moment the result is applied.
 */
export function useEntranceReleased(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
