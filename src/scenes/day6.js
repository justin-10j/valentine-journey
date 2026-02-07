import * as THREE from "three";
import gsap from "gsap";

export function createDay6(scene, camera) {
  const state = { started:false, freeze:false };
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40,200), new THREE.MeshStandardMaterial({ color:0x16384a, roughness:1 }));
  ground.rotation.x=-Math.PI/2; ground.position.z=-70; scene.add(ground);

  // Hug symbol (two torus around heart)
  const gift = new THREE.Group(); gift.visible=false; gift.position.set(0,0.2,-60); scene.add(gift);

  const heart = new THREE.Mesh(new THREE.SphereGeometry(0.45,24,24), new THREE.MeshStandardMaterial({ color:0xff4d6d, emissive:0xff4d6d, emissiveIntensity:0.15 }));
  heart.position.y = 1.1;
  gift.add(heart);

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.9,0.08,16,40), new THREE.MeshStandardMaterial({ color:0xffffff, emissive:0xffffff, emissiveIntensity:0.12 }));
  const ring2 = ring1.clone();
  ring1.position.y = 1.1; ring2.position.y = 1.1;
  ring1.rotation.x = Math.PI/2; ring2.rotation.y = Math.PI/2;
  gift.add(ring1, ring2);

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
    if (gift.visible) { gift.rotation.y += 0.01; gift.position.y = 0.2 + Math.sin(performance.now()*0.003)*0.05; camera.lookAt(0,1.4,-60); }
  }
  return { start, update, state };
}
