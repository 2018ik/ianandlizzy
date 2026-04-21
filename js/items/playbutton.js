import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createPlayButton() {
  const gltfLoader = new GLTFLoader();
  const playButtonUrl = new URL("./playbutton.glb", import.meta.url);

  return new Promise((resolve, reject) => {
    gltfLoader.load(
      playButtonUrl.href,
      (gltf) => {
        const group = new THREE.Group();
        group.userData = {
          title: "Play Button",
          description: "A little play button mounted on the wall.",
        };

        const playButton = gltf.scene;
        playButton.traverse((child) => {
          if (!child.isMesh) return;
          child.castShadow = true;
          child.receiveShadow = true;
        });

        const box = new THREE.Box3().setFromObject(playButton);
        const size = new THREE.Vector3();
        box.getSize(size);
        const scale = 0.01;
        playButton.scale.setScalar(scale);
        playButton.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(playButton);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);
        playButton.position.sub(scaledCenter);

        group.add(playButton);
        resolve(group);
      },
      undefined,
      (error) => {
        console.error("Failed to load playbutton.glb", error);
        reject(error);
      }
    );
  });
}
