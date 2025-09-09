#version 300 es

precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform vec2 u_xy;
uniform float u_frame;

void main() {

  float dist = length(u_xy - v_uv) * 2.0;
  dist = sin(dist * 4.0 + u_frame * 0.1) * 0.5 + 0.5;

  // outColor = vec4(1.0, u_xy.x * dist, u_xy.y * dist, 1.0);
  outColor = vec4(vec3(1.0), 1.0);
}