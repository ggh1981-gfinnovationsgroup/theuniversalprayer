(() => {
  'use strict';

  const vertexSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    uniform mat4 uModel;
    uniform mat4 uViewProjection;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    void main() {
      vec4 worldPosition = uModel * vec4(aPosition, 1.0);
      vWorldPosition = worldPosition.xyz;
      vNormal = normalize(mat3(uModel) * aNormal);
      gl_Position = uViewProjection * worldPosition;
    }
  `;
  const fragmentSource = `
    precision mediump float;
    uniform vec3 uColor;
    uniform vec3 uCameraPosition;
    uniform float uGlow;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    void main() {
      vec3 lightDirection = normalize(vec3(-0.45, 0.85, 0.48));
      float diffuse = max(dot(normalize(vNormal), lightDirection), 0.0);
      float lighting = 0.48 + diffuse * 0.68;
      float fog = smoothstep(35.0, 76.0, distance(vWorldPosition, uCameraPosition));
      vec3 color = uColor * lighting;
      color += uColor * uGlow * 0.32;
      gl_FragColor = vec4(mix(color, vec3(0.68, 0.85, 0.92), fog), 1.0);
    }
  `;
  const TAU = Math.PI * 2;

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('No se pudo crear el shader 3D.');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Error al compilar el shader 3D: ${message}`);
    }
    return shader;
  }

  function createProgram(gl) {
    const program = gl.createProgram();
    if (!program) throw new Error('No se pudo crear el programa de renderizado 3D.');
    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`Error al enlazar el programa 3D: ${message}`);
    }
    return program;
  }

  function addTriangle(data, a, b, c) {
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const normal = [
      ab[1] * ac[2] - ab[2] * ac[1],
      ab[2] * ac[0] - ab[0] * ac[2],
      ab[0] * ac[1] - ab[1] * ac[0],
    ];
    const length = Math.hypot(...normal) || 1;
    const n = normal.map((value) => value / length);
    for (const point of [a, b, c]) data.push(...point, ...n);
  }

  function createCube() {
    const data = [];
    const faces = [
      [[-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]],
      [[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]],
      [[0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5]],
      [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]],
      [[-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5]],
      [[-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5]],
    ];
    for (const [a, b, c, d] of faces) {
      addTriangle(data, a, b, c);
      addTriangle(data, a, c, d);
    }
    return data;
  }

  function createSphere(segments = 10, rings = 7) {
    const data = [];
    for (let ring = 0; ring < rings; ring++) {
      const v0 = Math.PI * ring / rings;
      const v1 = Math.PI * (ring + 1) / rings;
      for (let segment = 0; segment < segments; segment++) {
        const u0 = TAU * segment / segments;
        const u1 = TAU * (segment + 1) / segments;
        const point = (u, v) => [Math.sin(v) * Math.cos(u), Math.cos(v), Math.sin(v) * Math.sin(u)];
        const a = point(u0, v0);
        const b = point(u1, v0);
        const c = point(u1, v1);
        const d = point(u0, v1);
        addTriangle(data, a, b, c);
        addTriangle(data, a, c, d);
      }
    }
    return data;
  }

  function createCylinder(segments = 10, topRadius = 0.5, bottomRadius = 0.5) {
    const data = [];
    for (let index = 0; index < segments; index++) {
      const a = TAU * index / segments;
      const b = TAU * (index + 1) / segments;
      const bottomA = [Math.cos(a) * bottomRadius, -0.5, Math.sin(a) * bottomRadius];
      const bottomB = [Math.cos(b) * bottomRadius, -0.5, Math.sin(b) * bottomRadius];
      const topA = [Math.cos(a) * topRadius, 0.5, Math.sin(a) * topRadius];
      const topB = [Math.cos(b) * topRadius, 0.5, Math.sin(b) * topRadius];
      addTriangle(data, bottomA, bottomB, topB);
      addTriangle(data, bottomA, topB, topA);
      addTriangle(data, [0, 0.5, 0], topA, topB);
      addTriangle(data, [0, -0.5, 0], bottomB, bottomA);
    }
    return data;
  }

  function perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const range = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * range, -1,
      0, 0, near * far * range * 2, 0,
    ]);
  }

  function lookAt(eye, target, up) {
    const z = normalize([eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]]);
    const x = normalize(cross(up, z));
    const y = cross(z, x);
    return new Float32Array([
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot(x, eye), -dot(y, eye), -dot(z, eye), 1,
    ]);
  }

  function normalize(vector) {
    const length = Math.hypot(...vector) || 1;
    return vector.map((value) => value / length);
  }

  function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function multiply(a, b) {
    const result = new Float32Array(16);
    for (let column = 0; column < 4; column++) {
      for (let row = 0; row < 4; row++) {
        result[column * 4 + row] =
          a[row] * b[column * 4] +
          a[4 + row] * b[column * 4 + 1] +
          a[8 + row] * b[column * 4 + 2] +
          a[12 + row] * b[column * 4 + 3];
      }
    }
    return result;
  }

  function transform(position, rotation, scale) {
    const [sx, sy, sz] = scale;
    const [rx, ry, rz] = rotation;
    const cx = Math.cos(rx), sinX = Math.sin(rx);
    const cy = Math.cos(ry), sinY = Math.sin(ry);
    const cz = Math.cos(rz), sinZ = Math.sin(rz);
    return new Float32Array([
      (cy * cz) * sx, (sinX * sinY * cz + cx * sinZ) * sx, (sinX * sinZ - cx * sinY * cz) * sx, 0,
      (-cy * sinZ) * sy, (cx * cz - sinX * sinY * sinZ) * sy, (sinX * cz + cx * sinY * sinZ) * sy, 0,
      sinY * sz, -sinX * cy * sz, cx * cy * sz, 0,
      position[0], position[1], position[2], 1,
    ]);
  }

  function hexColor(hex) {
    const value = Number.parseInt(hex.slice(1), 16);
    return [(value >> 16 & 255) / 255, (value >> 8 & 255) / 255, (value & 255) / 255];
  }

  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.gl = canvas.getContext('webgl', { alpha: false, antialias: true, powerPreference: 'high-performance' });
      if (!this.gl) throw new Error('Este navegador no tiene WebGL disponible para el juego 3D.');
      const gl = this.gl;
      this.program = createProgram(gl);
      this.locations = {
        position: gl.getAttribLocation(this.program, 'aPosition'),
        normal: gl.getAttribLocation(this.program, 'aNormal'),
        model: gl.getUniformLocation(this.program, 'uModel'),
        viewProjection: gl.getUniformLocation(this.program, 'uViewProjection'),
        color: gl.getUniformLocation(this.program, 'uColor'),
        camera: gl.getUniformLocation(this.program, 'uCameraPosition'),
        glow: gl.getUniformLocation(this.program, 'uGlow'),
      };
      this.geometries = new Map();
      this.width = 0;
      this.height = 0;
      this.createGeometry('cube', createCube());
      this.createGeometry('sphere', createSphere());
      this.createGeometry('cone', createCylinder(9, 0, 0.5));
      this.createGeometry('cylinder', createCylinder(10));
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
    }

    createGeometry(name, vertices) {
      const gl = this.gl;
      const buffer = gl.createBuffer();
      if (!buffer) throw new Error(`No se pudo crear la geometría: ${name}.`);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      this.geometries.set(name, { buffer, count: vertices.length / 6 });
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (width === this.width && height === this.height) return;
      this.width = width;
      this.height = height;
      this.canvas.width = width;
      this.canvas.height = height;
      this.gl.viewport(0, 0, width, height);
    }

    draw(name, position, scale, color, rotation = [0, 0, 0], glow = 0) {
      const gl = this.gl;
      const geometry = this.geometries.get(name);
      if (!geometry) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, geometry.buffer);
      gl.enableVertexAttribArray(this.locations.position);
      gl.vertexAttribPointer(this.locations.position, 3, gl.FLOAT, false, 24, 0);
      gl.enableVertexAttribArray(this.locations.normal);
      gl.vertexAttribPointer(this.locations.normal, 3, gl.FLOAT, false, 24, 12);
      gl.uniformMatrix4fv(this.locations.model, false, transform(position, rotation, scale));
      gl.uniform3fv(this.locations.color, typeof color === 'string' ? hexColor(color) : color);
      gl.uniform1f(this.locations.glow, glow);
      gl.drawArrays(gl.TRIANGLES, 0, geometry.count);
    }

    drawIsland(platform) {
      const { x, z, w, d, h, color } = platform;
      this.draw('cube', [x, h - 0.55, z], [w, 1.1, d], '#80684f');
      this.draw('cube', [x, h - 0.03, z], [w + 0.08, 0.18, d + 0.08], color);
      this.draw('cube', [x, h - 0.22, z], [w * 0.94, 0.18, d * 0.94], '#638d55');
    }

    drawTree(x, y, z, size = 1) {
      this.draw('cylinder', [x, y + 0.55 * size, z], [0.24 * size, 1.1 * size, 0.24 * size], '#91613f');
      this.draw('cone', [x, y + 1.48 * size, z], [1.5 * size, 1.8 * size, 1.5 * size], '#368760');
      this.draw('cone', [x, y + 2.03 * size, z], [1.15 * size, 1.45 * size, 1.15 * size], '#4a9d68');
    }

    drawCloud(x, y, z, size) {
      this.draw('sphere', [x, y, z], [size, size * 0.52, size * 0.56], '#f7fbf0');
      this.draw('sphere', [x - size * 0.42, y - size * 0.05, z + 0.12], [size * 0.64, size * 0.42, size * 0.5], '#f7fbf0');
      this.draw('sphere', [x + size * 0.43, y - size * 0.08, z - 0.1], [size * 0.7, size * 0.44, size * 0.55], '#f7fbf0');
    }

    drawScenery(time) {
      this.draw('cube', [0, -8, 0], [180, 0.4, 180], '#429dc1');
      for (let i = 0; i < 10; i++) {
        const angle = i * TAU / 10;
        const distance = 52 + (i % 3) * 9;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance + 7;
        this.draw('cone', [x, -1, z], [13 + (i % 2) * 5, 12 + (i % 3) * 2, 14 + (i % 2) * 4], i % 2 ? '#6aa9ad' : '#7fb8b2');
      }
      this.draw('sphere', [18, 30, 42], [3.2, 3.2, 3.2], '#ffe49a', [0, 0, 0], 0.55);
      this.drawCloud(-15, 13 + Math.sin(time / 1600), 1, 5);
      this.drawCloud(14, 17 + Math.cos(time / 2100), 20, 6);
      this.drawCloud(-11, 12, 31, 4);
    }

    drawDecorations() {
      this.drawTree(-1.9, 0, -1.6, 0.9);
      this.drawTree(1.9, 0, 1.8, 0.72);
      this.drawTree(-1.3, 1.15, 6.5, 0.72);
      this.drawTree(4.5, 2.3, 10.1, 0.8);
      this.drawTree(2.2, 4.6, 16.8, 0.73);
      this.drawTree(-4.2, 5.75, 22.1, 0.9);
      this.draw('sphere', [1.6, 0.12, -0.6], [0.28, 0.2, 0.26], '#e97865');
      this.draw('sphere', [-0.7, 0.12, 1.8], [0.28, 0.2, 0.26], '#f0d26c');
      this.draw('sphere', [-1, 1.28, 5.4], [0.25, 0.18, 0.23], '#ed8e81');
      this.draw('sphere', [5.3, 3.58, 13.2], [0.27, 0.19, 0.23], '#f0d26c');
    }

    drawChapel(goal, collected) {
      const { x, z, h } = goal;
      this.draw('cube', [x, h + 1.15, z], [2.8, 2.3, 2.35], '#f2dfb6');
      this.draw('cube', [x, h + 1.22, z - 1.2], [0.72, 1.45, 0.12], '#654c3d');
      this.draw('cube', [x - 0.86, h + 1.45, z - 1.2], [0.32, 0.48, 0.14], '#8fc9d0');
      this.draw('cube', [x + 0.86, h + 1.45, z - 1.2], [0.32, 0.48, 0.14], '#8fc9d0');
      this.draw('cone', [x, h + 2.65, z], [3.4, 1.45, 3.0], '#b95845');
      this.draw('cylinder', [x, h + 3.65, z], [0.12, 0.65, 0.12], '#d7ad50');
      this.draw('cube', [x, h + 3.76, z], [0.5, 0.12, 0.12], '#d7ad50');
      if (collected === 5) {
        this.draw('sphere', [x, h + 3.95, z], [0.23, 0.23, 0.23], '#fff0a0', [0, 0, 0], 0.7);
      }
    }

    drawHopeCross(position, size, rotation = 0) {
      const [x, y, z] = position;
      const color = '#ffdc72';
      this.draw('cube', [x, y + size * 0.31, z], [size * 0.22, size * 0.82, size * 0.2], color, [0, rotation, 0], 0.55);
      this.draw('cube', [x, y + size * 0.48, z], [size * 0.7, size * 0.2, size * 0.2], color, [0, rotation, 0], 0.55);
    }

    drawCharacter(player, time) {
      const { x, z, y, grounded, vx, vz, facing } = player;
      const jumpHeight = Math.max(0, y - (player.platformHeight || 0));
      const bob = grounded ? Math.sin(time / 105) * (Math.abs(vx) + Math.abs(vz) > 0.3 ? 0.05 : 0.008) : 0;
      const footY = y + bob;
      const shadowSize = Math.max(0.45, 1 - jumpHeight * 0.11);
      this.draw('sphere', [x, y + 0.02, z], [0.48 * shadowSize, 0.035, 0.31 * shadowSize], [0.12, 0.2, 0.24]);

      this.draw('sphere', [x, footY + 0.53, z], [0.3, 0.39, 0.25], '#25819a');
      this.draw('sphere', [x - 0.27, footY + 0.18, z + 0.04], [0.14, 0.24, 0.15], '#25819a', [0, 0, -0.25]);
      this.draw('sphere', [x + 0.27, footY + 0.18, z + 0.04], [0.14, 0.24, 0.15], '#25819a', [0, 0, 0.25]);
      this.draw('sphere', [x - 0.14, footY + 0.12, z + 0.07], [0.18, 0.1, 0.23], '#f1bf62');
      this.draw('sphere', [x + 0.14, footY + 0.12, z + 0.07], [0.18, 0.1, 0.23], '#f1bf62');
      this.draw('sphere', [x, footY + 1.05, z + 0.01], [0.28, 0.28, 0.27], '#eebd92');
      this.draw('sphere', [x, footY + 1.27, z + 0.02], [0.32, 0.13, 0.31], '#dc634d');
      this.draw('cone', [x, footY + 1.4, z + 0.02], [0.46, 0.42, 0.46], '#dc634d');
      const eyeAngle = facing || 0;
      const frontX = Math.sin(eyeAngle) * 0.245;
      const frontZ = Math.cos(eyeAngle) * 0.245;
      const sideX = Math.cos(eyeAngle) * 0.09;
      const sideZ = -Math.sin(eyeAngle) * 0.09;
      this.draw('sphere', [x + frontX - sideX, footY + 1.08, z + frontZ - sideZ], [0.055, 0.075, 0.045], '#253746');
      this.draw('sphere', [x + frontX + sideX, footY + 1.08, z + frontZ + sideZ], [0.055, 0.075, 0.045], '#253746');
    }

    render(player, platforms, stars, goal, time, collected) {
      this.resize();
      const gl = this.gl;
      const aspect = this.width / this.height;
      const distance = aspect < 0.9 ? 15.5 : 12.5;
      const eye = [player.x + 0.35, player.y + distance * 0.56, player.z - distance];
      const target = [player.x, player.y + 0.7, player.z + (aspect < 0.9 ? 1.2 : 2.7)];
      const viewProjection = multiply(
        perspective(0.88, aspect, 0.1, 120),
        lookAt(eye, target, [0, 1, 0]),
      );
      gl.clearColor(0.56, 0.79, 0.87, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(this.program);
      gl.uniformMatrix4fv(this.locations.viewProjection, false, viewProjection);
      gl.uniform3fv(this.locations.camera, eye);

      this.drawScenery(time);
      for (const platform of platforms) this.drawIsland(platform);
      this.drawDecorations();
      this.drawChapel(goal, collected);

      for (const star of stars) {
        if (!star.collected) {
          const bob = Math.sin(time / 300 + star.z) * 0.16;
          this.drawHopeCross([star.x, star.h + bob, star.z], 1.05, Math.sin(time / 1500) * 0.12);
        }
      }
      this.drawCharacter(player, time);
    }
  }

  window.Game3DRenderer = Renderer;
})();
