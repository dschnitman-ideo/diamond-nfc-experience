"use client";

import { useEffect, useRef } from "react";

/**
 * A single WebGL fragment-shader sweep — one moving band of light with
 * a continuous Gaussian falloff (core + a separate, wider halo), a
 * slight per-channel offset for chromatic fringing, and a touch of
 * animated grain to kill banding. Replaces the earlier CSS
 * linear-gradient sweeps (glowSweeps.jsx): a handful of fixed color
 * stops reads as visibly "stepped" once blurred and blended, where a
 * shader can shape the exact same idea with a true smooth curve.
 *
 * Every visual difference between the five /glow-lab options is just a
 * different `preset` fed into this one shader — angle, width, speed,
 * color, chroma, grain — rather than five separate implementations.
 */

const VERTEX_SRC = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SRC = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_duration;
  uniform float u_angleDeg;
  uniform float u_coreWidth;
  uniform float u_haloWidth;
  uniform float u_coreGain;
  uniform float u_haloGain;
  uniform vec3 u_coreColor;
  uniform vec3 u_edgeColor;
  uniform vec3 u_haloColor;
  uniform float u_grain;
  uniform float u_chroma;
  uniform float u_startAt;
  uniform float u_endAt;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float gauss(float d, float sigma) {
    return exp(-(d * d) / (2.0 * sigma * sigma));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = uv - 0.5;
    p.x *= aspect;

    float rad = radians(u_angleDeg);
    float c = cos(rad);
    float s = sin(rad);
    vec2 rp = vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    float bandCoord = rp.x / aspect + 0.5;

    float progress = clamp(u_time / u_duration, 0.0, 1.0);
    float center = mix(u_startAt, u_endAt, progress);

    float dR = bandCoord + u_chroma - center;
    float dG = bandCoord - center;
    float dB = bandCoord - u_chroma - center;

    float coreR = gauss(dR, u_coreWidth) * u_coreGain;
    float coreG = gauss(dG, u_coreWidth) * u_coreGain;
    float coreB = gauss(dB, u_coreWidth) * u_coreGain;

    float halo = gauss(dG, u_haloWidth) * u_haloGain;
    float edgeMix = smoothstep(0.0, 1.0, coreG);

    vec3 core = vec3(coreR, coreG, coreB) * mix(u_edgeColor, u_coreColor, edgeMix);
    vec3 haloRGB = u_haloColor * halo;

    vec3 color = core + haloRGB;
    float alpha = clamp(max(color.r, max(color.g, color.b)), 0.0, 1.0);

    // Grain only where the light actually is (scaled by alpha) — off in
    // the empty parts of the frame, where it'd otherwise be an
    // invalid premultiplied pixel (visible color with zero alpha).
    float n = (hash(gl_FragCoord.xy + u_time * 61.0) - 0.5) * u_grain * alpha;
    color += n;
    alpha = clamp(alpha + n, 0.0, 1.0);

    gl_FragColor = vec4(max(color, vec3(0.0)), alpha);
  }
`;

function compile(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }
  return shader;
}

export default function ShaderSweep({ preset }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    // Real alpha transparency, not `mix-blend-mode: screen` + black
    // pixels-as-transparent: a blend-mode canvas layered over Framer
    // Motion's own composited (transform/opacity) siblings intermittently
    // broke painting of *those* siblings entirely — the diamond photo
    // would just fail to render for as long as this canvas was mounted.
    // Premultiplied real alpha composites normally, sidestepping that.
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true });
    if (!gl) return undefined;

    let program;
    try {
      const vertexShader = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC);
      const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
      program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`Program link error: ${gl.getProgramInfoLog(program)}`);
      }
    } catch (err) {
      console.error(err);
      return undefined;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // One full-screen triangle (covers the viewport, clipped by the
    // canvas) — cheaper than a quad, no visible seam since it's all past
    // the edges anyway.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {};
    [
      "u_resolution",
      "u_time",
      "u_duration",
      "u_angleDeg",
      "u_coreWidth",
      "u_haloWidth",
      "u_coreGain",
      "u_haloGain",
      "u_coreColor",
      "u_edgeColor",
      "u_haloColor",
      "u_grain",
      "u_chroma",
      "u_startAt",
      "u_endAt",
    ].forEach((name) => {
      uniforms[name] = gl.getUniformLocation(program, name);
    });

    function resize() {
      const parent = canvas.parentElement;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(parent.clientWidth * dpr);
      const height = Math.round(parent.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement);
    resize();

    const start = performance.now();
    let rafId;

    function frame(now) {
      const elapsed = (now - start) / 1000;
      gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.u_time, elapsed);
      gl.uniform1f(uniforms.u_duration, preset.duration);
      gl.uniform1f(uniforms.u_angleDeg, preset.angleDeg);
      gl.uniform1f(uniforms.u_coreWidth, preset.coreWidth);
      gl.uniform1f(uniforms.u_haloWidth, preset.haloWidth);
      gl.uniform1f(uniforms.u_coreGain, preset.coreGain);
      gl.uniform1f(uniforms.u_haloGain, preset.haloGain);
      gl.uniform3f(uniforms.u_coreColor, ...preset.coreColor);
      gl.uniform3f(uniforms.u_edgeColor, ...preset.edgeColor);
      gl.uniform3f(uniforms.u_haloColor, ...preset.haloColor);
      gl.uniform1f(uniforms.u_grain, preset.grain);
      gl.uniform1f(uniforms.u_chroma, preset.chroma);
      gl.uniform1f(uniforms.u_startAt, preset.startAt);
      gl.uniform1f(uniforms.u_endAt, preset.endAt);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (elapsed < preset.duration + 0.4) {
        rafId = requestAnimationFrame(frame);
      }
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      gl.deleteProgram(program);
    };
  }, [preset]);

  return (
    <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
  );
}
