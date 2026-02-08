import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import * as SkeletonUtils from "https://unpkg.com/three@0.160.0/examples/jsm/utils/SkeletonUtils.js";
import { createRoomScene } from "./roomScene.js";

const canvasWrap = document.getElementById("canvas-wrap");
const resetButton = document.getElementById("reset-view");
const modal = document.getElementById("item-modal");
const modalTitle = modal.querySelector(".modal-title");
const modalPreview = modal.querySelector(".modal-preview");
const modalBody = modal.querySelector(".modal-body");
const closeModalButton = document.getElementById("close-modal");

let breathingCat = null;
let breathingCatBaseScale = 1;

const { scene, camera, renderer, controls, clickable } = createRoomScene({
  mountEl: canvasWrap,
  enableControls: true,
  onCat: (cat) => {
    breathingCat = cat;
    breathingCatBaseScale = cat.scale.x || 1;
  },
});
controls.zoomSpeed = 10.0;
renderer.domElement.style.touchAction = "none";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let focusTween = null;
let popup = null;
let activeItem = null;

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

function onResize() {
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
    const base = breathingCatBaseScale || breathingCat.scale.x || 1;
    breathingCat.scale.set(base, base * breathe, base);
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
  const clone = SkeletonUtils.clone(target);
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
  if (activeItem?.userData?.popupOffsetY) {
    object.position.y += activeItem.userData.popupOffsetY;
  }
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
