import { createTexture, setTextureFromArray } from "twgl.js";
import type { TextureObject } from "./types";

function getAttachment8(gl: WebGLRenderingContext) {
  return {
    format: gl.RGBA,
    internalFormat: gl.RGBA8,
    type: gl.UNSIGNED_BYTE,
  };
}
function getAttachment16(gl: WebGL2RenderingContext) {
  return {
    format: gl.RGBA,
    internalFormat: gl.RGBA16F,
    type: gl.HALF_FLOAT,
  };
}
function getAttachment32(gl: WebGL2RenderingContext) {
  return {
    format: gl.RGBA,
    internalFormat: gl.RGBA32F,
    type: gl.FLOAT,
  };
}

export function getAttachment(
  gl: WebGLRenderingContext,
  format: "rgba8" | "rgba16" | "rgba32",
  filter: "linear" | "nearest" | "mipmap"
) {
  let attachment: any = {
    format: gl.RGBA,
    wrap: gl.CLAMP_TO_EDGE,
  };

  if (format == "rgba8") {
    attachment = getAttachment8(gl!);
  }
  if (format == "rgba16") {
    attachment = getAttachment16(gl! as WebGL2RenderingContext);
  }
  if (format == "rgba32") {
    attachment = getAttachment32(gl! as WebGL2RenderingContext);
  }

  if (filter == "linear") {
    attachment.min = gl.LINEAR;
    attachment.mag = gl.LINEAR;
  }
  if (filter == "nearest") {
    attachment.min = gl.NEAREST;
    attachment.mag = gl.NEAREST;
  }
  if (filter == "mipmap") {
    attachment.min = gl.LINEAR_MIPMAP_LINEAR;
    attachment.mag = gl.LINEAR;
  }

  return attachment;
}

export function prepareTextureData(data: number[][]) {
  const height = data.length;
  const width = data[0].length;
  const flat_data = new Float32Array(data.flat(2));
  return { flat_data, width, height };
}

export function createTextureObject(gl: WebGLRenderingContext, data: any) {
  const { flat_data, width, height } = prepareTextureData(data);

  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  const tex = createTexture(gl, {
    src: flat_data,
    width: width,
    height: height,
    format: gl.RGBA,
    internalFormat: (gl as WebGL2RenderingContext).RGBA32F,
    type: gl.FLOAT,
    min: gl.NEAREST,
    mag: gl.NEAREST,
    wrap: gl.CLAMP_TO_EDGE,
    baseLevel: 0,
    maxLevel: 0,
    auto: true,
  });
  return tex;
}

export function updateTextureObject(
  gl: WebGLRenderingContext,
  tex: TextureObject,
  data: any
) {
  const { flat_data, width, height } = prepareTextureData(data);

  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

  setTextureFromArray(gl, tex.tex, flat_data, {
    width,
    height,
    format: gl.RGBA,
    internalFormat: (gl as WebGL2RenderingContext).RGBA32F,
    type: gl.FLOAT,
    min: gl.NEAREST,
    mag: gl.NEAREST,
    wrap: gl.CLAMP_TO_EDGE,
    baseLevel: 0,
    maxLevel: 0,
    auto: true,
  });

  tex.width = width;
  tex.height = height;
}
