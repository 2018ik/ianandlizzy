import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function createPhotoFrame() {
  const group = new THREE.Group();
  group.userData = {
    title: "Desk Photo",
    description: "Our trip to Nintendo World!",
    previewAngle: "static",
  };

  const frameMat = new THREE.MeshStandardMaterial({ color: 0xe9d8c4 });
  const insetMat = new THREE.MeshStandardMaterial({ color: 0xf7f2ea });
  const standMat = new THREE.MeshStandardMaterial({ color: 0xd7c2aa });

  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.9, 0.08), frameMat);
  frame.position.set(0, 0.5, 0);
  group.add(frame);

  const inset = new THREE.Mesh(new THREE.BoxGeometry(0.53, 0.78, 0.02), insetMat);
  inset.position.set(0, 0.5, 0.03);
  group.add(inset);

  const texture = new THREE.TextureLoader().load(new URL("../images/photo.jpg", import.meta.url).href);
  texture.colorSpace = THREE.SRGBColorSpace;
  const photoMat = new THREE.MeshBasicMaterial({ map: texture });
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.72), photoMat);
  photo.position.set(0, 0.5, 0.055);
  group.add(photo);


  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.2), standMat);
  foot.position.set(0, 0.06, -0.12);
  group.add(foot);
  return group;
}
