import {vec3, mat4} from "gl-matrix";
import { deg2rad } from "./math-stuff";

export class Camera {
    position: vec3;
    eulers: vec3;
    view!: mat4;
    forwards: vec3;
    right: vec3;
    up: vec3;

    constructor(position: vec3, theta: number, phi: number) {
        this.position = position;
        this.eulers = [0, phi, theta];
        this.forwards = vec3.create();
        this.right = vec3.create();
        this.up = vec3.create();
    }

    update() {
        this.forwards = [
            Math.cos(deg2rad(this.eulers[2])) * Math.cos(deg2rad(this.eulers[1])),
            Math.sin(deg2rad(this.eulers[2])) * Math.cos(deg2rad(this.eulers[1])),
            Math.sin(deg2rad(this.eulers[1]))
        ];

        vec3.cross(this.right, this.forwards, [0, 0, 1]);
        
        vec3.cross(this.up, this.right, this.forwards);

        let target: vec3 = vec3.create();
        vec3.add(target, this.position, this.forwards);

        this.view = mat4.create();
        mat4.lookAt(this.view, this.position, target, this.up);
    }

    getView(): mat4 {
        return this.view;
    }
}