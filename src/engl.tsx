// This file contains the setup for the TWGL engine, including functions for creating buffers, loading shaders, and handling matrix calculations.

import * as twgl from "twgl.js";

const DEFAULT_PARAMS = {
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

export function engl_init() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  // document.body.appendChild(canvas);
  // canvas.style.border = '1px solid black';

  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("getContext failed. engl.tsx 12");
  const ext = gl.getExtension("EXT_color_buffer_float");
  if (!ext)
    throw new Error("EXT_color_buffer_float is required for RGBA32F FBOs.");

  const quad = twgl.primitives.createXYQuadBufferInfo(
    gl as WebGLRenderingContext
  );

  const engl = {
    gl: gl,
    canvas: canvas,
    quad: quad,
    dpr: 1,
  };

  const blit_shader = make_shader(engl, DEFAULT_PARAMS);
  const methods = {
    make_shader: (params: any | undefined) => make_shader(engl, params),
    set_uniforms: (shader: any, uniforms: any) =>
      set_uniforms(engl, shader, uniforms),
    make_texture: (data: any) => make_texture(engl, data),
    read_pixels: (shader: any) => read_pixels(engl, shader),
    render: (shader: any, instances: number | undefined) =>
      render(engl, shader, undefined, instances),
    render_to: (
      shader: any,
      instances: number | undefined,
      fbo: any,
      blend = false,
      depth = false
    ) => render(engl, shader, fbo, instances, blend, depth),
    resize: (w: any, h: any, dpr: number | undefined) =>
      resize(engl, w, h, dpr),
    clear: (
      shader: { fbo: { framebuffer: any } },
      r = 0,
      g = 0,
      b = 0,
      a = 0
    ) => clear(engl, shader.fbo.framebuffer, r, g, b, a),
    clear_depth: (
      shader: { fbo: { framebuffer: any } },
      r = 0,
      g = 0,
      b = 0,
      a = 0
    ) => clear_depth(engl, shader.fbo.framebuffer, r, g, b, a),

    blit: (tex: any) => {
      set_uniforms(engl, blit_shader, { input0: tex, flipY: true });
      render(engl, blit_shader, null);
    },
  };

  return { ...engl, ...methods };
}

function resize(
  engl: { gl?: any; canvas?: any; quad?: twgl.BufferInfo; dpr?: any },
  w: number,
  h: number,
  dpr = window.devicePixelRatio || 1
) {
  const { canvas } = engl;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  engl.dpr = dpr;
}

function render(
  engl: { gl: any; canvas?: HTMLCanvasElement; quad: any; dpr?: number },
  shader: {
    tex?: WebGLRenderbuffer | WebGLTexture;
    width: any;
    height: any;
    fbo: any;
    program: any;
    uniforms: any;
  },
  target_fbo: null | undefined,
  instances = 1,
  blend = false,
  depth = false
) {
  const { gl, quad } = engl;

  if (depth) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS); // or gl.LEQUAL if you draw coplanar geometry
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
    gl.enable(gl.BLEND);
    gl.blendEquationSeparate(gl.MAX, gl.MAX);
    gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
  }

  // console.log("Rendering to FBO:", render_target);
  gl.bindFramebuffer(gl.FRAMEBUFFER, render_target);
  gl.viewport(0, 0, width, height);
  gl.useProgram(shader.program.program);
  twgl.setBuffersAndAttributes(gl, shader.program, quad);
  twgl.setUniforms(shader.program, shader.uniforms);
  twgl.drawBufferInfo(gl, quad, gl.TRIANGLES, quad.numElements, 0, instances);
  // twgl.drawBufferInfo(gl, quad, gl.TRIANGLES);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  if (blend) {
    gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
    gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
    gl.disable(gl.BLEND);
  }

  if (depth) {
    gl.disable(gl.DEPTH_TEST);
  }

  // console.log(`Rendered to FBO: ${fbo ? fbo.framebuffer : 'default'}`)
}

function clear(
  engl: {
    gl: any;
    canvas?: HTMLCanvasElement;
    quad?: twgl.BufferInfo;
    dpr?: number;
  },
  target_fbo: any,
  r = 0,
  g = 0,
  b = 0,
  a = 0
) {
  const { gl } = engl;
  gl.bindFramebuffer(gl.FRAMEBUFFER, target_fbo || null);
  gl.clearColor(r, g, b, a);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function clear_depth(
  engl: {
    gl: any;
    canvas?: HTMLCanvasElement;
    quad?: twgl.BufferInfo;
    dpr?: number;
  },
  target_fbo: any,
  r = 0,
  g = 0,
  b = 0,
  a = 0
) {
  const { gl } = engl;
  gl.bindFramebuffer(gl.FRAMEBUFFER, target_fbo || null);
  gl.clearColor(r, g, b, a);
  gl.clear(gl.DEPTH_BUFFER_BIT);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function make_shader(
  engl: {
    gl: any;
    canvas?: HTMLCanvasElement;
    quad?: twgl.BufferInfo;
    dpr?: number;
  },
  params: {
    vertex_shader: string;
    fragment_shader: string;
    width: number;
    height: number;
    uniforms: Record<string, any>;
    format: string;
    filter: string;
  } = {
    vertex_shader: "",
    fragment_shader: "",
    width: 0,
    height: 0,
    uniforms: {},
    format: "",
    filter: "",
  }
) {
  const {
    vertex_shader = `
#version 300 es
in vec2 position;
out vec2 v_uv;
void main() {
  v_uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
    `,
    fragment_shader = `
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
    width = 512,
    height = 512,
    uniforms = {
      flipY: false,
    },
  } = params;

  const { gl } = engl;

  const attachment: any = {};
  if (params.format == "rgba8") {
    attachment.format = gl.RGBA;
    attachment.internalFormat = gl.RGBA8;
    attachment.type = gl.UNSIGNED_BYTE;
  } else if (params.format == "rgba16") {
    attachment.format = gl.RGBA;
    attachment.internalFormat = gl.RGBA16F;
    attachment.type = gl.HALF_FLOAT;
  } else if (params.format == "rgba32") {
    attachment.format = gl.RGBA;
    attachment.internalFormat = gl.RGBA32F;
    attachment.type = gl.FLOAT;
  }
  if (params.filter == "linear") {
    attachment.min = gl.LINEAR;
    attachment.mag = gl.LINEAR;
  } else if (params.filter == "nearest") {
    attachment.min = gl.NEAREST;
    attachment.mag = gl.NEAREST;
  } else if (params.filter == "mipmap") {
    attachment.min = gl.LINEAR_MIPMAP_LINEAR;
    attachment.mag = gl.LINEAR;
  }
  attachment.wrap = gl.CLAMP_TO_EDGE;
  // attachment.auto = true;

  const attachments = [attachment, { format: gl.DEPTH_COMPONENT16 }];
  const fbo = twgl.createFramebufferInfo(gl, attachments, width, height);
  const program = twgl.createProgramInfo(gl, [vertex_shader, fragment_shader]);

  return {
    tex: fbo.attachments[0],
    width: fbo.width,
    height: fbo.height,
    fbo: fbo,
    program: program,
    uniforms: uniforms,
  };
}

function set_uniforms(
  _engl: {
    gl: WebGL2RenderingContext | null;
    canvas: HTMLCanvasElement;
    quad: twgl.BufferInfo;
    dpr: number;
  },
  shader: {
    tex?: WebGLRenderbuffer | WebGLTexture;
    width?: number;
    height?: number;
    fbo?: twgl.FramebufferInfo;
    program?: twgl.ProgramInfo;
    uniforms: any;
  },
  uniforms: { input0: any; flipY: boolean }
) {
  Object.assign(shader.uniforms, uniforms);
}

function make_texture(
  engl: {
    gl: any;
    canvas?: HTMLCanvasElement;
    quad?: twgl.BufferInfo;
    dpr?: number;
  },
  data: any
) {
  // data = array [H x W x 4]
  const { gl } = engl;

  const params = {
    format: gl.RGBA,
    internalFormat: gl.RGBA32F,
    type: gl.FLOAT,
    min: gl.NEAREST,
    mag: gl.NEAREST,
    wrap: gl.CLAMP_TO_EDGE,
    auto: false,
    baseLevel: 0,
    maxLevel: 0,
  };

  function prepare_data(data: any[]) {
    const height = data.length;
    const width = data[0].length;
    const flat_data = new Float32Array(data.flat(2));
    return { flat_data, width, height };
  }

  function create_texture(data: any) {
    const { flat_data, width, height } = prepare_data(data);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    const tex = twgl.createTexture(gl, {
      src: flat_data,
      width: width,
      height: height,
      ...params,
      auto: true,
    });
    return tex;
  }

  const tex = create_texture(data);
  const { width, height } = prepare_data(data);
  const tex_obj = {
    tex,
    width,
    height,
    update: update_data,
  };

  function update_data(data: any) {
    const { flat_data, width, height } = prepare_data(data);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    twgl.setTextureFromArray(gl, tex_obj.tex, flat_data, {
      width,
      height,
      ...params,
      auto: true,
    });

    tex_obj.width = width; // keep your bookkeeping in sync
    tex_obj.height = height;
  }

  return tex_obj;
}

function read_pixels(
  engl: {
    gl: any;
    canvas?: HTMLCanvasElement;
    quad?: twgl.BufferInfo;
    dpr?: number;
  },
  shader: { fbo: any }
) {
  const { gl } = engl;
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
