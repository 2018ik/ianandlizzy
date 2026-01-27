import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { RoundedBoxGeometry } from "https://unpkg.com/three@0.160.0/examples/jsm/geometries/RoundedBoxGeometry.js";

export function createDesk() {
  const group = new THREE.Group();
  group.userData = {
    title: "Desk",
    description: "This rounded desk is really cute, just like Lizzy.",
  };

  const topMat = new THREE.MeshStandardMaterial({ color: 0xf5d9be });
  const legMat = new THREE.MeshStandardMaterial({ color: 0xf7f5f2 });
  const accentMat = new THREE.MeshStandardMaterial({ color: 0xf0b7a4 });

  const top = new THREE.Mesh(new RoundedBoxGeometry(3.2, 0.22, 1.6, 4, 0.12), topMat);
  top.position.set(0, 1.12, 0);
  group.add(top);

  const legGeo = new THREE.CylinderGeometry(0.14, 0.18, 1.08, 16);
  const legOffsets = [
    [-1.4, 0.55, -0.6],
    [1.4, 0.55, -0.6],
    [-1.4, 0.55, 0.6],
    [1.4, 0.55, 0.6],
  ];
  legOffsets.forEach((pos) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(pos[0], pos[1], pos[2]);
    group.add(leg);
  });

  const drawerMat = new THREE.MeshStandardMaterial({ color: 0xf3caa0 });
  const drawer = new THREE.Mesh(new RoundedBoxGeometry(1.2, 0.48, 1, 4, 0.08), drawerMat);
  drawer.position.set(-0.8, 0.76, 0);
  group.add(drawer);

  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 10, 24), accentMat);
  handle.rotation.x = Math.PI * 0.5;
  handle.position.set(-0.8, 0.78, 0.56);
  group.add(handle);

  const skirt = new THREE.Mesh(new RoundedBoxGeometry(2.6, 0.12, 1.2, 3, 0.06), accentMat);
  skirt.position.set(0, 1.0, 0);
  group.add(skirt);

  return group;
}
