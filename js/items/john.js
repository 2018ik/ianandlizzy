import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createJohn() {
  const gltfLoader = new GLTFLoader();
  const johnUrl = new URL("./john.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      johnUrl.href,
      (gltf) => {
        const johnGroup = new THREE.Group();
        johnGroup.userData = {
          title: "John",
          description: "A book on the shelf.",
        };

        const john = gltf.scene;
        john.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((mat) => {
              if (!mat) return;
              mat.roughness = 1.0;
              mat.metalness = 0.0;
              if (mat.color) mat.color.multiplyScalar(2.5);
              mat.needsUpdate = true;
            });
          }
        });

        const bbox = new THREE.Box3().setFromObject(john);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const targetHeight = 0.5;
        const scale = targetHeight / Math.max(size.y, 0.001);
        john.scale.setScalar(scale);
        john.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(john);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);
        john.position.sub(scaledCenter);
        john.position.y += (scaledBox.max.y - scaledBox.min.y) * 0.5;

        johnGroup.add(john);
        resolve(johnGroup);
      },
      undefined,
      (error) => {
        console.error("Failed to load john.glb", error);
        reject(error);
      }
    );
  });
}
