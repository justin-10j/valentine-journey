import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

export function createDay3(scene, camera) {
  const state = { started:false, freeze:false };
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30,180), new THREE.MeshStandardMaterial({ color:0x1f1f1f }));
  ground.rotation.x=-Math.PI/2; ground.position.z=-60; scene.add(ground);

  const shop = new THREE.Mesh(new THREE.BoxGeometry(6,3,3), new THREE.MeshStandardMaterial({ color:0x222, emissive:0x9b5de5, emissiveIntensity:0.45 }));
  shop.position.set(-8,1.5,-52); scene.add(shop);

  const gift = new THREE.Group(); gift.visible=false; gift.position.set(-8,0.2,-50.6); scene.add(gift);
  const fallback = new THREE.Mesh(new THREE.BoxGeometry(1.1,0.6,0.8), new THREE.MeshStandardMaterial({ color:0x6d3b2a, emissive:0x6d3b2a, emissiveIntensity:0.12 }));
  fallback.position.y=1.1; gift.add(fallback);

  const loader = new GLTFLoader();
  loader.load("/models/chocolates.glb",(g)=>{ gift.clear(); g.scene.scale.set(0.8,0.8,0.8); gift.add(g.scene); },undefined,()=>{});

  const tl = gsap.timeline({ paused:true });
  tl.to({}, { duration: 6 }, 0);
  tl.to(camera.position, { x: -2.3, y: 2.6, z: -2.0, duration: 1.2, ease:"power2.inOut" }, 6.0);
  tl.to(gift, { duration:0.01, onComplete:()=>{ gift.visible=true; } }, 7.1);
  tl.fromTo(gift.scale,{x:0,y:0,z:0},{x:1,y:1,z:1,duration:1,ease:"back.out(1.7)"},7.12);
  tl.to({}, { duration:0.2, onComplete:()=>{ state.freeze=true; } }, 8.9);

  function start(){ state.started=true; tl.play(0); }
  function update(){
    if (!state.started || state.freeze) return;
    camera.lookAt(0,1,-10);
    if (gift.visible) { gift.rotation.y += 0.02; gift.position.y = 0.2 + Math.sin(performance.now()*0.003)*0.06; camera.lookAt(-8,1.4,-50.5); }
  }
  return { start, update, state };
}
