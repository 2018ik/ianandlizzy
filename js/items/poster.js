import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function createPoster() {
  const group = new THREE.Group();
  group.userData = {
    title: "Studio poster",
    description: "A tiny moodboard: constellations, typography, and soft gradients.",
  };

  const frameMat = new THREE.MeshStandardMaterial({ color: 0xf1e7d8 });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 0.1), frameMat);
  frame.position.set(0, 0, 0);
  group.add(frame);

  const artMat = new THREE.MeshStandardMaterial({ color: 0xffa8a8, emissive: 0xff7e7e, emissiveIntensity: 0.2 });
  const art = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.8), artMat);
  art.position.set(0, 0, 0.06);
  group.add(art);

  return group;
}
