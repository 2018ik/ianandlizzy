import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createRug() {
  const gltfLoader = new GLTFLoader();
  const rugUrl = new URL("./boho_rug.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      rugUrl.href,
      (gltf) => {
        const group = new THREE.Group();
        group.userData = {
          title: "Boho rug",
          description: "A cozy boho rug with textured woven patterns.",
          previewAngle: "top",
        };

        const rug = gltf.scene;
        rug.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(rug);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetWidth = 3.4;
        const scale = targetWidth / Math.max(size.x, 0.001);
        rug.scale.setScalar(scale);
        rug.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(rug);
        const scaledSize = new THREE.Vector3();
        const scaledCenter = new THREE.Vector3();
        scaledBox.getSize(scaledSize);
        scaledBox.getCenter(scaledCenter);
        rug.position.sub(scaledCenter);
        rug.position.y += scaledSize.y * 0.5;

        group.add(rug);
        resolve(group);
      },
      undefined,
      (error) => {
        console.error("Failed to load boho_rug.glb", error);
        reject(error);
      }
    );
  });
}
