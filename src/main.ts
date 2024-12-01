import { animate, frame, scroll } from "motion";
import { SceneManager } from "./SceneManager";
import Lenis from "lenis";

const canvas = document.querySelector("canvas");

if (!canvas) throw new Error("Canvas not found");

const sceneManager = new SceneManager(canvas);
const lenis = new Lenis({
  autoRaf: true,
  duration: 0.6,
  infinite: true,
});

animate("#canvas", { opacity: [0, 1] }, { duration: 7 });

scroll(
  animate(
    "#quote",
    { opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 0.9] },
    { times: [0, 0.75, 0.9, 1] }
  ),
  {
    target: document.getElementById("quote-container")!,
    offset: ["start start", "end end"],
  }
);

frame.render((info) => {
  lenis.raf(info.timestamp);
  sceneManager.update();
}, true);
