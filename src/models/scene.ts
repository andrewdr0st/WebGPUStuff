import { Triangle } from "./triangle";
import { Camera } from "./camera";
import { vec3, mat4 } from "gl-matrix";

export class Scene {
    triangles: Triangle[];
    player: Camera;
    objectData: Float32Array;
    triangleCount: number;

    constructor() {
        this.triangles = [];
        this.objectData = new Float32Array(16 * 1024);
        this.triangleCount = 0;

        for (let i = 0; i < 10; i++) {
            this.triangles.push(new Triangle([2, i - 5, 0], 0));

            let blankMatrix = mat4.create();
            for (let j = 0; j < 16; j++) {
                this.objectData[16 * i + j] = <number> blankMatrix.at(j);
            }
            this.triangleCount++;
        }

        this.player = new Camera([-2, 0, 0.5], 0, 0);
    }

    update() {
        let i = 0;
        this.triangles.forEach(
            (tri) => {
                tri.update();
                let model = tri.getModel();
                for (let j = 0; j < 16; j++) {
                    this.objectData[16 * i + j] = <number> model.at(j);
                }
                i++;
            }
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

    getTriangles(): Float32Array {
        return this.objectData;
    }
}
