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
const discoveryLabel = document.getElementById("discovery-label");
const discoveryCount = document.getElementById("discovery-count");
const discoveryBar = document.getElementById("discovery-bar");
const discoveryReset = document.getElementById("discovery-reset");
const discoveryProgress = document.querySelector(".discovery-progress");

let breathingCat = null;
let breathingCatBaseScale = 1;
const discoveredItems = new Set();
const discoverableItems = new Set();
const popupCache = new WeakMap();
const hoverStates = new Map();

const { scene, camera, renderer, controls, clickable, updateFadeIns, updateSceneMotion, toggleLampGlow } = createRoomScene({
  mountEl: canvasWrap,
  enableControls: true,
  onCat: (cat) => {
    breathingCat = cat;
    breathingCatBaseScale = cat.scale.x || 1;
  },
  onRegisterItem: (item) => {
    const title = item?.userData?.title;
    if (!title) return;
    if (!item.userData.skipDiscovery) {
      discoverableItems.add(title);
    }
    ensureHoverState(item);
    updateDiscoveryProgress();
  },
});
renderer.domElement.style.touchAction = "none";
renderer.domElement.addEventListener("contextmenu", (event) => event.preventDefault());
document.getElementById("app")?.addEventListener("selectstart", (event) => event.preventDefault());
document.getElementById("app")?.addEventListener("contextmenu", (event) => event.preventDefault());

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let focusTween = null;
let popup = null;
let activeItem = null;
let hoveredItem = null;
let pointerIsInside = false;
let pointerDown = null;
let lastFrameTime = performance.now();

updateDiscoveryProgress();

const popupScene = new THREE.Scene();
const popupCamera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
popupCamera.position.set(0, 0.6, 3.2);
popupCamera.lookAt(0, 0.6, 0);

const popupRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
popupRenderer.setPixelRatio(getPopupRendererPixelRatio());
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

renderer.domElement.addEventListener("pointermove", (event) => {
  if (!modal.classList.contains("hidden")) return;
  pointerIsInside = true;
  updatePointerFromEvent(event);
});

renderer.domElement.addEventListener("pointerleave", () => {
  pointerIsInside = false;
  pointerDown = null;
  setHoveredItem(null);
});

renderer.domElement.addEventListener("pointerdown", (event) => {
  if (!modal.classList.contains("hidden")) return;
  pointerIsInside = true;
  updatePointerFromEvent(event);
  pointerDown = {
    x: event.clientX,
    y: event.clientY,
  };
});

renderer.domElement.addEventListener("pointerup", (event) => {
  if (!modal.classList.contains("hidden") || !pointerDown) return;
  updatePointerFromEvent(event);

  const moved = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
  pointerDown = null;
  if (moved > 7) return;

  const target = raycastClickable();
  if (!target) return;

  handleClickableTarget(target);
});

resetButton.addEventListener("click", () => {
  resetView();
});

discoveryReset?.addEventListener("click", () => {
  discoveredItems.clear();
  updateDiscoveryProgress();
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

function updatePointerFromEvent(event) {
  const bounds = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
}

function raycastClickable() {
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(clickable, true);
  if (!hits.length) return null;
  return findClickable(hits[0].object);
}

function updateHoveredItem() {
  if (!pointerIsInside || !modal.classList.contains("hidden")) {
    setHoveredItem(null);
    return;
  }

  setHoveredItem(raycastClickable());
}

function setHoveredItem(target) {
  if (hoveredItem === target) return;

  if (hoveredItem && hoverStates.has(hoveredItem)) {
    hoverStates.get(hoveredItem).target = 0;
  }

  hoveredItem = target;
  renderer.domElement.style.cursor = hoveredItem ? "pointer" : "";

  if (hoveredItem) {
    ensureHoverState(hoveredItem).target = 1;
  }
}

function ensureHoverState(item) {
  let state = hoverStates.get(item);
  if (state) return state;

  state = {
    basePosition: item.position.clone(),
    baseScale: item.scale.clone(),
    hover: 0,
    target: 0,
    animateTransform: item.userData?.hoverTransform !== false,
    lift: getHoverLift(item),
    scale: getHoverScale(item),
  };
  hoverStates.set(item, state);
  return state;
}

function getHoverLift(item) {
  const title = item?.userData?.title || "";
  if (title.includes("Poster") || title.includes("Frame")) return 0.025;
  if (title.includes("Piano")) return 0.035;
  return 0.08;
}

function getHoverScale(item) {
  const title = item?.userData?.title || "";
  if (title.includes("Poster") || title.includes("Frame")) return 1.04;
  if (title.includes("Piano")) return 1.03;
  return 1.08;
}

function updateHoverAnimations(delta) {
  const alpha = 1 - Math.pow(0.0008, Math.min(delta, 0.05));

  hoverStates.forEach((state, item) => {
    state.hover = THREE.MathUtils.lerp(state.hover, state.target, alpha);
    if (state.hover < 0.001 && state.target === 0) {
      state.hover = 0;
    }

    if (!state.animateTransform) return;

    item.position.y = state.basePosition.y + state.lift * state.hover;

    if (item !== breathingCat) {
      const scale = THREE.MathUtils.lerp(1, state.scale, state.hover);
      item.scale.copy(state.baseScale).multiplyScalar(scale);
    }

    item.updateMatrix();
    item.updateMatrixWorld(true);
  });
}

function resetHoverState(item) {
  const state = hoverStates.get(item);
  if (!state) return;

  state.hover = 0;
  state.target = 0;
  item.position.copy(state.basePosition);
  item.scale.copy(state.baseScale);
  item.updateMatrix();
  item.updateMatrixWorld(true);
}

function handleClickableTarget(target) {
  if (target.userData?.action === "toggleLampGlow") {
    setHoveredItem(null);
    toggleLampGlow();
    return;
  }

  openModal(target);
}

function openModal(target) {
  closeModal();
  setHoveredItem(null);
  resetHoverState(target);
  activeItem = target;
  markDiscovered(target);

  const popupEntry = getPopupEntry(target);
  popup = popupEntry.popup;
  popup.position.copy(popupEntry.position);
  popup.rotation.set(0, 0, 0);
  popup.scale.setScalar(popupEntry.scale * 0.92);
  popupScene.add(popup);
  setPopupCameraForItem(popupEntry.size, target.userData?.previewAngle);

  modalTitle.textContent = target.userData.title;
  modalBody.textContent = target.userData.description;
  modal.classList.remove("hidden");
  controls.enabled = false;
  requestAnimationFrame(updatePopupSize);

  focusTween = {
    start: performance.now(),
    duration: 350,
    mode: "popup",
    fromScale: popupEntry.scale * 0.92,
    toScale: popupEntry.scale,
  };
}

function markDiscovered(target) {
  const title = target?.userData?.title;
  if (!title) return;
  discoveredItems.add(title);
  updateDiscoveryProgress();
}

function updateDiscoveryProgress() {
  if (!discoveryCount || !discoveryBar || !discoveryLabel || !discoveryProgress) return;
  const total = discoverableItems.size;
  const discovered = discoveredItems.size;
  discoveryCount.textContent = `${discovered}/${total}`;
  const percent = total > 0 ? (discovered / total) * 100 : 0;
  discoveryBar.style.width = `${percent}%`;
  const isComplete = total > 0 && discovered === total;
  discoveryLabel.textContent = isComplete ? "All items discovered!" : "Items discovered";
  discoveryProgress.classList.toggle("is-complete", isComplete);
  if (discoveryReset) {
    discoveryReset.hidden = !isComplete;
  }
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
  const modalOpen = !modal.classList.contains("hidden");
  const delta = Math.max((time - lastFrameTime) / 1000, 0);
  lastFrameTime = time;

  updateFadeIns(time);
  updateSceneMotion(time);

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

  if (popup && modalOpen) {
    if (activeItem?.userData?.previewAngle !== "static") {
      popup.rotation.y += 0.005;
    }
    popupRenderer.render(popupScene, popupCamera);
  }

  if (!modalOpen && breathingCat) {
    const t = time * 0.001;
    const breathe = 1.1 + Math.sin(t) * 0.06;
    const base = breathingCatBaseScale || breathingCat.scale.x || 1;
    breathingCat.scale.set(base, base * breathe, base);
  }

  if (!modalOpen) {
    updateHoveredItem();
    updateHoverAnimations(delta);
    controls.update();
    renderer.render(scene, camera);
  } else {
    setHoveredItem(null);
  }
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
  clone.matrixAutoUpdate = true;
  clone.matrixWorldAutoUpdate = true;
  clone.updateMatrixWorld(true);
  clone.traverse((child) => {
    child.matrixAutoUpdate = true;
    child.matrixWorldAutoUpdate = true;
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

function getPopupEntry(target) {
  let entry = popupCache.get(target);
  if (entry) {
    return entry;
  }
  const popupClone = cloneForPopup(target);
  entry = centerPopup(popupClone, target);
  popupCache.set(target, entry);
  return entry;
}

function centerPopup(object, target) {
  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
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
  object.position.sub(scaledCenter);
  if (target?.userData?.popupOffsetY) {
    object.position.y += target.userData.popupOffsetY;
  }
  object.updateMatrixWorld(true);

  return {
    popup: object,
    position: object.position.clone(),
    scale: scaled,
    size: scaledSize.clone(),
  };
}

function updatePopupSize() {
  if (!modalPreview) return;
  const rect = modalPreview.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  popupRenderer.setPixelRatio(getPopupRendererPixelRatio());
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

function getPopupRendererPixelRatio() {
  if (window.innerWidth <= 768) {
    return Math.min(window.devicePixelRatio, 0.8);
  }
  return Math.min(window.devicePixelRatio, 1);
}
