import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import { projectPlate } from './layout';

// Crisp project screenshots in 3D. At a stop the real image sits on a thin
// dark plate; as soon as the scroll moves on, the plate fades and the
// particle copy of the same image (sampled on a matching grid) carries the
// morph to the next project. Particles are for travel, the plate for reading.

const BAR = 0.16;

export function createPlates(count) {
  const group = new THREE.Group();
  const disposables = [];
  const plates = Array.from({ length: count }, () => {
    const holder = new THREE.Group();
    const imageMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d121b,
      metalness: 0.6,
      roughness: 0.35,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const image = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), imageMaterial);
    const frame = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 0.05, 3, 0.03), frameMaterial);
    image.renderOrder = 2;
    frame.renderOrder = 1;
    holder.add(frame, image);
    group.add(holder);
    disposables.push(imageMaterial, frameMaterial, image.geometry, frame.geometry);
    return { holder, image, frame, imageMaterial, frameMaterial, aspect: 16 / 9 };
  });

  const layout = (portrait) => {
    plates.forEach((p, k) => {
      const { centre, width } = projectPlate(k, portrait);
      const height = width / p.aspect;
      p.holder.position.copy(centre);
      p.image.scale.set(width, height, 1);
      p.image.position.z = 0.031;
      p.frame.scale.set(width + 0.07, height + BAR + 0.07, 1);
      p.frame.position.set(0, BAR / 2, 0);
    });
  };

  return {
    group,
    layout,

    setImage(k, img) {
      const texture = new THREE.Texture(img);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
      plates[k].imageMaterial.map = texture;
      plates[k].imageMaterial.needsUpdate = true;
      plates[k].aspect = img.naturalWidth / img.naturalHeight;
      disposables.push(texture);
    },

    // rest[k]: 1 when project k's stop is settled, 0 once it is in transit.
    update(rest) {
      plates.forEach((p, k) => {
        const r = rest[k] || 0;
        p.holder.visible = r > 0.001;
        p.imageMaterial.opacity = p.imageMaterial.map ? r : 0;
        p.frameMaterial.opacity = r * 0.95;
        p.holder.scale.setScalar(0.97 + 0.03 * r);
      });
    },

    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}
