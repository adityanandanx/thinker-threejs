import { Scene } from "three";

export interface UpdateableObject {
  update: (dt: number) => void;
  addToScene: (scene: Scene) => void;
}
