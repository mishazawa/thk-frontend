import type { FramebufferInfo, ProgramInfo } from "twgl.js";

export type MakeShaderParams = {
  vertex_shader: string;
  fragment_shader: string;
  width: number;
  height: number;
  uniforms: Record<string, any>;
  format: "rgba8" | "rgba16" | "rgba32";
  filter: "linear" | "nearest" | "mipmap";
};

export type ShaderProgram = {
  tex: WebGLRenderbuffer | WebGLTexture;
  width: number;
  height: number;
  fbo: FramebufferInfo;
  program: ProgramInfo;
  uniforms: Record<string, any>;
};

export type TextureObject = {
  tex: WebGLTexture;
  width: number;
  height: number;
};
