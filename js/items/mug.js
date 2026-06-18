import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createCoffeeMug() {
  const gltfLoader = new GLTFLoader();
  const coffeeUrl = new URL("./coffee.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      coffeeUrl.href,
      (gltf) => {
        const mugGroup = new THREE.Group();
        mugGroup.userData = {
          title: "Bubble tea",
          description: "Ian doesn't drink boba. Lizzy needs to drink boba our else she will die.",
        };

        const mug = gltf.scene;
        mug.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(mug);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetHeight = 0.35;
        const scale = targetHeight / Math.max(size.y, 0.001);
        mug.scale.setScalar(scale);
        mug.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(mug);
        const scaledSize = new THREE.Vector3();
        const scaledCenter = new THREE.Vector3();
        scaledBox.getSize(scaledSize);
        scaledBox.getCenter(scaledCenter);
        mug.position.sub(scaledCenter);

        mugGroup.add(mug);
        resolve(mugGroup);
      },
      undefined,
      (error) => {
        console.error("Failed to load coffee.glb", error);
        reject(error);
      }
    );
  });
}
