import {
  createFramebufferInfo,
  createProgramInfo,
  drawBufferInfo,
  primitives,
  setBuffersAndAttributes,
  setUniforms,
  type BufferInfo,
} from "twgl.js";

import {
  createTextureObject,
  getAttachment,
  prepareTextureData,
} from "./utils";
import type { MakeShaderParams, ShaderProgram, TextureObject } from "./types";
import { BLIT_SHADER } from "./constants";

export class Engl {
  dpr = 1;
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext | null;
  quad: BufferInfo;
  blitShader: ShaderProgram;

  constructor(el: HTMLCanvasElement) {
    this.canvas = el;

    const gl = this.canvas.getContext("webgl2");

    if (!gl) throw new Error("Engl: getContext failed.");

    const ext = gl.getExtension("EXT_color_buffer_float");

    if (!ext)
      throw new Error(
        "Engl: EXT_color_buffer_float is required for RGBA32F FBOs."
      );

    this.gl = gl as WebGLRenderingContext;
    this.quad = primitives.createXYQuadBufferInfo(gl as WebGLRenderingContext);
    this.blitShader = this.makeShader(BLIT_SHADER);
  }

  blit(tex: TextureObject) {
    this.setUniforms(this.blitShader, { input0: tex, flipY: true });
    this.render(this.blitShader, null);
  }

  render(
    shader: ShaderProgram,
    target_fbo: null | undefined,
    instances = 1,
    blend = false,
    depth = false
  ) {
    const gl = this.gl;
    if (!gl) return;

    if (depth) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LESS);
      gl.clearDepth(1.0);
    }

    let render_target;
    if (target_fbo === undefined) {
      render_target = shader.fbo.framebuffer;
    } else {
      render_target = target_fbo;
    }
    const width = render_target ? shader.width : gl.drawingBufferWidth;
    const height = render_target ? shader.height : gl.drawingBufferHeight;

    if (blend) {
      const max = (gl as WebGL2RenderingContext).MAX;
      gl.enable(gl.BLEND);
      gl.blendEquationSeparate(max, max);
      gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, render_target);
    gl.viewport(0, 0, width, height);
    gl.useProgram(shader.program.program);
    setBuffersAndAttributes(gl, shader.program, this.quad);
    setUniforms(shader.program, shader.uniforms);
    drawBufferInfo(
      gl,
      this.quad,
      gl.TRIANGLES,
      this.quad.numElements,
      0,
      instances
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    if (blend) {
      gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
      gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
      gl.disable(gl.BLEND);
    }

    if (depth) {
      gl.disable(gl.DEPTH_TEST);
    }
  }

  makeShader(params: MakeShaderParams = BLIT_SHADER): ShaderProgram {
    const gl = this.gl;
    if (!gl) throw Error("makeShader: gl is not defined");

    const { width, height, vertex_shader, fragment_shader, uniforms } = params;

    const attachment = getAttachment(this.gl!, params.format, params.filter);

    const attachments = [attachment, { format: gl.DEPTH_COMPONENT16 }];

    const fbo = createFramebufferInfo(gl, attachments, width, height);
    const program = createProgramInfo(gl, [vertex_shader, fragment_shader]);

    return {
      tex: fbo.attachments[0],
      width: fbo.width,
      height: fbo.height,
      fbo,
      program,
      uniforms,
    };
  }

  resize(w: number, h: number, dpr = window.devicePixelRatio || 1) {
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.dpr = dpr;
  }

  clear(target_fbo: any, r = 0, g = 0, b = 0, a = 0) {
    const gl = this.gl;
    if (!gl) throw Error("clear: gl is not defined");

    gl.bindFramebuffer(gl.FRAMEBUFFER, target_fbo || null);
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  clearDepth(target_fbo: any, r = 0, g = 0, b = 0, a = 0) {
    const gl = this.gl;
    if (!gl) throw Error("clearDepth: gl is not defined");

    gl.bindFramebuffer(gl.FRAMEBUFFER, target_fbo || null);
    gl.clearColor(r, g, b, a);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  setUniforms(shader: ShaderProgram, uniforms: ShaderProgram["uniforms"]) {
    Object.assign(shader.uniforms, uniforms);
  }

  makeTexture(data: number[][]): TextureObject {
    // data = array [H x W x 4]
    const gl = this.gl;
    if (!gl) throw Error("makeTexture: gl is not defined");

    const tex = createTextureObject(gl, data);
    const { width, height } = prepareTextureData(data);

    return {
      tex,
      width,
      height,
    };
  }

  readPixels(shader: ShaderProgram) {
    const gl = this.gl!;

    const { fbo } = shader;

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.framebuffer);
    const width = fbo.width;
    const height = fbo.height;
    const pixels = new Float32Array(width * height * 4);
    gl.pixelStorei(gl.PACK_ALIGNMENT, 1);

    gl.readPixels(
      0,
      0, // x, y
      width,
      height, // width, height
      gl.RGBA, // format
      gl.FLOAT, // type
      pixels // destination array
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const array = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        row.push(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]);
      }
      array.push(row);
    }

    return array;
  }
}
