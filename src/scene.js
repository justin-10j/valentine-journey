import * as THREE from "three";
import { createRenderer, createScene, createCamera, addLights, handleResize } from "./scene.js";
import { CHAPTERS } from "./dayData.js";
import { getActiveIndex, setOverrideIndex, clearOverride, nextUnlockTime } from "./unlock.js";
import { showCard, setCountdown } from "./ui.js";

import { createDay1 } from "./scenes/day1.js";
import { createDay2 } from "./scenes/day2.js";
import { createDay3 } from "./scenes/day3.js";
import { createDay4 } from "./scenes/day4.js";
import { createDay5 } from "./scenes/day5.js";
import { createDay6 } from "./scenes/day6.js";
import { createDay7 } from "./scenes/day7.js";
import { createValentines } from "./scenes/valentines.js";

const mount = document.getElementById("app");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");

// Dev controls
const devDay = document.getElementById("devDay");
const prevDay = document.getElementById("prevDay");
const nextDayBtn = document.getElementById("nextDay");
const clearBtn = document.getElementById("clearOverride");

// Create core
let renderer = createRenderer(mount);
let scene = createScene();
let camera = createCamera();
addLights(scene);
handleResize(camera, renderer);

// Which day?
let activeIndex = getActiveIndex();
devDay.textContent = `${activeIndex+1}/${CHAPTERS.length} (${CHAPTERS[activeIndex].title})`;

// Scenes factory
function buildActiveScene() {
  // wipe old scene objects
  while (scene.children.length) scene.remove(scene.children[0]);
  addLights(scene);

  const key = CHAPTERS[activeIndex].key;

  if (key === "day1") return createDay1(scene, camera);
  if (key === "day2") return createDay2(scene, camera);
  if (key === "day3") return createDay3(scene, camera);
  if (key === "day4") return createDay4(scene, camera);
  if (key === "day5") return createDay5(scene, camera);
  if (key === "day6") return createDay6(scene, camera);
  if (key === "day7") return createDay7(scene, camera);
  return createValentines(scene, camera, renderer);
}

let chapter = buildActiveScene();

// Start experience
startBtn.addEventListener("click", () => {
  overlay.style.display = "none";

  const c = CHAPTERS[activeIndex];
  showCard({
    title: c.title,
    text: c.message + "\n\n(Click Okay ❤️ to begin)"
  });

  chapter.start();
});

// Main loop
let last = performance.now();
function tick(now) {
  const dt = (now - last) / 1000;
  last = now;

  if (chapter?.update) chapter.update(dt);

  // Render if not Valentine scene doing its own render
  if (CHAPTERS[activeIndex].key !== "val") {
    renderer.render(scene, camera);
  }

  // Countdown when frozen (simple: show always)
  const unlockAt = nextUnlockTime(activeIndex);
  const diff = unlockAt - new Date();
  if (diff > 0) {
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    setCountdown(`Next chapter unlocks in ${h}h ${m}m ${String(s).padStart(2,"0")}s`);
  } else {
    setCountdown("Next chapter unlocked ❤️ (refresh to continue)");
  }

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// Dev testing buttons
prevDay.addEventListener("click", () => {
  activeIndex = Math.max(0, activeIndex - 1);
  setOverrideIndex(activeIndex);
  location.reload();
});
nextDayBtn.addEventListener("click", () => {
  activeIndex = Math.min(CHAPTERS.length - 1, activeIndex + 1);
  setOverrideIndex(activeIndex);
  location.reload();
});
clearBtn.addEventListener("click", () => {
  clearOverride();
  location.reload();
});
