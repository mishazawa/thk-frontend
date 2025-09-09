import type { MakeShaderParams } from "./types";

export const BLIT_SHADER: MakeShaderParams = {
  vertex_shader: `
  #version 300 es
  in vec2 position;
  out vec2 v_uv;
  void main() {
    v_uv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
    }
    `,
  fragment_shader: `
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
        `,
  width: 512,
  height: 512,
  uniforms: {
    flipY: false,
  },
  format: "rgba8",
  filter: "linear",
};
