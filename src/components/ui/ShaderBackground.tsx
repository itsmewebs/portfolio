"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    let animationFrameId: number;

    function resize() {
      if (!canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        if (gl) gl.viewport(0, 0, width, height);
      }
    }

    window.addEventListener("resize", resize);
    resize();

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Dynamic Shader based on theme
    const isDark = resolvedTheme === "dark";

    const fsSource = isDark
      ? `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // Lumina Digital Space Nebula
        vec3 color1 = vec3(0.063, 0.078, 0.082); // #101415
        vec3 color2 = vec3(0.235, 0.0, 0.569);   // #3c0091
        vec3 color3 = vec3(0.012, 0.259, 0.306); // #00424e
        vec3 color4 = vec3(0.043, 0.059, 0.063); // #0b0f10

        float t = u_time * 0.18;
        
        float w1 = sin(uv.x * 2.5 + t) * 0.5 + 0.5;
        w1 *= cos(uv.y * 1.8 - t * 0.4) * 0.5 + 0.5;
        
        float w2 = sin(uv.y * 3.0 - t * 0.6) * 0.5 + 0.5;
        w2 *= cos(uv.x * 2.2 + t * 0.3) * 0.5 + 0.5;
        
        float pattern = w1 * 0.6 + w2 * 0.4;
        
        vec3 finalColor = mix(color1, color4, uv.y);
        finalColor = mix(finalColor, color2, pattern * 0.25);
        finalColor = mix(finalColor, color3, w2 * 0.2);
        
        gl_FragColor = vec4(finalColor, 0.7);
      }
    `
      : `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // Nova Prism Soft Radiant Light Iridescence
        vec3 color1 = vec3(0.973, 0.980, 0.988); // Crisp slate white (#f8fafc)
        vec3 color2 = vec3(0.929, 0.914, 0.996); // Soft lavender tint (#ede9fe)
        vec3 color3 = vec3(0.878, 0.949, 0.996); // Soft sky tint (#e0f2fe)
        vec3 color4 = vec3(0.992, 0.922, 0.953); // Soft rose tint (#fce7f3)

        float t = u_time * 0.12;
        
        float w1 = sin(uv.x * 2.0 + t) * 0.5 + 0.5;
        w1 *= cos(uv.y * 1.5 - t * 0.3) * 0.5 + 0.5;
        
        float w2 = sin(uv.y * 2.5 - t * 0.4) * 0.5 + 0.5;
        w2 *= cos(uv.x * 1.8 + t * 0.2) * 0.5 + 0.5;
        
        vec3 finalColor = mix(color1, color2, w1 * 0.35);
        finalColor = mix(finalColor, color3, w2 * 0.3);
        finalColor = mix(finalColor, color4, (1.0 - uv.y) * 0.2);
        
        gl_FragColor = vec4(finalColor, 0.5);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    let startTime = performance.now();

    function render(currentTime: number) {
      if (!gl || !canvas) return;
      const elapsedTime = (currentTime - startTime) * 0.001;

      gl.uniform1f(timeLocation, elapsedTime);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, resolvedTheme]);

  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none transition-opacity duration-700 opacity-60 dark:opacity-45">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
