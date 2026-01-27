import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function createBookshelf() {
  const group = new THREE.Group();
  group.userData = {
    title: "Bookshelf",
    description: "A tall shelf packed with art books, travel zines, and tiny keepsakes from trips.",
  };

  const frameMat = new THREE.MeshStandardMaterial({ color: 0xd0a77d });
  const shelfMat = new THREE.MeshStandardMaterial({ color: 0xe0b88f });

  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.6, 0.5), frameMat);
  frame.position.set(0, 1.8, 0);
  group.add(frame);

  const shelfGeo = new THREE.BoxGeometry(1.4, 0.12, 0.45);
  const shelfHeights = [0.5, 1.3, 2.1, 2.9];
  shelfHeights.forEach((y) => {
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0, y, 0.02);
    group.add(shelf);
  });

  const bookColors = [0xff8c6b, 0xffc35c, 0x7ad0c3, 0xa56cc1, 0x5c7aff];
  const bookGeo = new THREE.BoxGeometry(0.18, 0.8, 0.3);
  for (let i = 0; i < 6; i += 1) {
    const book = new THREE.Mesh(
      bookGeo,
      new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length] })
    );
    book.position.set(-0.5 + i * 0.18, 0.9, 0.12);
    group.add(book);
  }

  const plantPot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.2, 0.3, 16),
    new THREE.MeshStandardMaterial({ color: 0xd58f6c })
  );
  plantPot.position.set(0.5, 3.15, 0.1);
  group.add(plantPot);

  const sprout = new THREE.Mesh(
    new THREE.ConeGeometry(0.18, 0.4, 12),
    new THREE.MeshStandardMaterial({ color: 0x79c36a })
  );
  sprout.position.set(0.5, 3.45, 0.1);
  group.add(sprout);

  return group;
}
