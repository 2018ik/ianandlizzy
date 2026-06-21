import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createCat() {
  const gltfLoader = new GLTFLoader();
  const catUrl = new URL("./cat.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      catUrl.href,
      (gltf) => {
        const catGroup = new THREE.Group();
        catGroup.userData = {
          title: "Sleepy Cat",
          description: "Ian grew up with a cat named Mittens that looked kind of like this 3D model. Unfortunately, she passed away earlier this year due to cancer 😔.",
          previewAngle: "top",
        };

        const cat = gltf.scene;
        cat.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(cat);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetHeight = 0.45;
        const scale = targetHeight / Math.max(size.y, 0.001);
        cat.scale.setScalar(scale);
        cat.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(cat);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);
        cat.position.sub(scaledCenter);
        cat.position.y += (scaledBox.max.y - scaledBox.min.y) * 0.5;

        catGroup.add(cat);
        resolve(catGroup);
      },
      undefined,
      (error) => {
        console.error("Failed to load cat.glb", error);
        reject(error);
      }
    );
  });
}
