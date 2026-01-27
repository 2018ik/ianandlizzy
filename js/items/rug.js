import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function createRug() {
  const group = new THREE.Group();
  group.userData = {
    title: "Woven rug",
    description: "A soft textile that keeps the room grounded and cozy.",
    previewAngle: "top",
  };

  const rugMat = new THREE.MeshStandardMaterial({ color: 0xf5b8b8 });
  const rug = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 2.2), rugMat);
  rug.position.set(0, 0.04, 0);
  group.add(rug);

  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xf7d6a8 });
  for (let i = -1; i <= 1; i += 1) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.02, 0.3), stripeMat);
    stripe.position.set(0, 0.09, i * 0.7);
    group.add(stripe);
  }

  return group;
}
