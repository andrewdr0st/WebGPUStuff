import { mat4 } from "gl-matrix";

export enum objectTypes {
    TRIANGLE,
    QUAD
}

export interface RenderData {
    viewTransfrom: mat4,
    modelTransforms: Float32Array,
    objectCounts: {[obj in objectTypes]: number}
}
