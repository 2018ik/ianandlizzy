import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

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

const canvasWrap = document.getElementById("canvas-wrap");
const resetButton = document.getElementById("reset-view");
const modal = document.getElementById("item-modal");
const modalTitle = modal.querySelector(".modal-title");
const modalPreview = modal.querySelector(".modal-preview");
const modalBody = modal.querySelector(".modal-body");
const closeModalButton = document.getElementById("close-modal");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f4ee);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
canvasWrap.appendChild(renderer.domElement);
renderer.domElement.style.touchAction = "none";


const frustumSize = 20;
let camera = createCamera();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minZoom = 0.6;
controls.maxZoom = 10;
controls.maxPolarAngle = Math.PI * 0.48;
controls.minPolarAngle = Math.PI * 0.2;
controls.target.set(0, 2.2, 0);
controls.update();

const ambient = new THREE.AmbientLight(0xf7f0e9, 0.8);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(8, 12, 6);
sun.castShadow = true;
sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 30;
sun.shadow.camera.left = -12;
sun.shadow.camera.right = 12;
sun.shadow.camera.top = 12;
sun.shadow.camera.bottom = -12;
scene.add(sun);

const fill = new THREE.DirectionalLight(0xffd9c2, 0.4);
fill.position.set(-6, 6, -4);
scene.add(fill);

const room = createRoom();
scene.add(room);

const clickable = [];

function registerItem(group, { clickable: isClickable = true } = {}) {
  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  if (isClickable && group.userData && group.userData.title) {
    clickable.push(group);
  }
  scene.add(group);
}

const scaleDesk = 2;
const scaleBookshelf = 1.6;
const scaleComputer = 2;
const scalePlant = 4;
const scaleLamp = 1.4;
const scaleRug = 1.8;
const scalePoster = 1.4;
const scaleMug = 2.3;
const scaleCat = 1.4;
const scalePiano = 2.6;

const desk = createDesk();
desk.scale.setScalar(scaleDesk);
desk.position.set(-1.6, 0, -2);
registerItem(desk, { clickable: false });
createCoffeeMug()
  .then((mug) => {
    mug.scale.setScalar(scaleMug);
    mug.position.set(0, 2.46, -1.5);
    registerItem(mug);
  })
  .catch((error) => {
    console.error("Failed to add coffee mug", error);
  });

const deskAttachScale = 0.7 / scaleDesk;
const photoFrame = createPhotoFrame();
photoFrame.scale.setScalar(deskAttachScale);
photoFrame.position.set(-0.9, 1.22, 0);
photoFrame.rotation.y = .8;
desk.add(photoFrame);
photoFrame.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});
clickable.push(photoFrame);

createCat()
  .then((cat) => {
    cat.scale.setScalar(scaleCat);
    cat.position.set(-1.2, -.05, -1.4);
    registerItem(cat);
    breathingCat = cat;
  })
  .catch((error) => {
    console.error("Failed to add cat", error);
  });

createPiano()
  .then((piano) => {
    piano.scale.setScalar(scalePiano);
    piano.position.set(-4, 0, 2.3);
    piano.rotation.y = 3.14159/2
    registerItem(piano);
  })
  .catch((error) => {
    console.error("Failed to add piano", error);
  });

const bookshelf = createBookshelf();
bookshelf.scale.setScalar(scaleBookshelf);
bookshelf.position.set(3.1, 0, -2.4);
registerItem(bookshelf);

createMacbook()
  .then((computer) => {
    computer.scale.setScalar(scaleComputer);
    computer.position.set(-1.55, 3.08, -2);
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

const lamp = createLamp();
lamp.scale.setScalar(scaleLamp);
lamp.position.set(3.5, 0, 2.1);
registerItem(lamp);

const rug = createRug();
rug.scale.setScalar(scaleRug);
rug.position.set(-0.6, 0.02, 2.6);
registerItem(rug);

const poster = createPoster();
poster.scale.setScalar(scalePoster);
poster.position.set(1.0, 4.3, -4.2);
registerItem(poster);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let focusTween = null;
let popup = null;
let activeItem = null;
let breathingCat = null;

const popupScene = new THREE.Scene();
const popupCamera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
popupCamera.position.set(0, 0.6, 3.2);
popupCamera.lookAt(0, 0.6, 0);

const popupRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
popupRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
popupRenderer.setSize(1, 1, false);
popupRenderer.outputColorSpace = THREE.SRGBColorSpace;
popupRenderer.toneMapping = THREE.ACESFilmicToneMapping;
popupRenderer.toneMappingExposure = 1.05;
modalPreview.appendChild(popupRenderer.domElement);

const popupAmbient = new THREE.AmbientLight(0xffffff, 0.8);
popupScene.add(popupAmbient);
const popupKey = new THREE.DirectionalLight(0xffffff, 0.7);
popupKey.position.set(2, 3, 4);
popupScene.add(popupKey);

renderer.domElement.addEventListener("pointerdown", (event) => {
  if (!modal.classList.contains("hidden")) return;

  const bounds = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(clickable, true);

  if (!hits.length) return;

  const target = findClickable(hits[0].object);
  if (!target) return;

  openModal(target);
});

resetButton.addEventListener("click", () => {
  resetView();
});

closeModalButton.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

function createRoom() {
  const group = new THREE.Group();

  const floorMat = new THREE.MeshStandardMaterial({ color: 0xf2e7da });
  const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.6, 10), floorMat);
  floor.position.set(0, -0.3, 0);
  floor.receiveShadow = true;
  group.add(floor);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8f3ea });
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 0.4), wallMat);
  backWall.position.set(0, 2.7, -4.8);
  backWall.receiveShadow = true;
  group.add(backWall);

  const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 10), wallMat);
  sideWall.position.set(-5.8, 2.7, 0);
  sideWall.receiveShadow = true;
  group.add(sideWall);

  return group;
}

function findClickable(object) {
  let current = object;
  while (current) {
    if (current.userData && current.userData.title) return current;
    current = current.parent;
  }
  return null;
}

function openModal(target) {
  closeModal();
  activeItem = target;

  popup = cloneForPopup(target);
  popupScene.add(popup);
  const { scale, size } = centerPopup(popup);
  console.log("[popup] item:", target.userData?.title || target.name || "(unnamed)");
  console.log("[popup] scaled size:", size);
  console.log("[popup] scale:", scale);
  const popupBox = new THREE.Box3().setFromObject(popup);
  const popupBoxSize = new THREE.Vector3();
  const popupBoxCenter = new THREE.Vector3();
  popupBox.getSize(popupBoxSize);
  popupBox.getCenter(popupBoxCenter);
  console.log("[popup] box size:", popupBoxSize);
  console.log("[popup] box center:", popupBoxCenter);
  setPopupCameraForItem(size, target.userData?.previewAngle);
  console.log("[popup] camera:", {
    left: popupCamera.left,
    right: popupCamera.right,
    top: popupCamera.top,
    bottom: popupCamera.bottom,
    z: popupCamera.position.z,
  });

  modalTitle.textContent = target.userData.title;
  modalBody.textContent = target.userData.description;
  modal.classList.remove("hidden");
  controls.enabled = false;
  requestAnimationFrame(updatePopupSize);

  focusTween = {
    start: performance.now(),
    duration: 350,
    mode: "popup",
    fromScale: scale * 0.92,
    toScale: scale,
  };
}

function resetView() {
  closeModal();
  focusTween = {
    start: performance.now(),
    duration: 900,
    mode: "camera",
    fromPos: camera.position.clone(),
    toPos: new THREE.Vector3(8, 10, 8),
    fromTarget: controls.target.clone(),
    toTarget: new THREE.Vector3(0, 2.2, 0),
    fromZoom: camera.zoom,
    toZoom: 1.3,
  };
}

function createCamera() {
  const aspect = canvasWrap.clientWidth / canvasWrap.clientHeight;
  const camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    100
  );
  camera.position.set(8, 10, 8);
  camera.lookAt(0, 2.2, 0);
  return camera;
}

function onResize() {
  renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
  const aspect = canvasWrap.clientWidth / canvasWrap.clientHeight;
  camera.left = (frustumSize * aspect) / -2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = frustumSize / -2;
  camera.updateProjectionMatrix();
  updatePopupSize();
}

window.addEventListener("resize", onResize);

resetView();

function animate(time) {
  if (focusTween) {
    const elapsed = Math.min((time - focusTween.start) / focusTween.duration, 1);
    const eased = elapsed < 0.5 ? 4 * elapsed * elapsed * elapsed : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;

    if (focusTween.mode === "camera") {
      camera.position.lerpVectors(focusTween.fromPos, focusTween.toPos, eased);
      controls.target.lerpVectors(focusTween.fromTarget, focusTween.toTarget, eased);
      camera.zoom = THREE.MathUtils.lerp(focusTween.fromZoom, focusTween.toZoom, eased);
      camera.updateProjectionMatrix();
    } else if (focusTween.mode === "popup" && popup) {
      const scale = THREE.MathUtils.lerp(focusTween.fromScale, focusTween.toScale, eased);
      popup.scale.setScalar(scale);
    }

    if (elapsed === 1) {
      focusTween = null;
    }
  }

  if (popup && !modal.classList.contains("hidden")) {
    if (activeItem?.userData?.previewAngle !== "static") {
      popup.rotation.y += 0.005;
    }
    popupRenderer.render(popupScene, popupCamera);
  }

  if (breathingCat) {
    const t = time * 0.001;
    const breathe = 1.1 + Math.sin(t) * 0.06;
    breathingCat.scale.set(scaleCat, scaleCat * breathe, scaleCat);
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

function closeModal() {
  if (activeItem) {
    activeItem.visible = true;
  }
  if (popup) {
    popupScene.remove(popup);
    popup = null;
  }
  activeItem = null;
  modal.classList.add("hidden");
  controls.enabled = true;
}

function cloneForPopup(target) {
  const clone = target.clone(true);
  clone.position.set(0, 0, 0);
  clone.rotation.set(0, 0, 0);
  clone.updateMatrixWorld(true);
  clone.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = false;
    child.receiveShadow = false;
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material = child.material.map((mat) => mat.clone());
      } else {
        child.material = child.material.clone();
      }
    }
  });
  return clone;
}

function centerPopup(object) {
  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  console.log("[popup] raw size:", size);
  console.log("[popup] raw center:", center);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 1.8 / Math.max(maxDim, 0.001);
  const scaled = scale * 0.92;
  object.scale.setScalar(scaled);
  object.updateMatrixWorld(true);
  const scaledBox = new THREE.Box3().setFromObject(object);
  const scaledSize = new THREE.Vector3();
  const scaledCenter = new THREE.Vector3();
  scaledBox.getSize(scaledSize);
  scaledBox.getCenter(scaledCenter);
  console.log("[popup] scaled center:", scaledCenter);
  object.position.sub(scaledCenter);
  object.updateMatrixWorld(true);
  return { scale: scaled, size: scaledSize };
}

function updatePopupSize() {
  if (!modalPreview) return;
  const rect = modalPreview.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const size = Math.min(rect.width, rect.height);
  popupRenderer.setSize(size, size, false);
  popupCamera.aspect = 1;
  popupCamera.updateProjectionMatrix();
}

function getPopupDistance(size) {
  const fov = THREE.MathUtils.degToRad(popupCamera.fov);
  const height = Math.max(size.y, 0.001);
  const width = Math.max(size.x, 0.001);
  const fitHeight = (height * 0.5) / Math.tan(fov * 0.5);
  const fitWidth = (width * 0.5) / Math.tan(fov * 0.5);
  return Math.max(fitHeight, fitWidth) * 1.2 + size.z * 0.5;
}

function setPopupCameraForItem(size, previewAngle) {
  if (previewAngle === "static") {
    const distance = getPopupDistance(size);
    popupCamera.up.set(0, 1, 0);
    popupCamera.position.set(0, 0, distance);
    popupCamera.lookAt(0, 0, 0);
    popupCamera.updateProjectionMatrix();
    return;
  }

  if (previewAngle === "top") {
    const maxPlanar = Math.max(size.x, size.z, 0.001);
    const distance = Math.max(2, maxPlanar * 1.6);
    popupCamera.up.set(0, 0, -1);
    popupCamera.position.set(0, distance, 0.001);
    popupCamera.lookAt(0, 0, 0);
    popupCamera.updateProjectionMatrix();
    return;
  }

  const distance = getPopupDistance(size);
  popupCamera.up.set(0, 1, 0);
  popupCamera.position.set(0, 0, distance);
  popupCamera.lookAt(0, 0, 0);
  popupCamera.updateProjectionMatrix();
}
