import { Triangle } from "./triangle";
import { Camera } from "./camera";

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

    getPlayer(): Camera {
        return this.player
    }

    getTriangles(): Triangle[] {
        return this.triangles;
    }
}
