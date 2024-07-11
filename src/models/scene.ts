import { Triangle } from "./triangle";
import { Camera } from "./camera";
import { vec3 } from "gl-matrix";

export class Scene {
    triangles: Triangle[];
    player: Camera;

    constructor() {
        this.triangles = [];
        this.triangles.push(new Triangle([2, 0, 0], 0));

        this.player = new Camera([-2, 0, 0.5], 0, 0);
    }

    update() {
        this.triangles.forEach(
            (tri) => tri.update()
        );

        this.player.update();
    }

    spinPlayer(dx: number, dy: number) {
        this.player.eulers[2] -= dx;
        this.player.eulers[2] % 360;
        this.player.eulers[1] = Math.min(89, Math.max(-89, this.player.eulers[1] + dy));
    }

    movePlayer(forwards: number, right: number) {
        vec3.scaleAndAdd(this.player.position, this.player.position, this.player.forwards, forwards);
        vec3.scaleAndAdd(this.player.position, this.player.position, this.player.right, right);
    }

    getPlayer(): Camera {
        return this.player
    }

    getTriangles(): Triangle[] {
        return this.triangles;
    }
}
