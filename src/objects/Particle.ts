import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
} from "three";
import { UpdateableObject } from "./types";

export class Particle implements UpdateableObject {
  public particlesMesh: Points;
  public bounds: [Vector3, Vector3];

  constructor(n: number, start: Vector3, end: Vector3) {
    this.bounds = [start, end];
    const geo = new BufferGeometry();
    const positions = new Float32Array(n * 3);
    const velocities = new Float32Array(n * 3);

    for (let i = 0; i < n; i += 3) {
      positions[i] = Math.random() * (end.x - start.x) + start.x;
      positions[i + 1] = Math.random() * (end.y - start.y) + start.y;
      positions[i + 2] = Math.random() * (end.z - start.z) + start.z;
    }

    for (let i = 0; i < n; i += 3) {
      // velocities[i] = Math.random() - 0.5;
      // velocities[i + 1] = 2 - 2 * Math.random();
      velocities[i + 2] = 5;
    }

    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("velocity", new BufferAttribute(velocities, 3));
    this.particlesMesh = new Points(geo, new PointsMaterial({ size: 0.05 }));
  }

  addToScene(scene: Scene) {
    scene.add(this.particlesMesh);
  }

  addDebugMesh(scene: Scene) {
    const [start, end] = this.bounds;
    const box = new Mesh(
      new BoxGeometry(end.x - start.x, end.y - start.y, end.z - start.z),
      new MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    );
    const r = new Vector3(start.x + end.x, start.y + end.y, start.z + end.z);
    r.multiplyScalar(0.5);
    box.position.add(r);
    scene.add(box);
  }

  resetPosOutsideBounds(pos: Vector3) {
    const [start, end] = this.bounds;
    if (
      pos.x < start.x ||
      pos.x > end.x ||
      pos.y < start.y ||
      pos.y > end.y ||
      pos.z < start.z ||
      pos.z > end.z
    ) {
      return new Vector3(
        Math.random() * (end.x - start.x) + start.x,
        Math.random() * (end.y - start.y) + start.y,
        Math.random() * (end.z - start.z) + start.z
      );
    }
    return pos;
  }

  update(dt: number) {
    const geo = this.particlesMesh.geometry;
    const positions = geo.getAttribute("position");
    const velocities = geo.getAttribute("velocity");
    for (let i = 0; i < positions.count; i++) {
      const px = positions.getX(i) + velocities.getX(i) * dt;
      const py = positions.getY(i) + velocities.getY(i) * dt;
      const pz = positions.getZ(i) + velocities.getZ(i) * dt;

      const newPos = this.resetPosOutsideBounds(new Vector3(px, py, pz));

      const nx = newPos.x;
      const ny = newPos.y;
      const nz = newPos.z;

      positions.setXYZ(i, nx, ny, nz);
    }
    positions.needsUpdate = true;
  }
}
