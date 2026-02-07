import * as THREE from "three";
import gsap from "gsap";

export function createValentines(scene, camera, renderer) {
  const state = { started:false, freeze:false };

  // Night sky
  scene.background = new THREE.Color(0x02010a);
  scene.fog = new THREE.Fog(0x02010a, 18, 160);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(90,240), new THREE.MeshStandardMaterial({ color:0x0f1322, roughness:1 }));
  ground.rotation.x=-Math.PI/2; ground.position.z=-100; scene.add(ground);

  // Hill silhouette
  const hill = new THREE.Mesh(new THREE.SphereGeometry(22,32,32), new THREE.MeshStandardMaterial({ color:0x0b0f1a, roughness:1 }));
  hill.position.set(0,-12,-100);
  scene.add(hill);

  // Video on sky plane
  const video = document.createElement("video");
  video.src = "/videos/final.mp4";
  video.crossOrigin = "anonymous";
  video.loop = false;
  video.playsInline = true;

  const videoTex = new THREE.VideoTexture(video);
  videoTex.colorSpace = THREE.SRGBColorSpace;

  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 16),
    new THREE.MeshStandardMaterial({ map: videoTex, emissive: new THREE.Color(0xffffff), emissiveIntensity: 0.6 })
  );
  sky.position.set(0, 10, -80);
  scene.add(sky);

  const tl = gsap.timeline({ paused:true });
  tl.to(camera.position, { x:0, y:4.0, z:-10.0, duration: 2.0, ease:"power2.inOut" }, 0);
  tl.to({}, { duration: 0.2, onComplete:()=>{ video.play().catch(()=>{}); } }, 2.0);
  tl.to({}, { duration: 6.0 }, 2.2); // let video play
  tl.to({}, { duration:0.2, onComplete:()=>{ state.freeze=true; } }, 8.2);

  function start(){ state.started=true; tl.play(0); }
  function update(){
    if (!state.started) return;
    camera.lookAt(0,6,-80);
    renderer.render(scene, camera);
  }

  return { start, update, state, video };
}
