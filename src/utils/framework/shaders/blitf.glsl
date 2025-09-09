#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform bool flipY;

uniform sampler2D input0;

void main() {
  vec2 uv = v_uv;
  if (flipY) {
    uv.y = 1.0 - uv.y;
  }
  outColor = texture(input0, uv);
}