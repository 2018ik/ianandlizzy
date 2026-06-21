import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createPiano() {
  const gltfLoader = new GLTFLoader();
  const pianoUrl = new URL("./piano.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      pianoUrl.href,
      (gltf) => {
        const pianoGroup = new THREE.Group();
        pianoGroup.userData = {
          title: "Piano Keyboard",
          description: "Ian likes playing some tunes every now and then.\nLizzy is his #1 soundcloud listener.",
        };

        const pianoMaterial = new THREE.MeshStandardMaterial({ color: 0xf5a3c7 });
        const keyMaterials = new Set([
          "Klavier_Glnzend_Wei",
          "Klavierlack_Schwarz",
          "Klavier_Verstellrdchen",
        ]);

        const piano = gltf.scene;
        piano.traverse((child) => {
          if (!child.isMesh) return;
          child.castShadow = true;
          child.receiveShadow = true;
          const keepMaterial = (mat) => keyMaterials.has(mat?.name);
          if (Array.isArray(child.material)) {
            child.material = child.material.map((mat) => (keepMaterial(mat) ? mat : pianoMaterial));
          } else {
            child.material = keepMaterial(child.material) ? child.material : pianoMaterial;
          }
        });

        const box = new THREE.Box3().setFromObject(piano);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetWidth = 1.6;
        const scale = targetWidth / Math.max(size.x, 0.001);
        const targetHeight = 1;
        const scaledHeight = size.y * scale;
        const heightBoost = targetHeight / Math.max(scaledHeight, 0.001);
        piano.scale.set(scale, scale * heightBoost, scale);
        piano.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(piano);
        const scaledCenter = new THREE.Vector3();
        const scaledSize = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);
        scaledBox.getSize(scaledSize);
        piano.position.sub(scaledCenter);
        piano.position.y += scaledSize.y * 0.5;

        pianoGroup.add(piano);
        resolve(pianoGroup);
      },
      undefined,
      (error) => {
        console.error("Failed to load piano.glb", error);
        reject(error);
      }
    );
  });
}
