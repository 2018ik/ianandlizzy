import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { addRoomShell, createRegisterItem, populateRoom } from "./roomItems.js";
import { createHeart } from "./items/heart.js";

export function createRoomScene({
  mountEl,
  background = 0xf7f4ee,
  enableControls = false,
  onCat,
  onRegisterItem,
  pointerEvents = true,
  includeHeart = false,
} = {}) {
  if (!mountEl) {
    throw new Error("createRoomScene requires mountEl");
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(background);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mountEl.clientWidth || window.innerWidth, mountEl.clientHeight || window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.domElement.style.pointerEvents = pointerEvents ? "auto" : "none";
  mountEl.appendChild(renderer.domElement);

  const frustumSize = 20;
  const camera = createCamera(mountEl, frustumSize);

  let controls = null;
  if (enableControls) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minZoom = 0.6;
    controls.maxZoom = 10;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.target.set(0, 2.2, 0);
    controls.update();
  }

  addLights(scene);
  addRoomShell(scene);

  const clickable = [];
  const registerItem = createRegisterItem(scene, clickable, onRegisterItem);
  populateRoom({ registerItem, onCat });

  let heartRef = null;
  let heartSparkle = null;
  if (includeHeart) {
    createHeart()
      .then((heart) => {
        heart.position.set(0, 5, 0);
        heart.scale.setScalar(2);
        heart.traverse((child) => {
          if (!child.isMesh || !child.material) return;
          if (Array.isArray(child.material)) {
            child.material = child.material.map((mat) => {
              const clone = mat.clone();
              clone.metalness = 0.05;
              clone.roughness = 0.1;
              if (clone.emissive) {
                clone.emissive.set(0xff3b5c);
                clone.emissiveIntensity = 0.7;
              }
              return clone;
            });
          } else {
            child.material = child.material.clone();
            child.material.metalness = 0.05;
            child.material.roughness = 0.1;
            if (child.material.emissive) {
              child.material.emissive.set(0xff3b5c);
              child.material.emissiveIntensity = 0.7;
            }
          }
        });
        heartRef = heart;
        heartSparkle = new THREE.PointLight(0xff5a6b, 1.2, 0, 0);
        heartSparkle.castShadow = false;
        heartSparkle.position.set(0, 4, 0);
        heart.add(heartSparkle);
        scene.add(heart);
      })
      .catch((error) => {
        console.error("Failed to add heart", error);
      });
  }

  function onResize() {
    const width = mountEl.clientWidth || window.innerWidth;
    const height = mountEl.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    const aspect = width / height;
    camera.left = (frustumSize * aspect) / -2;
    camera.right = (frustumSize * aspect) / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", onResize);

  return {
    scene,
    camera,
    renderer,
    controls,
    clickable,
    registerItem,
    onResize,
    heartRef: () => heartRef,
    heartSparkle: () => heartSparkle,
  };
}

function addLights(scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 1.0);
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

  const fill = new THREE.DirectionalLight(0xffffff, 0.35);
  fill.position.set(-6, 6, -4);
  scene.add(fill);
}

function createCamera(mountEl, frustumSize) {
  const width = mountEl.clientWidth || window.innerWidth;
  const height = mountEl.clientHeight || window.innerHeight;
  const aspect = width / height;
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
