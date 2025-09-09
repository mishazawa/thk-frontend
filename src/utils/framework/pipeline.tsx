import type { Engl } from ".";
import type { MakeShaderParams, ShaderProgram } from "./types";

export class Pipeline {
  shaders: Map<string, ShaderProgram>;
  framework: Engl;
  frame = 0;
  textures = {};

  constructor(framework: Engl) {
    this.shaders = new Map();
    this.framework = framework;
  }

  add(name: string, shader: MakeShaderParams) {
    this.shaders.set(name, this.framework.makeShader(shader));
  }

  init() {
    this.frame = 0;
  }

  update(newUniforms: Record<string, any> = {}) {
    const uniforms = {
      u_init: this.frame === 0,
      u_frame: this.frame,
      ...this.textures,
      ...newUniforms,
    };

    for (const [_, program] of this.shaders) {
      this.framework.setUniforms(program, {
        ...uniforms,
        u_res: [program.width, program.height],
      });
      this.framework.render(program);
    }
    this.frame += 1;
  }
}
