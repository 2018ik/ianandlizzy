import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createMagnolia() {
  const gltfLoader = new GLTFLoader();
  const magnoliaUrl = new URL("./magnolia.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      magnoliaUrl.href,
      (gltf) => {
        const magnoliaGroup = new THREE.Group();
        magnoliaGroup.userData = {
          title: "Magnolias",
          description: "A pretty bunch of magnolias on the desk.",
        };

        const magnolia = gltf.scene;
        magnolia.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((mat) => {
              if (!mat) return;
              mat.roughness = 0.3;
              mat.metalness = 0.0;
              if (mat.color) mat.color.multiplyScalar(2.5);
              mat.needsUpdate = true;
            });
          }
        });

        const bbox = new THREE.Box3().setFromObject(magnolia);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const targetHeight = 0.8;
        const scale = targetHeight / Math.max(size.y, 0.001);
        magnolia.scale.setScalar(scale);
        magnolia.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(magnolia);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);
        magnolia.position.sub(scaledCenter);

        magnoliaGroup.add(magnolia);
        resolve(magnoliaGroup);
      },
      undefined,
      (error) => {
        console.error("Failed to load magnolia.glb", error);
        reject(error);
      }
    );
  });
}
