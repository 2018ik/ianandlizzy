import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createDesk() {
  const gltfLoader = new GLTFLoader();
  const deskUrl = new URL("./desk.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      deskUrl.href,
      (gltf) => {
        const deskGroup = new THREE.Group();
        deskGroup.userData = {
          title: "Desk",
          description: "This rounded desk is really cute, just like Lizzy.",
        };

        const desk = gltf.scene;
        desk.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const geom = child.geometry;
            const vertexCount = geom?.attributes?.position?.count ?? 0;
            const matNames = Array.isArray(child.material)
              ? child.material.map((mat) => mat?.name || "(unnamed)")
              : [child.material?.name || "(unnamed)"];
            console.log("[desk] mesh:", child.name || "(unnamed)", "verts:", vertexCount, "materials:", matNames);
            if (child.name?.includes("FLOOR") || matNames.includes("FLOOR")) {
              child.visible = false;
            }
          }
        });

        const box = new THREE.Box3().setFromObject(desk);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetWidth = 3.2;
        const scale = targetWidth / Math.max(size.x, 0.001);
        const zStretch = 1.5;
        desk.scale.set(scale, scale, scale * zStretch);
        desk.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(desk);
        const scaledSize = new THREE.Vector3();
        const scaledCenter = new THREE.Vector3();
        scaledBox.getSize(scaledSize);
        scaledBox.getCenter(scaledCenter);
        desk.position.sub(scaledCenter);
        desk.position.y += scaledSize.y * 0.5;

        deskGroup.add(desk);
        resolve(deskGroup);
      },
      undefined,
      (error) => {
        console.error("Failed to load desk.glb", error);
        reject(error);
      }
    );
  });
}
