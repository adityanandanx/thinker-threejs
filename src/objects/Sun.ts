import { DirectionalLight, Scene } from "three";
import { UpdateableObject } from "./types";

const SHADOW_MAP_WIDTH = 2048,
  SHADOW_MAP_HEIGHT = 1024;

export class Sun implements UpdateableObject {
  public light: DirectionalLight;

  constructor() {
    this.light = new DirectionalLight(0xe1ffc2, 10);
    this.light.castShadow = true;
    this.light.position.set(5, 5, 5);
    this.light.shadow.camera.top = 10;
    this.light.shadow.camera.bottom = -10;
    this.light.shadow.camera.left = -10;
    this.light.shadow.camera.right = 10;
    this.light.shadow.camera.near = 1;
    this.light.shadow.camera.far = 50;

    this.light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    this.light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
  }

  addToScene(scene: Scene) {
    scene.add(this.light);
  }

  update(dt: number) {}
}
