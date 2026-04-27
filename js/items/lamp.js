import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createLamp() {
  const gltfLoader = new GLTFLoader();
  const lampUrl = new URL("./sweep_floor_lamp.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      lampUrl.href,
      (gltf) => {
        const lampGroup = new THREE.Group();
        lampGroup.userData = {
          title: "Reading lamp",
          description: "Soft amber light for sketching after dark.",
        };

        const lamp = gltf.scene;
        const bakedFloorMeshes = [];
        lamp.traverse((child) => {
          if (child.isMesh && (child.name === "FLOOR" || child.material?.name === "FLOOR")) {
            bakedFloorMeshes.push(child);
            return;
          }

          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        bakedFloorMeshes.forEach((mesh) => mesh.parent?.remove(mesh));

        const box = new THREE.Box3().setFromObject(lamp);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetHeight = 1.6;
        const scale = targetHeight / Math.max(size.y, 0.001);
        lamp.scale.setScalar(scale);
        lamp.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(lamp);
        const scaledSize = new THREE.Vector3();
        const scaledCenter = new THREE.Vector3();
        scaledBox.getSize(scaledSize);
        scaledBox.getCenter(scaledCenter);
        lamp.position.sub(scaledCenter);
        lamp.position.y += scaledSize.y * 0.5;

        lampGroup.add(lamp);
        resolve(lampGroup);
      },
      undefined,
      (error) => {
        console.error("Failed to load sweep_floor_lamp.glb", error);
        reject(error);
      }
    );
  });
}
