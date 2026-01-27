import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createBambooPlant() {
  const gltfLoader = new GLTFLoader();
  const bambooUrl = new URL("./bamboo.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      bambooUrl.href,
      (gltf) => {
        const plantGroup = new THREE.Group();
        plantGroup.userData = {
          title: "Bambo Plant",
          description: "Bamboo is Chinese and our first date was at a Chinese restaurant (also we are both Chinese). Also we both like planting, not in real life, but in Stardew Valley.",
        };

        const bamboo = gltf.scene;
        bamboo.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(bamboo);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetHeight = 1.6;
        const scale = targetHeight / Math.max(size.y, 0.001);
        bamboo.scale.setScalar(scale);
        bamboo.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(bamboo);
        const scaledCenter = new THREE.Vector3();
        const scaledSize = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);
        scaledBox.getSize(scaledSize);
        bamboo.position.sub(scaledCenter);
        bamboo.position.y += scaledSize.y * 0.5;

        plantGroup.add(bamboo);
        resolve(plantGroup);
      },
      undefined,
      (error) => {
        console.error("Failed to load bamboo.glb", error);
        reject(error);
      }
    );
  });
}
