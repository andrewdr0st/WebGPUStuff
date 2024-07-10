import shader from "./shaders.wgsl"
import { TriangleMesh } from "./triangle-mesh";
import { Material } from "./material"
import { mat4 } from "gl-matrix"

let t = 0.0;
let device : GPUDevice;
let context : GPUCanvasContext;
let pipeline : GPURenderPipeline;
let uniformBuffer : GPUBuffer;
let bindGroup : GPUBindGroup;
let triangleMesh : TriangleMesh;
let material : Material;

const Initialize = async() => {
    const canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("gfx-main");
    const adapter : GPUAdapter = <GPUAdapter> await navigator.gpu?.requestAdapter();
    device = <GPUDevice> await adapter?.requestDevice();
    context = <GPUCanvasContext> canvas.getContext("webgpu");
    const format : GPUTextureFormat = "bgra8unorm";
    context.configure({
        device: device,
        format: format
    });

    triangleMesh = new TriangleMesh(device);
    material = new Material();
    await material.initialize(device, "dist/img/wedidnt.png");

    uniformBuffer = device.createBuffer({
        size: 64 * 3,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: {}
            }, {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {}
            }, {
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {}
            }
        ]   
    });

    bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: { buffer: uniformBuffer }
            }, {
                binding: 1,
                resource: material.view
            }, {
                binding: 2,
                resource: material.sampler
            }
        ]
    });

    const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout]
    });

    pipeline = device.createRenderPipeline({
        vertex: {
            module: device.createShaderModule({
                code: shader
            }),
            entryPoint: "vs_main",
            buffers: [triangleMesh.bufferLayout]
        },
        fragment: {
            module: device.createShaderModule({
                code: shader
            }),
            entryPoint: "fs_main",
            targets: [{
                format: format
            }]
        },
        primitive: {
            topology: "triangle-list"
        },
        layout: pipelineLayout
    });

    render();
}

let render = () => {
    t += 0.025;
    if (t > Math.PI * 2) {
        t -= Math.PI * 2;
    }

    const projection = mat4.create();
    mat4.perspective(projection, Math.PI / 4, 800/600, 0.1, 10);

    const view = mat4.create();
    mat4.lookAt(view, [-2, 0, 2], [0, 0, 0], [0, 0, 1]);

    const model = mat4.create();
    mat4.rotate(model, model, t, [0, 0, 1]);

    device.queue.writeBuffer(uniformBuffer, 0, <ArrayBuffer>model);
    device.queue.writeBuffer(uniformBuffer, 64, <ArrayBuffer>view);
    device.queue.writeBuffer(uniformBuffer, 128, <ArrayBuffer>projection);

    const commandEncoder : GPUCommandEncoder = device.createCommandEncoder();
    const textureView : GPUTextureView = context.getCurrentTexture().createView();
    const renderPass : GPURenderPassEncoder = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureView,
            clearValue: {r: 0.5, g: 0.0, b: 0.25, a: 1.0},
            loadOp: "clear",
            storeOp: "store"
        }]
    });
    renderPass.setPipeline(pipeline);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.setVertexBuffer(0, triangleMesh.buffer);
    renderPass.draw(3, 1, 0, 0);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(render);
}

Initialize();

