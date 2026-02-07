import { CHAPTERS } from "./dayData.js";

const OVERRIDE_KEY = "vj_override_day_index";

export function getOverrideIndex() {
  const v = localStorage.getItem(OVERRIDE_KEY);
  return v === null ? null : Number(v);
}
export function setOverrideIndex(i) {
  localStorage.setItem(OVERRIDE_KEY, String(i));
}
export function clearOverride() {
  localStorage.removeItem(OVERRIDE_KEY);
}

export function getActiveIndexByDate(now = new Date()) {
  const d = now.getDate(); // you asked Feb 7–14 concept; we use day-of-month
  // Choose latest unlocked chapter
  let idx = 0;
  for (let i = 0; i < CHAPTERS.length; i++) {
    if (d >= CHAPTERS[i].day) idx = i;
  }
  return idx;
}

export function getActiveIndex() {
  const o = getOverrideIndex();
  if (o !== null && Number.isFinite(o)) return Math.max(0, Math.min(CHAPTERS.length - 1, o));
  return getActiveIndexByDate();
}

export function nextUnlockTime(activeIndex) {
  // next day at 00:00 local time
  const active = CHAPTERS[activeIndex];
  const next = CHAPTERS[Math.min(CHAPTERS.length - 1, activeIndex + 1)];
  const now = new Date();
  const t = new Date(now);
  // set to next.chapter.day at 00:00 (same month). This is simple & works for your Valentine window.
  t.setHours(0,0,0,0);
  t.setDate(next.day);
  return t;
}
