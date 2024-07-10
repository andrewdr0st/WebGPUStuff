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
        
    }
}