import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createWallShelf() {
  const gltfLoader = new GLTFLoader();
  const shelfUrl = new URL("./wallshelf.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      shelfUrl.href,
      (gltf) => {
        const shelfGroup = new THREE.Group();
        shelfGroup.userData = {
          title: "Wall shelf",
          description: "A tiny shelf for little trinkets and keepsakes.",
        };

        const shelf = gltf.scene;
        shelf.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(shelf);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetWidth = 1.2;
        const scale = targetWidth / Math.max(size.x, 0.001);
        shelf.scale.setScalar(scale);
        shelf.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(shelf);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);
        shelf.position.sub(scaledCenter);

        shelfGroup.add(shelf);
        resolve(shelfGroup);
      },
      undefined,
      (error) => {
        console.error("Failed to load wallshelf.glb", error);
        reject(error);
      }
    );
  });
}
