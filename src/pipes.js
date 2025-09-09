export function Style(engl, params) {
  const pipe = new Map();

  pipe.set(
    "out",
    engl.make_shader({
      fragment_shader: `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform vec2 u_xy;
uniform float u_frame;
void main() {
      float dist = length(u_xy - v_uv)*2.0;
      dist = sin(dist*4.0+u_frame*0.1)*0.5+0.5;

    outColor = vec4(1.0, u_xy.x*dist, u_xy.y*dist, 1.0);
} `,
      width: 512,
      height: 512,
      format: "rgba8",
      filter: "linear",
    })
  );

  const textures = {};
  // for (const [name, program] of pipe) {
  //     textures["u_" + name] = program.tex;
  // }

  let frame = 0;
  function update(input = {}, init = false) {
    if (init) {
      frame = 0;
    }
    const { px, py } = input;

    const uniforms = {
      u_init: init,
      u_frame: frame,
      ...textures,
      ...input,
    };

    for (const [name, program] of pipe) {
      // clone uniforms, but drop the one matching this program's key
      const filteredUniforms = Object.fromEntries(
        Object.entries(uniforms).filter(([uName]) => uName !== name)
      );

      engl.set_uniforms(program, {
        ...filteredUniforms,
        u_res: [program.width, program.height],
      });

      engl.render(program);
    }

    frame += 1;
  }

  return {
    update: update,
    pipe: pipe,
  };
}
