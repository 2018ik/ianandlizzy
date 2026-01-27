import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createMacbook() {
  const gltfLoader = new GLTFLoader();
  const macbookUrl = new URL("./macbook.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      macbookUrl.href,
      (gltf) => {
        const laptopGroup = new THREE.Group();
        laptopGroup.userData = {
          title: "MacBook Pro",
          description: "We're both pro coders that need probooks to keep us pro.",
        };

        const laptop = gltf.scene;
        laptop.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(laptop);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetWidth = 0.9;
        const scale = targetWidth / Math.max(size.x, 0.001);
        laptop.scale.setScalar(scale);
        laptop.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(laptop);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);
        laptop.position.sub(scaledCenter);

        laptopGroup.add(laptop);
        resolve(laptopGroup);
      },
      undefined,
      (error) => {
        console.error("Failed to load macbook.glb", error);
        reject(error);
      }
    );
  });
}
