import * as THREE from "three";
import gsap from "gsap";

export function createDay7(scene, camera) {
  const state = { started:false, freeze:false };

  // Hilltop ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80,220), new THREE.MeshStandardMaterial({ color:0x1b2a19, roughness:1 }));
  ground.rotation.x=-Math.PI/2; ground.position.z=-90; scene.add(ground);

  // Simple hill mound
  const hill = new THREE.Mesh(new THREE.SphereGeometry(18,32,32), new THREE.MeshStandardMaterial({ color:0x22331f, roughness:1 }));
  hill.position.set(0,-10,-90);
  scene.add(hill);

  // Kiss symbol (two small spheres moving close)
  const gift = new THREE.Group(); gift.visible=false; gift.position.set(0,0.2,-85); scene.add(gift);
  const a = new THREE.Mesh(new THREE.SphereGeometry(0.35,24,24), new THREE.MeshStandardMaterial({ color:0xffd6a5 }));
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.35,24,24), new THREE.MeshStandardMaterial({ color:0xffd6a5 }));
  a.position.set(-0.55,1.1,0); b.position.set(0.55,1.1,0);
  gift.add(a,b);

  const tl = gsap.timeline({ paused:true });
  tl.to({}, { duration: 6 }, 0);
  tl.to(camera.position, { x: 0, y: 3.2, z: -6.0, duration: 1.6, ease:"power2.inOut" }, 6.0);
  tl.to(gift, { duration:0.01, onComplete:()=>{ gift.visible=true; } }, 7.9);
  tl.to(a.position, { x: -0.12, duration: 1.2, ease:"power2.inOut" }, 8.0);
  tl.to(b.position, { x:  0.12, duration: 1.2, ease:"power2.inOut" }, 8.0);
  tl.to({}, { duration:0.2, onComplete:()=>{ state.freeze=true; } }, 9.8);

  function start(){ state.started=true; tl.play(0); }
  function update(){
    if (!state.started || state.freeze) return;
    camera.lookAt(0,1.2,-90);
  }
  return { start, update, state };
}
