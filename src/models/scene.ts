import { Triangle } from "./triangle";
import { Quad } from "./quad";
import { Camera } from "./camera";
import { vec3, mat4 } from "gl-matrix";
import { objectTypes, RenderData } from "./definitions";

export class Scene {
    triangles: Triangle[];
    quads: Quad[];
    player: Camera;
    objectData: Float32Array;
    triangleCount: number;
    quadCount: number;

    constructor() {
        this.triangles = [];
        this.quads = [];
        this.objectData = new Float32Array(16 * 1024);
        this.triangleCount = 0;
        this.quadCount = 0;

        this.createTriangles();
        this.createQuads();

        this.player = new Camera([-2, 0, 0.5], 0, 0);
    }

    createTriangles() {
        for (let i = 0; i <= 10; i++) {
            this.triangles.push(new Triangle([2, i - 5, 0], 0));

            let blankMatrix = mat4.create();
            for (let j = 0; j < 16; j++) {
                this.objectData[16 * i + j] = <number> blankMatrix.at(j);
            }
            this.triangleCount++;
        }
    }

    createQuads() {
        let i = this.triangleCount;
        for (let x = -10; x <= 10; x++) {
            for (let y = -10; y <= 10; y++) {
                this.quads.push(new Quad([x, y, 0]));

                let blankMatrix = mat4.create();
                for (let j = 0; j < 16; j++) {
                    this.objectData[16 * i + j] = <number> blankMatrix.at(j);
                }
                i++;
                this.quadCount++;
            }
        }
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
        this.quads.forEach(
            (q) => {
                q.update();
                let model = q.getModel();
                for (let j = 0; j < 16; j++) {
                    this.objectData[16 * i + j] = <number> model.at(j);
                }
                i++;
            }
        )

        this.player.update();
    }

    spinPlayer(dx: number, dy: number) {
        this.player.eulers[2] -= dx;
        this.player.eulers[2] % 360;
        this.player.eulers[1] = Math.min(89, Math.max(-89, this.player.eulers[1] - dy));
    }

    movePlayer(forwards: number, right: number) {
        vec3.scaleAndAdd(this.player.position, this.player.position, this.player.forwards, forwards);
        vec3.scaleAndAdd(this.player.position, this.player.position, this.player.right, right);
    }

    getPlayer(): Camera {
        return this.player
    }

    getRenderables(): RenderData {
        return {
            viewTransfrom: this.player.getView(),
            modelTransforms: this.objectData,
            objectCounts: {
                [objectTypes.TRIANGLE]: this.triangleCount,
                [objectTypes.QUAD]: this.quadCount
            }
        }
    }
}
