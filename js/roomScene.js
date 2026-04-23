import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { addRoomShell, createRegisterItem, populateRoom } from "./roomItems.js";
import { createHeart } from "./items/heart.js";

const MATERIAL_TEXTURE_KEYS = [
  "map",
  "alphaMap",
  "aoMap",
  "bumpMap",
  "clearcoatMap",
  "clearcoatNormalMap",
  "clearcoatRoughnessMap",
  "displacementMap",
  "emissiveMap",
  "envMap",
  "iridescenceMap",
  "iridescenceThicknessMap",
  "lightMap",
  "metalnessMap",
  "normalMap",
  "roughnessMap",
  "sheenColorMap",
  "sheenRoughnessMap",
  "specularColorMap",
  "specularIntensityMap",
  "thicknessMap",
  "transmissionMap",
];

const LAMP_GLOW_CONFIG = {
  // Move these first: the beam starts at position and points toward target.
  position: new THREE.Vector3(-1.5, 6, -3),
  target: new THREE.Vector3(-1.5, 0.9, -3),
  color: 0xffb45f,
  intensity: 2.2,
  distance: 5.5,
  angle: Math.PI * 0.14,
  penumbra: 0.9,
  decay: 1.6,
  beamLength: 3.4,
  beamRadius: 1.35,
  beamOpacity: 0.08,
};

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

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(getMainRendererPixelRatio());
  renderer.setSize(mountEl.clientWidth || window.innerWidth, mountEl.clientHeight || window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
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
    controls.rotateSpeed = 0.75;
    controls.zoomSpeed = 1.35;
    controls.enablePan = false;
    controls.minZoom = 0.85;
    controls.maxZoom = 2.6;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.minAzimuthAngle = -Math.PI * 0.08;
    controls.maxAzimuthAngle = Math.PI * 0.58;
    controls.target.set(0, 2.2, 0);
    controls.update();
  }

  const animatedLights = addLights(scene);
  const lampGlow = animatedLights[0] || null;
  addRoomShell(scene);

  const clickable = [];
  const fadingItems = [];
  const warmedTextures = new WeakSet();
  const warmedObjects = new WeakSet();
  const warmSceneObject = (object) => {
    if (!object) return;

    object.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (!material) return;
        MATERIAL_TEXTURE_KEYS.forEach((key) => {
          const texture = material[key];
          if (!texture || !texture.isTexture || warmedTextures.has(texture)) return;
          warmedTextures.add(texture);
          renderer.initTexture(texture);
        });
      });
    });

    if (warmedObjects.has(object) || typeof renderer.compileAsync !== "function") return;
    warmedObjects.add(object);
    renderer.compileAsync(object, camera, scene).catch(() => {
      warmedObjects.delete(object);
    });
  };
  const registerItem = createRegisterItem({
    scene,
    clickable,
    onRegisterItem,
    fadingItems,
    warmObject: warmSceneObject,
  });
  populateRoom({ registerItem, onCat });
  if (typeof renderer.compileAsync === "function") {
    renderer.compileAsync(scene, camera).catch(() => {});
  }

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
    renderer.setPixelRatio(getMainRendererPixelRatio());
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
    updateFadeIns,
    updateSceneMotion,
    toggleLampGlow,
    registerItem,
    onResize,
    heartRef: () => heartRef,
    heartSparkle: () => heartSparkle,
  };

  function updateFadeIns(time) {
    if (!fadingItems.length) return;

    for (let index = fadingItems.length - 1; index >= 0; index -= 1) {
      const entry = fadingItems[index];
      const progress = Math.min((time - entry.start) / entry.duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const scale = THREE.MathUtils.lerp(0.94, 1, eased);

      if (progress > 0 && !entry.group.visible) {
        entry.group.visible = true;
      }

      entry.group.scale.copy(entry.targetScale).multiplyScalar(scale);
      entry.group.position.lerpVectors(entry.startPosition, entry.targetPosition, eased);

      if (progress === 1) {
        entry.group.scale.copy(entry.targetScale);
        entry.group.position.copy(entry.targetPosition);
        entry.meshes.forEach((mesh) => {
          mesh.castShadow = true;
        });
        entry.onRevealComplete?.();
        fadingItems.splice(index, 1);
      }
    }
  }

  function updateSceneMotion(time) {
    const seconds = time * 0.001;
    animatedLights.forEach(({ light, beam, baseIntensity, baseOpacity, enabled }, index) => {
      if (!enabled) {
        light.intensity = 0;
        beam.material.opacity = 0;
        beam.visible = false;
        return;
      }

      light.visible = true;
      beam.visible = true;
      const pulse = 0.92 + Math.sin(seconds * 1.5 + index) * 0.08;
      light.intensity = baseIntensity * pulse;
      beam.material.opacity = baseOpacity * pulse;
    });
  }

  function toggleLampGlow(forceEnabled) {
    if (!lampGlow) return false;

    const enabled = typeof forceEnabled === "boolean" ? forceEnabled : !lampGlow.enabled;
    lampGlow.enabled = enabled;
    lampGlow.light.visible = enabled;
    lampGlow.beam.visible = enabled;

    if (!enabled) {
      lampGlow.light.intensity = 0;
      lampGlow.beam.material.opacity = 0;
    }

    return enabled;
  }
}

function addLights(scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 0.9);
  sun.position.set(8, 12, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 512;
  sun.shadow.mapSize.height = 512;
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

  return [addLampGlow(scene)];
}

function addLampGlow(scene) {
  const light = new THREE.SpotLight(
    LAMP_GLOW_CONFIG.color,
    LAMP_GLOW_CONFIG.intensity,
    LAMP_GLOW_CONFIG.distance,
    LAMP_GLOW_CONFIG.angle,
    LAMP_GLOW_CONFIG.penumbra,
    LAMP_GLOW_CONFIG.decay
  );
  light.position.copy(LAMP_GLOW_CONFIG.position);
  light.castShadow = false;
  light.visible = false;
  light.intensity = 0;

  const target = new THREE.Object3D();
  target.position.copy(LAMP_GLOW_CONFIG.target);
  scene.add(target);
  light.target = target;
  scene.add(light);

  const beamGeometry = new THREE.ConeGeometry(
    LAMP_GLOW_CONFIG.beamRadius,
    LAMP_GLOW_CONFIG.beamLength,
    48,
    1,
    true
  );
  beamGeometry.translate(0, -LAMP_GLOW_CONFIG.beamLength / 2, 0);
  const beamMaterial = new THREE.MeshBasicMaterial({
    color: LAMP_GLOW_CONFIG.color,
    transparent: true,
    opacity: LAMP_GLOW_CONFIG.beamOpacity,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const beam = new THREE.Mesh(beamGeometry, beamMaterial);
  beam.renderOrder = 999;
  beam.visible = false;
  beam.material.opacity = 0;
  beam.position.copy(LAMP_GLOW_CONFIG.position);
  const beamDirection = LAMP_GLOW_CONFIG.target.clone().sub(LAMP_GLOW_CONFIG.position).normalize();
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), beamDirection);
  scene.add(beam);

  return {
    light,
    beam,
    enabled: false,
    baseIntensity: LAMP_GLOW_CONFIG.intensity,
    baseOpacity: LAMP_GLOW_CONFIG.beamOpacity,
  };
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

function getMainRendererPixelRatio() {
  if (window.innerWidth <= 768) {
    return Math.min(window.devicePixelRatio, .8);
  }
  return Math.min(window.devicePixelRatio, 1);
}
