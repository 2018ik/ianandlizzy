import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

export function createPoster() {
  const gltfLoader = new GLTFLoader();
  const posterUrl = new URL("./poster.glb", import.meta.url);
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      posterUrl.href,
      (gltf) => {
        const group = new THREE.Group();
        group.userData = {
          title: "Wall Painting",
          description: "We have gone on three dates to art museums so far. The Phillips Collection (where we ran into some friends), the Virginia Museum of Fine Art (which has an interesting illusory head sculpture), and the National Gallery of Art (where we took our engagement photos). Not that you'd care. But you clicked on this so we have to tell you.",
        };

        const poster = gltf.scene;
        poster.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(poster);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetWidth = 1.6;
        const scale = targetWidth / Math.max(size.x, 0.001);
        poster.scale.setScalar(scale);
        poster.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(poster);
        const scaledSize = new THREE.Vector3();
        const scaledCenter = new THREE.Vector3();
        scaledBox.getSize(scaledSize);
        scaledBox.getCenter(scaledCenter);
        poster.position.sub(scaledCenter);

        group.add(poster);
        resolve(group);
      },
      undefined,
      (error) => {
        console.error("Failed to load poster.glb", error);
        reject(error);
      }
    );
  });
}
