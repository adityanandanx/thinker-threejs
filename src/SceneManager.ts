import { animate } from "motion";
import {
  AmbientLight,
  Clock,
  Color,
  FogExp2,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
  PlaneGeometry,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  AnaglyphEffect,
  FontLoader,
  TextGeometry,
} from "three/examples/jsm/Addons.js";
import { degToRad } from "three/src/math/MathUtils.js";
import { Cam } from "./objects/Cam";
import { Particle } from "./objects/Particle";
import { Sun } from "./objects/Sun";
import { UpdateableObject } from "./objects/types";
export class SceneManager {
  public scene = new Scene();
  public camera = new Cam();
  public cameraTarget = new Vector3();
  public clock = new Clock();
  public gltfLoader = new GLTFLoader();
  public fontLoader = new FontLoader();
  public updateableObjects: UpdateableObject[] = [];

  public renderer: WebGLRenderer;
  public controls: OrbitControls | undefined;
  public effect: AnaglyphEffect;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ antialias: true, canvas });
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.effect = new AnaglyphEffect(this.renderer);
    this.updateableObjects.push(this.camera);
    this.setup();
  }

  setup() {
    this.setupScene();
    this.setupRenderer();
    this.setupControls();
    this.addObjects();
    this.addLights();
  }

  setupScene() {
    this.scene.background = new Color(0x32936f);
    this.scene.fog = new FogExp2(0x32936f, 0.05);
  }

  setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;
    window.addEventListener("resize", this.onResize.bind(this), false);
  }

  setupControls() {
    if (!this.controls) return;
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.enableZoom = true;
    this.controls.enableRotate = true;
    // this.controls.autoRotate = true;
    this.controls.maxDistance = 20;
    this.controls.minDistance = 5;
    this.controls.autoRotateSpeed = 1;
    this.controls.minPolarAngle = degToRad(90);
    this.controls.maxPolarAngle = degToRad(90);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addLights() {
    const sun = new Sun();
    sun.addToScene(this.scene);
    this.updateableObjects.push(sun);

    const a = new AmbientLight(0xe1ffc2, 0.7);
    this.scene.add(a);
  }

  addObjects() {
    const plane = new Mesh(
      new PlaneGeometry(100, 100),
      new MeshStandardMaterial({ color: 0xffffff })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    plane.castShadow = false;
    this.scene.add(plane);

    this.gltfLoader.load(
      "/assets/models/thinker/the_thinker_by_auguste_rodin.glb",
      (gltf) => {
        gltf.scene.position.y = -2;
        gltf.scene.position.x = 0.75;
        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.traverse((c) => {
          if (c.isObject3D) {
            c.castShadow = true;
            c.receiveShadow = true;
            console.log(c.name);
            if (c.name === "Object_5") {
              animate(
                c.rotation,
                {
                  z: degToRad(360),
                },
                { duration: 2, repeat: Infinity, ease: "linear" }
              );
            }
          }
        });
        console.log(gltf.scene.children);

        this.scene.add(gltf.scene);
      }
    );

    this.fontLoader.load("/assets/fonts/Roboto Black_Italic.json", (font) => {
      const tGeo = new TextGeometry("think.", {
        font,
        size: 8,
        depth: 1,
      });
      tGeo.computeBoundingBox();
      if (!tGeo.boundingBox) return;
      const centerOffset =
        -0.5 * (tGeo.boundingBox.max.x - tGeo.boundingBox.min.x);
      const tMesh = new Mesh(tGeo, new MeshPhongMaterial({ color: 0xffffff }));
      tMesh.position.x = centerOffset;
      tMesh.position.y = -2;
      tMesh.position.z = -10;
      tMesh.rotation.x = 0;
      tMesh.rotation.y = Math.PI * 2;
      this.scene.add(tMesh);
      tMesh.castShadow = true;
      tMesh.receiveShadow = true;
    });

    const p = new Particle(
      2000,
      new Vector3(-15, -2, -15),
      new Vector3(15, 10, 15)
    );
    this.updateableObjects.push(p);
    p.addToScene(this.scene);
    // p.addDebugMesh(this.scene);
  }

  addEffects() {}

  update() {
    const dt = this.clock.getDelta();
    this.updateableObjects.forEach((o) => o.update(dt));
    this.controls?.update();
    this.effect.render(this.scene, this.camera);
  }
}
