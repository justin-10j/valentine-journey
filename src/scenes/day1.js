import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

/**
 * Day 1: cinematic ride → flower shop → rose gift → freeze
 * Uses real GLB if present, otherwise uses placeholders.
 */
export function createDay1(scene, camera) {
  const state = {
    started: false,
    phase: "idle",
    freeze: false
  };

  // Road
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 240),
    new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 1 })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.z = -80;
  scene.add(road);

  // Lane lines
  const lines = [];
  function addLine(z) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.15, 2.2),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.35 })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(0, 0.01, z);
    scene.add(m);
    lines.push(m);
  }
  for (let i = 0; i < 40; i++) addLine(-i * 4);

  // City blocks
  const city = new THREE.Group();
  scene.add(city);

  function rand(min, max){ return Math.random() * (max-min) + min; }

  for (let i=0;i<70;i++){
    const z = -rand(10, 170);
    const h = rand(3, 18);
    const mat = new THREE.MeshStandardMaterial({ color: 0x101a44, roughness: 1 });

    const b1 = new THREE.Mesh(new THREE.BoxGeometry(rand(2,4), h, rand(2,4)), mat);
    b1.position.set(rand(7, 12), h/2, z);
    city.add(b1);

    const b2 = new THREE.Mesh(new THREE.BoxGeometry(rand(2,4), h, rand(2,4)), mat);
    b2.position.set(-rand(7, 12), h/2, z);
    city.add(b2);

    // simple glowing window plane
    const w = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, h*0.5),
      new THREE.MeshStandardMaterial({ color: 0x222, emissive: 0xffc76a, emissiveIntensity: 0.6 })
    );
    w.position.set(b1.position.x-0.01, h*0.55, z);
    w.rotation.y = Math.PI/2;
    city.add(w);
  }

  // Flower shop
  const shop = new THREE.Group();
  scene.add(shop);

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(6, 2.8, 3.2),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a })
  );
  base.position.set(-8.5, 1.4, -52);
  shop.add(base);

  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x111, emissive: 0xff4d6d, emissiveIntensity: 0.85 })
  );
  sign.position.set(-8.5, 2.5, -50.3);
  shop.add(sign);

  // Scooter fallback
  const scooterFallback = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.6,0.45,2.4), new THREE.MeshStandardMaterial({ color: 0xff4d6d }));
  body.position.y = 0.55;
  scooterFallback.add(body);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.9,0.2,1.2), new THREE.MeshStandardMaterial({ color: 0x111111 }));
  seat.position.set(0,0.85,-0.1);
  scooterFallback.add(seat);

  function wheel(x,z){
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.28,0.25,20), new THREE.MeshStandardMaterial({ color: 0x0b0b0b }));
    w.rotation.z = Math.PI/2;
    w.position.set(x,0.28,z);
    scooterFallback.add(w);
    return w;
  }
  const wheels = [wheel(-0.6,0.85), wheel(0.6,0.85), wheel(-0.6,-0.85), wheel(0.6,-0.85)];
  scooterFallback.position.set(0,0,1.5);

  let scooter = scooterFallback;
  scene.add(scooterFallback);

  // Try real scooter GLB
  const loader = new GLTFLoader();
  loader.load(
    "/models/scooter.glb",
    (gltf) => {
      scene.remove(scooterFallback);
      scooter = gltf.scene;
      scooter.position.set(0,0,1.5);
      scooter.scale.set(1.3,1.3,1.3);
      scene.add(scooter);
    },
    undefined,
    () => {
      // keep fallback
    }
  );

  // Rose (GLB if exists, else simple)
  const roseGroup = new THREE.Group();
  roseGroup.visible = false;
  roseGroup.position.set(-8.1, 0.2, -50.6);
  scene.add(roseGroup);

  // fallback rose
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,1.1,10), new THREE.MeshStandardMaterial({ color: 0x2ecc71 }));
  stem.position.y = 0.55;
  roseGroup.add(stem);
  const bud = new THREE.Mesh(new THREE.SphereGeometry(0.22,20,20), new THREE.MeshStandardMaterial({ color: 0xff2d55, emissive: 0xff2d55, emissiveIntensity: 0.22 }));
  bud.position.y = 1.12;
  roseGroup.add(bud);

  loader.load(
    "/models/rose.glb",
    (gltf) => {
      roseGroup.clear();
      const m = gltf.scene;
      m.scale.set(0.6,0.6,0.6);
      roseGroup.add(m);
    },
    undefined,
    () => {}
  );

  // Timeline (cinematic)
  const tl = gsap.timeline({ paused: true });

  tl.to({}, { duration: 0.2 }); // tiny delay
  tl.to(camera.position, { x: 0.2, y: 3.1, z: 7.5, duration: 0.8, ease: "power1.out" }, 0);

  // Ride for 6 sec (illusion by moving environment)
  tl.to({}, { duration: 6, onUpdate: () => { state.phase = "ride"; }, ease:"none" }, 1);

  // Stop at shop: camera shifts towards shop
  tl.to(camera.position, { x: -2.6, y: 2.6, z: -2.0, duration: 1.4, ease:"power2.inOut" }, 7.2);
  tl.to({}, { duration: 0.2, onComplete: () => { state.phase = "gift"; } }, 8.8);

  // Rose appear
  tl.to(roseGroup, { duration: 0.01, onComplete: () => { roseGroup.visible = true; } }, 9.0);
  tl.fromTo(roseGroup.scale, { x:0,y:0,z:0 }, { x:1,y:1,z:1, duration: 1.1, ease:"back.out(1.8)" }, 9.05);

  // Freeze
  tl.to({}, { duration: 0.2, onComplete: () => { state.freeze = true; } }, 10.8);

  function start() {
    state.started = true;
    tl.play(0);
  }

  function update(dt) {
    if (!state.started) return;

    // Always look ahead
    camera.lookAt(0, 1.0, -8);

    if (state.freeze) return;

    // Environment motion (ride illusion)
    if (state.phase === "ride") {
      for (const l of lines) {
        l.position.z += 0.42;
        if (l.position.z > 6) l.position.z = -170;
      }
      for (const o of city.children) {
        o.position.z += 0.14;
        if (o.position.z > 10) o.position.z = -170;
      }

      // wheel spin if fallback
      for (const w of wheels) w.rotation.x -= 0.14;

      // subtle scooter lean (works for both fallback + GLB)
      scooter.rotation.z = Math.sin(performance.now() * 0.004) * 0.02;
    }

    if (state.phase === "gift") {
      roseGroup.rotation.y += 0.012;
      roseGroup.position.y = 0.2 + Math.sin(performance.now()*0.003) * 0.06;
      camera.lookAt(-8.2, 1.4, -50.5);
    }
  }

  return { start, update, state };
}
