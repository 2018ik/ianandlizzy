import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createChair() {
  const gltfLoader = new GLTFLoader();
  const modelUrl = new URL("./chair.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      modelUrl.href,
      (gltf) => {
        const group = new THREE.Group();
        group.userData = {
          title: "Chair",
          description: "Lizzy enjoys scouring Facebook Marketplace for furniture, such as chairs.",
        };

        const model = gltf.scene;
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetHeight = 1.1;
        const scale = targetHeight / Math.max(size.y, 0.001);
        model.scale.setScalar(scale);
        model.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledSize = new THREE.Vector3();
        const scaledCenter = new THREE.Vector3();
        scaledBox.getSize(scaledSize);
        scaledBox.getCenter(scaledCenter);
        model.position.sub(scaledCenter);
        model.position.y += scaledSize.y * 0.5;

        group.add(model);
        resolve(group);
      },
      undefined,
      (error) => {
        console.error("Failed to load chair.glb", error);
        reject(error);
      }
    );
  });
}
