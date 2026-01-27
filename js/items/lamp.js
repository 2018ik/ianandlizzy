import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function createLamp() {
  const group = new THREE.Group();
  group.userData = {
    title: "Reading lamp",
    description: "Soft amber light for sketching after dark.",
  };

  const baseMat = new THREE.MeshStandardMaterial({ color: 0xe0d5c8 });
  const stemMat = new THREE.MeshStandardMaterial({ color: 0xcab7a3 });
  const shadeMat = new THREE.MeshStandardMaterial({ color: 0xffd7b5, emissive: 0xffc08a, emissiveIntensity: 0.4 });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.18, 20), baseMat);
  base.position.set(0, 0.1, 0);
  group.add(base);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.1, 16), stemMat);
  stem.position.set(0, 0.7, 0);
  group.add(stem);

  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.6, 18), shadeMat);
  shade.position.set(0, 1.35, 0);
  shade.rotation.x = Math.PI;
  group.add(shade);

  return group;
}
