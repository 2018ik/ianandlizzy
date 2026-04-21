import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { createRoomScene } from "./roomScene.js";

const canvasWrap = document.getElementById("wedding-canvas");

const { scene, camera, renderer, heartRef, heartSparkle, updateFadeIns } = createRoomScene({
  mountEl: canvasWrap,
  enableControls: false,
  pointerEvents: false,
  includeHeart: true,
});
const target = new THREE.Vector3(0, 2.2, 0);
const baseCam = new THREE.Vector3(8, 9.4, 8);
// createRoomScene already wires up resize handling.

function animate(time) {
  updateFadeIns(time);
  const heart = heartRef();
  if (heart) {
    heart.rotation.y += 0.003;
  }
  const sparkle = heartSparkle();
  if (sparkle) {
    sparkle.intensity = 1.0 + Math.sin(time * 0.001) * 0.45;
  }
  const t = time * 0.00008;
  camera.position.set(
    baseCam.x + Math.sin(t) * 3,
    baseCam.y + Math.sin(time * 0.00005) * 3,
    baseCam.z + Math.cos(t) * 3
  );
  camera.lookAt(target);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
