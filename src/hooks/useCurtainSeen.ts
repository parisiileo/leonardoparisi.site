"use client";

import { useSyncExternalStore } from "react";

const SESSION_KEY = "lp:curtain-shown";

/**
 * Has the opening curtain already played in this tab?
 *
 * Resolved once per page load and then frozen. Freezing matters: React re-reads
 * `getSnapshot` on every render to check for tearing, so a hook that asked
 * sessionStorage each time would flip to `true` the moment the flag is written
 * and tear the curtain down mid-animation.
 */
let seen: boolean | null = null;

function readAndClaim() {
  if (seen !== null) return seen;
  try {
    seen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Private-mode Safari and blocked storage: just play the curtain.
    seen = false;
  }
  return seen;
}

// Nothing ever changes after mount, so the subscription is a no-op; the hook is
// here purely for its hydration contract — `false` on the server and for the
// hydrating render, the real answer on the re-render straight after. Reading it
// during render instead would hydrate a tree the server never sent.
const subscribe = () => () => {};

export function useCurtainSeen() {
  return useSyncExternalStore(
    subscribe,
    readAndClaim,
    () => false,
  );
}
