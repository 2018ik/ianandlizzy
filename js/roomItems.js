import { createDesk } from "./items/desk.js";
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
import { RoundedBoxGeometry } from "https://unpkg.com/three@0.160.0/examples/jsm/geometries/RoundedBoxGeometry.js";
import { createWallShelf } from "./items/wallshelf.js";
import { createCinamaroll } from "./items/cinamaroll.js";
import { createBadtz } from "./items/badtz.js";
import { createChair } from "./items/chair.js";
import { createAmazonBox } from "./items/amazon.js";
import { createMagnolia } from "./items/magnolia.js";
import { createJohn } from "./items/john.js";
import { createPlayButton } from "./items/playbutton.js";

export function createRegisterItem({ scene, clickable, onRegisterItem, fadingItems, warmObject }) {
  return function registerItem(
    group,
    { clickable: isClickable = true, addToScene = true, staticTransforms = true } = {}
  ) {
    const fadeMeshes = [];

    group.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        fadeMeshes.push(child);
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
      warmObject?.(group);
    }

    if (fadeMeshes.length && fadingItems) {
      const now = performance.now();
      const lastFade = fadingItems[fadingItems.length - 1];
      const start = lastFade ? Math.max(now, lastFade.start + lastFade.duration * 0.25) : now;
      const targetScale = group.scale.clone();
      const targetPosition = group.position.clone();
      const startPosition = targetPosition.clone();
      startPosition.y -= 0.12;

      group.visible = false;
      group.scale.copy(targetScale).multiplyScalar(0.94);
      group.position.copy(startPosition);
      fadeMeshes.forEach((mesh) => {
        mesh.castShadow = false;
      });
      fadingItems.push({
        group,
        meshes: fadeMeshes,
        targetScale,
        targetPosition,
        startPosition,
        start,
        duration: 700,
        onRevealComplete: staticTransforms ? () => lockStaticTransforms(group) : null,
      });
    } else if (staticTransforms) {
      lockStaticTransforms(group);
    }
  };
}

export function populateRoom({ registerItem, onCat, onProgress }) {
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

  const photoFrame = createPhotoFrame();
  photoFrame.scale.setScalar(0.7);
  photoFrame.position.set(-3.5, 2.52, -2.2);
  photoFrame.rotation.y = 0.8;
  registerItem(photoFrame);

  const stagedLoads = [
    {
      loader: createDesk,
      onResolve: (desk) => {
        desk.scale.setScalar(scaleDesk);
        desk.position.set(-2, 0, -2.5);
        registerItem(desk, { clickable: false });
      },
      label: "desk",
    },
    {
      loader: createCoffeeMug,
      onResolve: (mug) => {
        mug.scale.setScalar(scaleMug);
        mug.position.set(-0.5, 2.96, -2.5);
        registerItem(mug);
      },
      label: "coffee mug",
    },
    {
      loader: createAmazonBox,
      onResolve: (amazon) => {
        amazon.position.set(4.2, 0, 3.2);
        amazon.scale.setScalar(3);
        amazon.rotation.y = Math.PI / 2.5;
        registerItem(amazon, { clickable: true });
      },
      label: "amazon box",
    },
    {
      loader: createCat,
      onResolve: (cat) => {
        cat.scale.setScalar(scaleCat);
        cat.position.set(-1.2, -0.05, -1.4);
        registerItem(cat, { staticTransforms: false });
        if (onCat) onCat(cat);
      },
      label: "cat",
    },
    {
      loader: createPiano,
      onResolve: (piano) => {
        piano.scale.setScalar(scalePiano);
        piano.position.set(-4, 0, 2.3);
        piano.rotation.y = Math.PI / 2;
        registerItem(piano);
      },
      label: "piano",
    },
    {
      loader: createMacbook,
      onResolve: (computer) => {
        computer.scale.setScalar(scaleComputer);
        computer.position.set(-2, 3.15, -2.8);
        registerItem(computer);
      },
      label: "macbook",
    },
    {
      loader: createBambooPlant,
      onResolve: (plant) => {
        plant.scale.setScalar(scalePlant);
        plant.position.set(5, 0, -1);
        registerItem(plant);
      },
      label: "bamboo plant",
    },
    {
      loader: createLamp,
      onResolve: (lamp) => {
        lamp.scale.setScalar(scaleLamp);
        lamp.position.set(.95, 0, -3);
        lamp.rotation.y = -3.14159 / 2;
        lamp.userData.action = "toggleLampGlow";
        lamp.userData.hoverTransform = false;
        lamp.userData.skipDiscovery = true;
        registerItem(lamp);
      },
      label: "lamp",
    },
    {
      loader: createRug,
      onResolve: (rug) => {
        rug.scale.setScalar(scaleRug);
        rug.position.set(3, 0.01, 0);
        rug.rotation.y = 3.14159;
        registerItem(rug, { clickable: false });
      },
      label: "boho rug",
    },
    {
      loader: createPoster,
      onResolve: (poster) => {
        poster.scale.setScalar(scalePoster);
        poster.position.set(1.6, 3.9, -4.9);
        registerItem(poster);
      },
      label: "poster",
    },
    {
      loader: createPlayButton,
      onResolve: (playButton) => {
        playButton.position.set(-3.4, 3.8, -4.95);
        playButton.rotation.y = -3.14159 / 2;
        registerItem(playButton, { clickable: false });
      },
      label: "play button",
    },
    {
      loader: createChair,
      onResolve: (chair) => {
        chair.scale.setScalar(3.2);
        chair.position.set(-1.3, 0, 1);
        chair.rotation.y = 2;
        registerItem(chair);
      },
      label: "chair",
    },
    {
      loader: createWallShelf,
      onResolve: (shelf) => {
        shelf.scale.setScalar(scaleWallShelf);
        shelf.position.set(-5.6, 3, -0.4);
        shelf.rotation.y = Math.PI / 2;
        registerItem(shelf, { clickable: false });
      },
      label: "wall shelf",
    },
    {
      loader: createCinamaroll,
      onResolve: (cinamaroll) => {
        cinamaroll.scale.setScalar(scaleCinamaroll);
        cinamaroll.position.set(-5.6, 2.85, -2.45);
        cinamaroll.rotation.y = Math.PI / 2;
        registerItem(cinamaroll, { clickable: true });
      },
      label: "cinamaroll",
    },
    {
      loader: createBadtz,
      onResolve: (badtz) => {
        badtz.scale.setScalar(scaleBadtz);
        badtz.position.set(-5.4, 3.08, -1.5);
        badtz.rotation.y = Math.PI / 2;
        registerItem(badtz, { clickable: true });
      },
      label: "badtz",
    },
    {
      loader: createJohn,
      onResolve: (john) => {
        john.position.set(-5.55, 4.5, -0.81);
        john.scale.setScalar(2);
        john.rotation.y = (Math.PI / 4) * 3;
        john.rotation.x = Math.PI / 2;
        registerItem(john, { clickable: true });
      },
      label: "john",
    },
    {
      loader: createMagnolia,
      onResolve: (magnolia) => {
        magnolia.position.set(-3.2, 2.97, -2.8);
        registerItem(magnolia, { clickable: true });
      },
      label: "magnolia",
    },
  ];

  onProgress?.({ loaded: 0, total: stagedLoads.length, label: "room shell" });
  return scheduleRoomLoads(stagedLoads, onProgress);
}

async function scheduleRoomLoads(entries, onProgress) {
  const initialDelay = 80;
  const staggerMs = 140;
  const latePhaseIndex = Math.max(entries.length - 3, 0);
  let loaded = 0;

  await wait(initialDelay);

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const latePhase = index >= latePhaseIndex;
    await waitForIdle(700 + index * 120);
    await loadRoomEntry(entry);
    loaded += 1;
    onProgress?.({ loaded, total: entries.length, label: entry.label });

    if (index < entries.length - 1) {
      await wait(latePhase ? 260 : staggerMs);
    }
  }
}

export function addRoomShell(scene) {
  const group = new THREE.Group();

  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.65,
    metalness: 0.05,
    emissive: 0x8b6a4a,      // warm brown, not white
    emissiveIntensity: 0.12, // small lift only — let the key light do the shading
  });
  // Rounded floor — soft pillowy edges. Radius is near half the 0.6 thickness
  // so the top/bottom edges read as a generous bevel; the flat top stays at y=0
  // (interior is flat, so items still sit correctly).
  const floor = new THREE.Mesh(new RoundedBoxGeometry(12, 0.6, 10, 6, 0.28), floorMat);
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
    emissive: new THREE.Color(0xf7d2dc),
    emissiveIntensity: 0.1,
  });
  // The back and side walls are each extended by one wall-thickness toward the
  // corner so their rounded ends get buried inside the perpendicular wall. This
  // leaves a crisp 90° inner seam where the two walls meet, while every other
  // edge (tops, front-facing verticals) stays softly rounded. The old separate
  // corner filler is no longer needed — the overlap fills the junction.
  const backWall = new THREE.Mesh(new RoundedBoxGeometry(12.4, 6, 0.4, 6, 0.19), wallMat);
  backWall.position.set(-0.2, 2.4, -5.2);
  backWall.receiveShadow = true;
  group.add(backWall);

  const sideWall = new THREE.Mesh(new RoundedBoxGeometry(0.4, 6, 10.4, 6, 0.19), wallMat);
  sideWall.position.set(-6.2, 2.4, -0.2);
  sideWall.receiveShadow = true;
  group.add(sideWall);

  lockStaticTransforms(group);
  scene.add(group);
}

async function loadRoomEntry(entry) {
  try {
    const object = await entry.loader();
    await waitForIdle(500);
    entry.onResolve(object);
  } catch (error) {
    console.error(`Failed to add ${entry.label}`, error);
  }
}

function lockStaticTransforms(group) {
  group.updateMatrixWorld(true);
  group.traverse((child) => {
    child.updateMatrix();
    child.matrixAutoUpdate = false;
    child.matrixWorldAutoUpdate = false;
  });
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function waitForIdle(timeout) {
  return new Promise((resolve) => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => resolve(), { timeout });
      return;
    }
    window.setTimeout(resolve, 0);
  });
}
