import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createAmazonBox() {
  const gltfLoader = new GLTFLoader();
  const amazonUrl = new URL("./amazon.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      amazonUrl.href,
      (gltf) => {
        const amazonGroup = new THREE.Group();
        amazonGroup.userData = {
          title: "Amazon Box",
          description: "The best part about ordering things on Amazon is that you get to have a box for your cat to sit in but we don't have a cat anymore :("
        };

        const box = gltf.scene;
        box.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const bbox = new THREE.Box3().setFromObject(box);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const targetHeight = 0.6;
        const scale = targetHeight / Math.max(size.y, 0.001);
        box.scale.setScalar(scale);
        box.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(box);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);
        box.position.sub(scaledCenter);
        box.position.y += (scaledBox.max.y - scaledBox.min.y) * 0.5;

        amazonGroup.add(box);
        resolve(amazonGroup);
      },
      undefined,
      (error) => {
        console.error("Failed to load amazon.glb", error);
        reject(error);
      }
    );
  });
}
