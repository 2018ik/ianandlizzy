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
          title: "Life Study of John",
          description:
            "Did you know that John Chapter 1 reveals God's entire New Testament plan from eternity past to eternity future? Verse 1 begins with God, the Word, in the beginning. Then, it is followed by:\n\n" +
            "1. Creation (v.3): The purpose of creation is to produce a receptable to receive God as life. All of creation is actually for man (Zech. 12:1). \n" +
            "2. Incarnation (v.14): Through incarnation, God was brought into His creation. It was God's master plan to to prepare creation in order to join Himself to it (Eph. 2:10). \n" +
            "3. Redemption (v.29): Through redemption, the Lord recovered fallen man, separated him from sin, and terminated the old creation. \n" +
            "4. Anointing (v.32): While redemption removed the negative, the anointing of the Holy Spirit imparts the positive: God as life into man to transform man into precious stones. \n" +
            "5. Building (v.42): God desires a mutual abode of God and man (John 14:2; 17:21). God as the divine one put on human nature. \
            His regenerated believers have received the divine nature. There is a two-way traffic of life between God and man illustrated by the angels ascending and descending from heaven in the last verse (1:51). \
            This is an allusion to Jacob's dream in Bethel, which is Hebrew for house of God. This house of God, the church, the Body of Christ, produced by God's heavenly \
            life dispensed into man will consummate in the New Jerusalem, the eternal mingling of God with man and man with God."
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
