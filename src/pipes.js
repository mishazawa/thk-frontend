import { imageToArray, canvasToArray } from "./utils";
import { simplex3d, fast_blur } from "./glsl_funs";

export function Style(engl, params) {

    const pipe = new Map();

    
    const text_canvas = document.createElement("canvas");
    text_canvas.width = params.width;
    text_canvas.height = params.height;

    const text_ctx = text_canvas.getContext("2d");
    // let font = new FontFace('custom', 'url(/fonts/SuisseIntl-Medium.ttf)');
    function set_text(text) {
      let dist = 150;
      let tsize = 120;

      let lines = text.split(" ");

      text_ctx.fillStyle = "black";
      text_ctx.fillRect(0, 0, text_canvas.width, text_canvas.height);
      text_ctx.font = `bold ${tsize}px SuisseIntl`;
      text_ctx.textAlign = "center";
      text_ctx.textBaseline = "middle";
      text_ctx.fillStyle = "white";

      let full_dist = dist * (lines.length - 1);
      let start_y = (text_canvas.height - full_dist) / 2;
      for (let line of lines) {
        text_ctx.fillText(line, text_canvas.width/2, start_y + dist * lines.indexOf(line));
      }
      const img_data = canvasToArray(text_canvas);
      src_tex.update(img_data);
      console.log("Loaded test image from", test_src_path);
    }

    const test_src_path = "/thk.png";
    const test_img = new Image();
    test_img.src = test_src_path;
    test_img.crossOrigin = "anonymous";
    const src_tex = engl.make_texture([[ [0,0,0,1] ]]); // placeholder 1x1 black
    console.log(test_img)

    // };

    pipe.set("feedback", engl.make_shader({
        fragment_shader: `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform vec2 u_xy;
uniform vec2 u_zw;
uniform float u_frame;
uniform sampler2D u_src;
uniform sampler2D u_feedend;
uniform sampler2D u_feedblur0;
uniform sampler2D u_feedblur;
uniform sampler2D u_feededge;

// Grow
uniform float u_g_blur;
uniform float u_g_edge;
uniform float u_g_keep;
uniform float u_g_noise;
// Displace
uniform float u_d_uv;
uniform float u_d_feed;
uniform float u_d_strength;
uniform float u_d_scale;
uniform float u_d_yoff;
// Fade
uniform float u_f_noise;
uniform float u_f_blur;
uniform float u_f_fade;

uniform float u_noise_scale;

${simplex3d}

void main() {

    vec2 noise_uv = (v_uv*2.0-1.0) * u_noise_scale * 10.0 * (1.0 - pow((1.0-u_zw.y), 0.25));
    float noise_speed = 0.2;
    float time = mod(float(u_frame)/30.0, 10000.0);

    // Displace
    vec4 feedblur0_col = texture(u_feedblur, v_uv);
    vec3 disp_npos = vec3(noise_uv*u_d_uv, time * noise_speed);
    disp_npos.z += u_d_feed * feedblur0_col.r * 1.0;
    vec2 disp = vec2(snoise(disp_npos), snoise(disp_npos + vec3(5.2,1.3,7.1)));
    vec2 disp_uv = ((v_uv*2.0-1.0)/(1.0+u_d_scale)*0.5+0.5) + disp * u_d_strength * 0.1 * u_zw.x + vec2(0.0, u_d_yoff*-0.1);
    disp_uv = clamp(disp_uv, 0.0, 1.0);

    // Grow
    vec4 feedback_col = texture(u_feedblur, disp_uv);
    vec4 grow_back = feedback_col * u_g_keep;
    vec4 grow_edge = texture(u_feededge, disp_uv);
    grow_edge *= u_g_edge*2.0;
    vec2 edge_npos = noise_uv * 1.0;
    float edge_mask = snoise(vec3(edge_npos, time * noise_speed)) * 0.5 + 0.5;
    edge_mask = mix(1.0-u_g_noise, 1.0, edge_mask);
    grow_edge *= edge_mask;
    
    vec4 grow_out = max(grow_back, grow_edge);
    //////

    // Fade
    vec4 feedblur_col0 = texture(u_feedblur0, v_uv);
    vec4 feedend_col0 = texture(u_feedend, v_uv);
    
    
    vec3 fade_npos = vec3(noise_uv, time * noise_speed);
    float fade_mask = snoise(fade_npos) * 0.5 + 0.5;
    vec4 fade_col = feedblur_col0;
    fade_mask = mix(1.0-u_f_noise, 1.0, fade_mask);
    fade_col *= fade_mask * u_f_fade;

    // Final mix

    vec4 mixed = max(fade_col, grow_out);
    vec4 src_col = texture(u_src, v_uv);
    mixed = max(mixed, src_col);
    mixed = clamp(mixed, 0.0, 1.0);
    outColor = mixed;

} `,    width: params.width, height: params.height, format: "rgba8", filter: "linear" }));

    pipe.set("feedend", engl.make_shader({
        fragment_shader: `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform vec2 u_xy;
uniform float u_frame;
uniform sampler2D u_src;
uniform sampler2D u_feedback;
void main() {
    outColor = texture(u_feedback, v_uv);
} `,    width: params.width, height: params.height, format: "rgba8", filter: "linear" }));

    pipe.set("feedblur0", engl.make_shader({
        fragment_shader: `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform vec2 u_res;
uniform sampler2D u_feedend;
uniform float u_f_blur;
` + fast_blur + `
void main() {
    vec4 blurred = fast_blur(u_feedend, v_uv, u_res, 16, 9, u_f_blur*6.0);
    outColor = vec4(blurred);
}
 `,    width: params.width, height: params.height, format: "rgba8", filter: "linear" }));

     pipe.set("feedblur", engl.make_shader({
        fragment_shader: `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform vec2 u_res;
uniform sampler2D u_feedend;
uniform float u_edge_blur;
uniform float u_g_blur;
` + fast_blur + `
void main() {
    vec4 blurred = fast_blur(u_feedend, v_uv, u_res, 16, 16, u_g_blur*16.0);
    outColor = vec4(blurred);
}
 `,    width: params.width, height: params.height, format: "rgba8", filter: "linear" }));

    pipe.set("feededge", engl.make_shader({
        fragment_shader: `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform sampler2D u_feedback;
uniform sampler2D u_feedblur;
// Controls
uniform float u_edgeStrength; // e.g. 1.0–5.0 (default 1.0)
uniform float u_edgeThreshold;    // e.g. 0.05–0.2  (default 0.1)
float luminance(vec3 c) {
    // Rec. 709 luma
    return dot(c, vec3(0.2126, 0.7152, 0.0722));
}
void main() {
    // Texel size from the source texture
    vec2 texSize   = vec2(textureSize(u_feedblur, 0));
    vec2 texel     = 1.0 / texSize;

    // Sample 3x3 neighborhood and convert to luminance
    float tl = luminance(texture(u_feedblur, v_uv + texel * vec2(-1.0, -1.0)).rgb);
    float  t = luminance(texture(u_feedblur, v_uv + texel * vec2( 0.0, -1.0)).rgb);
    float tr = luminance(texture(u_feedblur, v_uv + texel * vec2( 1.0, -1.0)).rgb);

    float  l = luminance(texture(u_feedblur, v_uv + texel * vec2(-1.0,  0.0)).rgb);
    float  c = luminance(texture(u_feedblur, v_uv + texel * vec2( 0.0,  0.0)).rgb);
    float  r = luminance(texture(u_feedblur, v_uv + texel * vec2( 1.0,  0.0)).rgb);

    float bl = luminance(texture(u_feedblur, v_uv + texel * vec2(-1.0,  1.0)).rgb);
    float  b = luminance(texture(u_feedblur, v_uv + texel * vec2( 0.0,  1.0)).rgb);
    float br = luminance(texture(u_feedblur, v_uv + texel * vec2( 1.0,  1.0)).rgb);

    // Sobel kernels
    float gx = -tl - 2.0*t - tr + bl + 2.0*b + br;
    float gy = -tl - 2.0*l - bl + tr + 2.0*r + br;

    // Gradient magnitude
    float mag = length(vec2(gx, gy));

    // Normalize & enhance
    // The 3x3 Sobel magnitude can be large; scale, then threshold smoothly
    float edge = mag * u_edgeStrength;
    edge = smoothstep(u_edgeThreshold, u_edgeThreshold + 0.1, edge);

    // White edges on black
    outColor = vec4(vec3(edge), 1.0);
}
 `,    width: params.width, height: params.height, format: "rgba8", filter: "linear" }));



    pipe.set("out", engl.make_shader({
        fragment_shader: `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform vec2 u_xy;
uniform float u_frame;
uniform sampler2D u_feedend;
uniform sampler2D u_feededge;
uniform sampler2D u_src;
vec3 palette_map(float col, vec3 p1, vec3 p2, vec3 p3, vec3 p4) {
    if (col < 0.33) {
        float t = smoothstep(0.0, 0.33, col);
        return mix(p1, p2, t);
    } else if (col < 0.66) {
        float t = smoothstep(0.33, 0.66, col);
        return mix(p2, p3, t);
    } else {
        float t = smoothstep(0.66, 1.0, col);
        return mix(p3, p4, t);
    }
}
void main() {
    float col = texture(u_feedend, v_uv).r;
    float src = texture(u_src, v_uv).r;
    col = max(col*0.8, src);
    vec3 color1 = palette_map(col,
      vec3(0.02, 0.1, 0.1),
      vec3(0.11, 0.42, 0.36),
      vec3(0.87, 0.9, 0.25),
      vec3(0.92, 0.94, 0.6)
      );
    vec3 color2 = palette_map(col,
      vec3(0.02, 0.0, 0.25),
      vec3(0.0, 0.22, 0.53),
      vec3(0.25, 0.75, 0.9),
      vec3(0.33, 0.88, 0.99)
      );
    vec3 color3 = palette_map(col,
      vec3(0.02, 0.075, 0.2),
      vec3(0.5, 0.0, 0.53),
      vec3(0.9, 0.25, 0.29),
      vec3(1.0, 1.0, 1.0)
      );
    vec3 color4 = palette_map(col,
      vec3(0.0, 0.0, 0.0),
      vec3(0.25, 0.2, 0.17),
      vec3(0.53, 0.33, 0.11),
      vec3(0.9, 0.76, 0.5)
      );
    vec3 mix_a = mix(color1, color2, u_xy.x);
    vec3 mix_b = mix(color3, color4, u_xy.x);
    vec3 final_color = mix(mix_a, mix_b, u_xy.y);
    // final_color = pow(final_color, vec3(0.4545)); // gamma 2.2
    outColor = vec4(final_color, 1.0);
} `,    width: params.width, height: params.height, format: "rgba8", filter: "linear" }));

        
    const textures = {
        u_src: src_tex.tex,
    };
    for (const [name, program] of pipe) {
        textures["u_" + name] = program.tex;
    }

    const feedparams00 = {
      u_g_blur: 0.28,
      u_g_edge: 0.54,
      u_g_keep: 0.93,
      u_g_noise: 0.7,
      u_d_uv: 0.72,
      u_d_feed: 0.1,
      u_d_strength: 0.11,
      u_d_scale: 0.005,
      u_d_yoff: 0.0,
      u_f_noise: 0.05,
      u_f_blur: 0.0,
      u_f_fade: 1.0
    };
    const feedparams01 = {
      u_g_blur: 0.78,
      u_g_edge: 1.3,
      u_g_keep: 0.92,
      u_g_noise: 1.0,
      u_d_uv: 0.0,
      u_d_feed: 0.0,
      u_d_strength: 0.0,
      u_d_scale: 0.0,
      u_d_yoff: 0.0,
      u_f_noise: 0.0,
      u_f_blur: 0.0,
      u_f_fade: 0.0
    };
    const feedparams10 = {
      u_g_blur: 1.0,
      u_g_edge: 1.3,
      u_g_keep: 0.97,
      u_g_noise: 1.0,
      u_d_uv: 0.34,
      u_d_feed: 0.0,
      u_d_strength: 0.31,
      u_d_scale: 0.01,
      u_d_yoff: 0.0,
      u_f_noise: 0.35,
      u_f_blur: 0.2,
      u_f_fade: 1.0
    };
    const feedparams11 = {
      u_g_blur: 0.35,
      u_g_edge: 0.61,
      u_g_keep: 0.98,
      u_g_noise: 1.0,
      u_d_uv: 0.16,
      u_d_feed: 0.92,
      u_d_strength: 0.36,
      u_d_scale: 0.01,
      u_d_yoff: 0.0,
      u_f_noise: 0.41,
      u_f_blur: 0.0,
      u_f_fade: 1.0
    };
    function mix_params(pA, pB, t) {
      const out = {};
      for (const key of Object.keys(pA)) {
        out[key] = (1.0 - t) * pA[key] + t * pB[key];
      }
      return out;
    }


    const params_defaults = {
        u_edgeStrength: 0.5,
        u_edgeThreshold: 0.0,
        u_edge_blur:8.0,
        u_feed_blur0: 4.0,
        u_noise_scale: 1.0
      };

    let frame = 0;
    function update(input = {}, init = false) {
        if (init) { frame = 0; }
        const { px, py } = input;

        let cross1 = mix_params(feedparams00, feedparams01, params.u_xy[0]);
        let cross2 = mix_params(feedparams10, feedparams11, params.u_xy[0]);
        let final_params = mix_params(cross1, cross2, params.u_xy[0]);

        const uniforms = {
          u_init: init,
          u_frame: frame,
          ...input,
          ...params,
          ...params_defaults,
          ...final_params
        };

        for (const [name, program] of pipe) {
          // clone uniforms, but drop the one matching this program's key
          const filteredTextures = Object.fromEntries(
            Object.entries(textures).filter(([uName]) => uName !== "u_"+name)
          );

          engl.set_uniforms(program, {
            ...filteredTextures,
            ...uniforms,
            u_res: [program.width, program.height],
          });

          engl.render(program);
        }
        
        frame += 1;

    }
    

    return {
        update: update,
        pipe: pipe,
        update_params: (new_params = {}) => {
            for (const [key, value] of Object.entries(new_params)) {
              params[key] = value;
              console.log(`Updated param ${key} to`, value);
            }
        },
        set_text: set_text,
    }

}
