import { createDesk } from "./items/desk.js";
import { createBookshelf } from "./items/bookshelf.js";
import { createMacbook } from "./items/computer.js";
import { createBambooPlant } from "./items/plant.js";
import { createLamp } from "./items/lamp.js";
import { createRug } from "./items/rug.js";
import { createCat } from "./items/cat.js";
import { createPhotoFrame } from "./items/photoFrame.js";
import { createPiano } from "./items/piano.js";
import { createCoffeeMug } from "./items/mug.js";
import { createPoster } from "./items/poster.js";
import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";
import { createWallShelf } from "./items/wallshelf.js";
import { createCinamaroll } from "./items/cinamaroll.js";
import { createBadtz } from "./items/badtz.js";
import { createChair } from "./items/chair.js";

export function createRegisterItem(scene, clickable, onRegisterItem) {
  return function registerItem(group, { clickable: isClickable = true, addToScene = true } = {}) {
    group.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    if (isClickable && clickable && group.userData && group.userData.title) {
      clickable.push(group);
      if (onRegisterItem) {
        onRegisterItem(group);
      }
    }
    if (addToScene) {
      scene.add(group);
    }
  };
}

export function populateRoom({ registerItem, onCat }) {
  const scaleDesk = 3.6;
  const scaleBookshelf = 1.6;
  const scaleComputer = 1.8;
  const scalePlant = 4;
  const scaleLamp = 4.5;
  const scaleRug = 1.5;
  const scalePoster = 3;
  const scaleMug = 2.3;
  const scaleCat = 1.4;
  const scalePiano = 2.6;
  const scaleWallShelf = 6;
  const scaleCinamaroll = 1;
  const scaleBadtz = 1.5; 

  createDesk()
    .then((desk) => {
      desk.scale.setScalar(scaleDesk);
      desk.position.set(-2, 0, -2.5);
      registerItem(desk, { clickable: false });
    })
    .catch((error) => {
      console.error("Failed to add desk", error);
    });

  createCoffeeMug()
    .then((mug) => {
      mug.scale.setScalar(scaleMug);
      mug.position.set(-.5, 2.49, -2.5);
      registerItem(mug);
    })
    .catch((error) => {
      console.error("Failed to add coffee mug", error);
    });

  const photoFrame = createPhotoFrame();
  photoFrame.scale.setScalar(0.7);
  photoFrame.position.set(-3.5, 2.52, -2.2);
  photoFrame.rotation.y = 0.8;
  registerItem(photoFrame);

  createCat()
    .then((cat) => {
      cat.scale.setScalar(scaleCat);
      cat.position.set(-1.2, -0.05, -1.4);
      registerItem(cat);
      if (onCat) onCat(cat);
    })
    .catch((error) => {
      console.error("Failed to add cat", error);
    });

  createPiano()
    .then((piano) => {
      piano.scale.setScalar(scalePiano);
      piano.position.set(-4, 0, 2.3);
      piano.rotation.y = Math.PI / 2;
      registerItem(piano);
    })
    .catch((error) => {
      console.error("Failed to add piano", error);
    });

  // const bookshelf = createBookshelf();
  // bookshelf.scale.setScalar(scaleBookshelf);
  // bookshelf.position.set(3.1, 0, -2.4);
  // registerItem(bookshelf);

  createMacbook()
    .then((computer) => {
      computer.scale.setScalar(scaleComputer);
      computer.position.set(-2, 3.18, -2.8);
      registerItem(computer);
    })
    .catch((error) => {
      console.error("Failed to add macbook", error);
    });

  createBambooPlant()
    .then((plant) => {
      plant.scale.setScalar(scalePlant);
      plant.position.set(5, 0, -1);
      registerItem(plant);
    })
    .catch((error) => {
      console.error("Failed to add bamboo plant", error);
    });

  createLamp()
    .then((lamp) => {
      lamp.scale.setScalar(scaleLamp);
      lamp.position.set(3.5, 0, -3);
      lamp.rotation.y = -3.14159/2
      registerItem(lamp, { clickable: false });
    })
    .catch((error) => {
      console.error("Failed to add lamp", error);
    });

  createRug()
    .then((rug) => {
      rug.scale.setScalar(scaleRug);
      rug.position.set(3, 0.01, 0);
      registerItem(rug, { clickable: false });
      rug.rotation.y = 3.14159;
    })
    .catch((error) => {
      console.error("Failed to add boho rug", error);
    });

  createPoster()
    .then((poster) => {
      poster.scale.setScalar(scalePoster);
      poster.position.set(1.6, 3.9, -4.9);
      registerItem(poster);
    })
    .catch((error) => {
      console.error("Failed to add poster", error);
    });

  createChair()
    .then((chair) => {
      chair.scale.setScalar(3.2);
      chair.position.set(-1.3, 0, 1);
      chair.rotation.y = 2;
      registerItem(chair);
    })
    .catch((error) => {
      console.error("Failed to add chair", error);
    });

  createWallShelf()
    .then((shelf) => {
      shelf.scale.setScalar(scaleWallShelf);
      shelf.position.set(-5.55, 3, -0.4);
      shelf.rotation.y = Math.PI / 2;
      registerItem(shelf, {clickable: false});
    })
    .catch((error) => {
      console.error("Failed to add wall shelf", error);
    });

  createCinamaroll()
    .then((cinamaroll) => {
      cinamaroll.scale.setScalar(scaleCinamaroll);
      cinamaroll.position.set(-5.6, 2.85, -2.45);
      cinamaroll.rotation.y = Math.PI / 2;
      registerItem(cinamaroll, {clickable: true});
    })
    .catch((error) => {
      console.error("Failed to add cinamaroll", error);
    });

  createBadtz()
    .then((badtz) => {
      badtz.scale.setScalar(scaleBadtz);
      badtz.position.set(-5.4, 3.08, -1.5);
      badtz.rotation.y = Math.PI / 2;
      registerItem(badtz, {clickable: true});
    })
    .catch((error) => {
      console.error("Failed to add badtz", error);
    });
}

export function addRoomShell(scene) {
  const group = new THREE.Group();

  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.65,
    metalness: 0.05,
    emissive: 0x8b6a4a,      // warm brown, not white
    emissiveIntensity: 0.30, // small lift
  });
  const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.6, 10), floorMat);
  floor.geometry.computeVertexNormals();
  floor.position.set(0, -0.3, 0);
  floor.receiveShadow = true;
  group.add(floor);

  const gltfLoader = new GLTFLoader();
  const woodUrl = new URL("./items/wood_texture.glb", import.meta.url);
  gltfLoader.load(
    woodUrl.href,
    (gltf) => {
      let woodMap = null;
      gltf.scene.traverse((child) => {
        if (woodMap || !child.isMesh) return;
        const mat = child.material;
        if (Array.isArray(mat)) {
          for (const m of mat) {
            if (m?.map) {
              woodMap = m.map;
              break;
            }
          }
        } else if (mat?.map) {
          woodMap = mat.map;
        }
      });

      if (woodMap) {
        woodMap.colorSpace = THREE.SRGBColorSpace;
        woodMap.wrapS = THREE.RepeatWrapping;
        woodMap.wrapT = THREE.RepeatWrapping;
        woodMap.repeat.set(2.4, 2.4);
        floorMat.map = woodMap;
        floorMat.needsUpdate = true;
      } else {
        console.warn("wood_texture.glb loaded, but no texture map found");
      }
    },
    undefined,
    (error) => {
      console.error("Failed to load wood_texture.glb", error);
    }
  );

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf7d2dc,
    emissive: new THREE.Color(0xff7d2dc),
    emissiveIntensity: 0.5,
  });
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 0.4), wallMat);
  backWall.position.set(0, 2.4, -5.2);
  backWall.receiveShadow = true;
  group.add(backWall);

  const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 10), wallMat);
  sideWall.position.set(-6.2, 2.4, 0);
  sideWall.receiveShadow = true;
  group.add(sideWall);

  const corner = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 0.4), wallMat);
  corner.position.set(-6.2, 2.4, -5.2);
  corner.receiveShadow = true;
  group.add(corner);

  scene.add(group);
}
