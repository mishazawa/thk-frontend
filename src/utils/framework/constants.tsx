import type { MakeShaderParams } from "./types";
import vertex_shader from "./shaders/blitv.glsl?raw";
import fragment_shader from "./shaders/blitf.glsl?raw";

export const BLIT_SHADER: MakeShaderParams = {
  vertex_shader,
  fragment_shader,
  width: 512,
  height: 512,
  uniforms: {
    flipY: false,
  },
  format: "rgba8",
  filter: "linear",
};
