import * as THREE from "three";
import gsap from "gsap";

export function createDay5(scene, camera) {
  const state = { started:false, freeze:false };
  // Park vibe: green ground + soft light
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40,200), new THREE.MeshStandardMaterial({ color:0x143d2b, roughness:1 }));
  ground.rotation.x=-Math.PI/2; ground.position.z=-70; scene.add(ground);

  // Symbol object (two hands = two spheres)
  const gift = new THREE.Group(); gift.visible=false; gift.position.set(0,0.2,-60); scene.add(gift);
  const a = new THREE.Mesh(new THREE.SphereGeometry(0.55,24,24), new THREE.MeshStandardMaterial({ color:0xffd6a5, emissive:0xffd6a5, emissiveIntensity:0.08 }));
  const b = a.clone();
  a.position.set(-0.65,1.1,0); b.position.set(0.65,1.1,0);
  gift.add(a,b);

  const tl = gsap.timeline({ paused:true });
  tl.to({}, { duration: 6 }, 0);
  tl.to(camera.position, { x: 0, y: 2.8, z: -2.2, duration: 1.2, ease:"power2.inOut" }, 6.0);
  tl.to(gift, { duration:0.01, onComplete:()=>{ gift.visible=true; } }, 7.1);
  tl.fromTo(gift.scale,{x:0,y:0,z:0},{x:1,y:1,z:1,duration:1,ease:"back.out(1.7)"},7.12);
  tl.to({}, { duration:0.2, onComplete:()=>{ state.freeze=true; } }, 8.9);

  function start(){ state.started=true; tl.play(0); }
  function update(){
    if (!state.started || state.freeze) return;
    camera.lookAt(0,1,-12);
    if (gift.visible) { gift.rotation.y += 0.01; camera.lookAt(0,1.4,-60); }
  }
  return { start, update, state };
}
