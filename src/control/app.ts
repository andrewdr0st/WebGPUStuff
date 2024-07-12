import { Renderer } from "../view/renderer";
import { Scene } from "../models/scene";
import $, { event } from "jquery"

export class App {
    canvas: HTMLCanvasElement;
    renderer: Renderer;
    scene: Scene;

    f: number = 0;
    r: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.scene = new Scene();

        $(document).on("keydown", (event) => {this.handleKeyPressed(event)});
        $(document).on("keyup", (event) => {this.handleKeyRelease(event)});

        this.canvas.onclick = () => {
            this.canvas.requestPointerLock();
        }
        this.canvas.addEventListener("mousemove", (event) => {this.handleMouseMoved(event)});
    }

    async initialize() {
        await this.renderer.Initialize();
    }

    run = () => {
        let running = true;

        this.scene.update();
        this.scene.movePlayer(this.f, this.r);
        this.renderer.render(this.scene.getPlayer(), this.scene.getTriangles(), this.scene.triangleCount);

        if (running) {
            requestAnimationFrame(this.run);
        }
    }

    handleKeyPressed(event: JQuery.KeyDownEvent) {
        if (event.code == "KeyW") {
            this.f = 0.02;
        }
        if (event.code == "KeyS") {
            this.f = -0.02;
        }
        if (event.code == "KeyA") {
            this.r = -0.02;
        }
        if (event.code == "KeyD") {
            this.r = 0.02;
        }
    }

    handleKeyRelease(event: JQuery.KeyUpEvent) {
        if (event.code == "KeyW") {
            this.f = 0;
        }
        if (event.code == "KeyS") {
            this.f = 0;
        }
        if (event.code == "KeyA") {
            this.r = 0;
        }
        if (event.code == "KeyD") {
            this.r = 0;
        }

    }

    handleMouseMoved(event: MouseEvent) {
        this.scene.spinPlayer(event.movementX / 5, event.movementY / -5);
    }
}