struct TransformData {
    view: mat4x4<f32>,
    projection: mat4x4<f32>
};

struct ObjectData {
    model: array<mat4x4<f32>>
};
@binding(0) @group(0) var<uniform> transformUBO: TransformData;
@binding(1) @group(0) var tex: texture_2d<f32>;
@binding(2) @group(0) var samp: sampler;
@binding(3) @group(0) var<storage, read> objects: ObjectData;

struct Fragment {
    @builtin(position) Position : vec4<f32>,
    @location(0) TexCoord : vec2<f32>
};

@vertex
fn vs_main(
    @builtin(instance_index) ID: u32,
    @location(0) vertexPosition: vec3f,
    @location(1) vertexTexCoord: vec2f) -> Fragment {

    var output : Fragment;
    output.Position = transformUBO.projection * transformUBO.view * objects.model[ID] * vec4f(vertexPosition, 1.0);
    output.TexCoord = vertexTexCoord;

    return output;
}

@fragment
fn fs_main(@location(0) TexCoord: vec2f) -> @location(0) vec4f {
    return textureSample(tex, samp, TexCoord);
}