import { PerspectiveCamera, Raycaster, Scene, Vector2, Vector3 } from "three";
import { UpdateableObject } from "./types";
import { animate, scroll } from "motion";

export class Cam extends PerspectiveCamera implements UpdateableObject {
  mouse = new Vector2();
  lookAtTarget = new Vector3();
  raycaster = new Raycaster();

  constructor() {
    super(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.setupCamera();
  }

  setupCamera() {
    this.position.z = 8;
    this.position.x = 0;
    this.lookAt(this.lookAtTarget);

    const anim = animate(
      [
        [this.position, { z: 12 }, {}],
        [this.position, { z: 16 }, {}],
        [this.position, { z: 24 }, {}],
        [this.position, { z: 32 }, {}],
        [this.position, { x: -2, z: 16 }, {}],
        [this.position, { x: 0, z: 12 }, {}],
        [this.position, { x: 2, z: 8 }, {}],
      ],
      { repeat: 2, duration: 10 }
    );

    const target = document.getElementById("scroll-canvas")!;
    console.log(target);

    scroll(anim, {
      target,
      offset: ["start start", "end end"],
    });
  }

  onMouseMove(event: MouseEvent) {}

  update(dt: number) {
    // this.lookAt(this.lookAtTarget);
  }

  addToScene(scene: Scene) {}
}
