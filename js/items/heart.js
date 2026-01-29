import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createHeart() {
  const gltfLoader = new GLTFLoader();
  const heartUrl = new URL("./heart.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      heartUrl.href,
      (gltf) => {
        const heartGroup = new THREE.Group();
        heartGroup.userData = {
          title: "Heart",
          description: "A floating heart for the wedding scene.",
        };

        const heart = gltf.scene;
        heart.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(heart);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetHeight = 2.4;
        const scale = targetHeight / Math.max(size.y, 0.001);
        heart.scale.setScalar(scale);
        heart.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(heart);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);
        heart.position.sub(scaledCenter);

        heartGroup.add(heart);
        resolve(heartGroup);
      },
      undefined,
      (error) => {
        console.error("Failed to load heart.glb", error);
        reject(error);
      }
    );
  });
}
