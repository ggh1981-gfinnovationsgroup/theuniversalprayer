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
      this.camera = null;
      this.lastRenderTime = null;
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
        const z = Math.sin(angle) * distance - 7;
        this.draw('cone', [x, -1, z], [13 + (i % 2) * 5, 12 + (i % 3) * 2, 14 + (i % 2) * 4], i % 2 ? '#6aa9ad' : '#7fb8b2');
      }
      this.draw('sphere', [18, 30, 42], [3.2, 3.2, 3.2], '#ffe49a', [0, 0, 0], 0.55);
      this.drawCloud(-15, 13 + Math.sin(time / 1600), -1, 5);
      this.drawCloud(14, 17 + Math.cos(time / 2100), -20, 6);
      this.drawCloud(-11, 12, -31, 4);
    }

    drawDecorations() {
      this.drawTree(-1.9, 0, 1.6, 0.9);
      this.drawTree(1.9, 0, -1.8, 0.72);
      this.drawTree(-1.3, 1.15, -6.5, 0.72);
      this.drawTree(4.5, 2.3, -10.1, 0.8);
      this.drawTree(2.2, 4.6, -16.8, 0.73);
      this.drawTree(-4.2, 5.75, -22.1, 0.9);
      this.draw('sphere', [1.6, 0.12, 0.6], [0.28, 0.2, 0.26], '#e97865');
      this.draw('sphere', [-0.7, 0.12, -1.8], [0.28, 0.2, 0.26], '#f0d26c');
      this.draw('sphere', [-1, 1.28, -5.4], [0.25, 0.18, 0.23], '#ed8e81');
      this.draw('sphere', [5.3, 3.58, -13.2], [0.27, 0.19, 0.23], '#f0d26c');
    }

    drawChapel(goal, collected) {
      const { x, z, h } = goal;
      this.draw('cube', [x, h + 1.15, z], [2.8, 2.3, 2.35], '#f2dfb6');
      this.draw('cube', [x, h + 1.22, z + 1.2], [0.72, 1.45, 0.12], '#654c3d');
      this.draw('cube', [x - 0.86, h + 1.45, z + 1.2], [0.32, 0.48, 0.14], '#8fc9d0');
      this.draw('cube', [x + 0.86, h + 1.45, z + 1.2], [0.32, 0.48, 0.14], '#8fc9d0');
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

    drawFelipe(player, time) {
      const { x, z, y, vx, vz, grounded } = player;
      const bob = grounded ? Math.sin(time / 130) * (Math.abs(vx) + Math.abs(vz) > 0.3 ? 0.045 : 0.008) : 0;
      const base = y + bob;
      this.draw('sphere', [x, y + 0.02, z], [0.48, 0.035, 0.31], [0.12, 0.2, 0.24]);
      this.draw('sphere', [x, base + 0.62, z], [0.36, 0.58, 0.3], '#30333d');
      this.draw('cube', [x, base + 1.04, z - 0.28], [0.22, 0.11, 0.055], '#f3e7d2');
      this.draw('sphere', [x, base + 1.28, z], [0.29, 0.3, 0.27], '#dfb18a');
      this.draw('sphere', [x, base + 1.49, z], [0.3, 0.1, 0.29], '#262934');
      this.draw('sphere', [x, base + 1.2, z - 0.22], [0.25, 0.12, 0.1], '#45404a');
      this.draw('cube', [x - 0.3, base + 0.2, z - 0.02], [0.25, 0.14, 0.4], '#40343a');
      this.draw('cube', [x + 0.3, base + 0.2, z - 0.02], [0.25, 0.14, 0.4], '#40343a');
    }

    drawChild(child, time) {
      const bob = child.joined && child.singing ? Math.abs(Math.sin(time / 180 + child.index)) * 0.11 : Math.sin(time / 320 + child.index) * 0.025;
      const y = (child.y || 0) + bob;
      const { x, z } = child;
      const hair = child.hair || '#533c32';
      const tunic = child.color || '#547da5';
      this.draw('sphere', [x, y + 0.02, z], [0.31, 0.025, 0.23], [0.12, 0.2, 0.24]);
      if (child.gender === 'girl') {
        this.draw('cone', [x, y + 0.4, z], [0.54, 0.76, 0.48], child.dress || tunic);
        this.draw('sphere', [x, y + 0.52, z], [0.17, 0.21, 0.16], tunic);
        this.draw('cube', [x, y + 0.38, z - 0.01], [0.34, 0.07, 0.34], '#e8c67b');
        this.draw('sphere', [x - 0.12, y + 0.8, z], [0.075, 0.2, 0.11], hair);
        this.draw('sphere', [x + 0.12, y + 0.8, z], [0.075, 0.2, 0.11], hair);
      } else {
        this.draw('sphere', [x, y + 0.38, z], [0.19, 0.28, 0.18], tunic);
      }
      this.draw('sphere', [x, y + 0.78, z], [0.19, 0.2, 0.18], '#d9a77f');
      this.draw('sphere', [x, y + 0.91, z + 0.01], [0.2, 0.1, 0.19], hair);
      if (child.joined && child.singing) {
        this.draw('sphere', [x, y + 0.76, z - 0.16], [0.045, 0.07, 0.035], '#5a2524');
      }
    }

    drawMaze(maze) {
      const cellSize = 4;
      const wallHeight = 0.48;
      const wallColor = '#b88f69';
      const trimColor = '#d1ae84';
      const hasCell = (column, row) => maze.cells.has(`${column},${row}`);

      for (const cell of maze.cells) {
        const [column, row] = cell.split(',').map(Number);
        const x = -12 + column * cellSize;
        const z = -row * cellSize;
        const isGoal = column === 5 && row === 7;
        this.draw('cube', [x, 0.015, z], [cellSize - 0.12, 0.04, cellSize - 0.12], '#d8c29a');
        const edges = [
          { column: column - 1, row, position: [x - 2, wallHeight / 2, z], size: [0.28, wallHeight, cellSize + 0.12] },
          { column: column + 1, row, position: [x + 2, wallHeight / 2, z], size: [0.28, wallHeight, cellSize + 0.12] },
          { column, row: row - 1, position: [x, wallHeight / 2, z + 2], size: [cellSize + 0.12, wallHeight, 0.28] },
          { column, row: row + 1, position: [x, wallHeight / 2, z - 2], size: [cellSize + 0.12, wallHeight, 0.28] },
        ];
        edges.forEach((edge, index) => {
          if (hasCell(edge.column, edge.row) || (isGoal && index === 3)) return;
          this.draw('cube', edge.position, edge.size, wallColor);
          const capPosition = [...edge.position];
          capPosition[1] = wallHeight + 0.07;
          this.draw('cube', capPosition, [edge.size[0] * 0.88, 0.12, edge.size[2] * 0.88], trimColor);
        });
      }
    }

    drawOratoryScene(player, children, time, singing, maze) {
      this.draw('cube', [0, -0.5, -14], [100, 1, 100], '#b99b71');
      this.drawMaze(maze);

      const oratoryX = 8;
      const oratoryZ = -32;
      this.draw('cube', [oratoryX, 2.2, oratoryZ], [8, 4.4, 1.1], '#d9c09a');
      this.draw('cube', [oratoryX, 1.35, oratoryZ + 0.57], [1.7, 2.7, 0.1], '#654a38');
      this.draw('cube', [oratoryX - 2.7, 2.3, oratoryZ + 0.58], [1.05, 1.5, 0.1], '#83b9c3');
      this.draw('cube', [oratoryX + 2.7, 2.3, oratoryZ + 0.58], [1.05, 1.5, 0.1], '#83b9c3');
      this.draw('cone', [oratoryX, 4.8, oratoryZ], [9, 2.3, 2.2], '#a84e40');
      this.draw('cylinder', [oratoryX, 6.35, oratoryZ], [0.16, 1.1, 0.16], '#d7ad50');
      this.draw('cube', [oratoryX, 6.75, oratoryZ], [0.9, 0.14, 0.14], '#d7ad50');

      for (const child of children) this.drawChild(child, time);
      this.drawFelipe(player, time);

      if (singing) {
        const notePositions = [
          [5.6, 2.6, -26], [8, 3.1, -25.6], [10.4, 2.6, -26],
          [4.4, 2.2, -27.2], [11.6, 2.2, -27.2],
        ];
        notePositions.forEach(([x, y, z], index) => {
          const float = Math.sin(time / 240 + index) * 0.18;
          this.draw('sphere', [x, y + float, z], [0.16, 0.21, 0.12], index % 2 ? '#f2cc63' : '#fff1b1', [0, 0, index % 2 ? -0.5 : 0.5], 0.5);
        });
      }
    }

    beginScene(player, time, fixedYaw = null) {
      this.resize();
      const gl = this.gl;
      const aspect = this.width / this.height;
      const baseDistance = aspect < 0.9 ? 12.8 : 10.8;
      const speed = Math.hypot(player.vx, player.vz);
      const desiredDistance = baseDistance + Math.min(speed / 5.8, 1) * 1.8 + Math.min(Math.max(player.vy, 0) / 10.2, 1) * 0.7;
      const desiredYaw = fixedYaw ?? (Number.isFinite(player.facing) ? player.facing : Math.PI);
      const lookAhead = aspect < 0.9 ? 1.5 : 3.1;
      const desiredCamera = [
        player.x - Math.sin(desiredYaw) * desiredDistance,
        player.y + desiredDistance * 0.56,
        player.z - Math.cos(desiredYaw) * desiredDistance,
      ];
      const delta = this.lastRenderTime === null ? 0 : Math.min(0.05, (time - this.lastRenderTime) / 1000);
      this.lastRenderTime = time;
      if (!this.camera) {
        this.camera = { x: desiredCamera[0], y: desiredCamera[1], z: desiredCamera[2], yaw: desiredYaw, distance: desiredDistance };
      } else {
        const smoothing = 1 - Math.exp(-delta * 5.5);
        if (fixedYaw === null) {
          const yawDifference = ((desiredYaw - this.camera.yaw + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
          this.camera.yaw += yawDifference * smoothing;
        } else {
          this.camera.yaw = fixedYaw;
        }
        this.camera.x += (desiredCamera[0] - this.camera.x) * smoothing;
        this.camera.y += (desiredCamera[1] - this.camera.y) * smoothing;
        this.camera.z += (desiredCamera[2] - this.camera.z) * smoothing;
        this.camera.distance += (desiredDistance - this.camera.distance) * smoothing;
      }
      const target = [
        player.x + Math.sin(this.camera.yaw) * lookAhead,
        player.y + 0.7 + Math.max(player.vy, 0) * 0.035,
        player.z + Math.cos(this.camera.yaw) * lookAhead,
      ];
      const eye = [this.camera.x, this.camera.y, this.camera.z];
      const viewProjection = multiply(
        perspective(0.88, aspect, 0.1, 120),
        lookAt(eye, target, [0, 1, 0]),
      );
      gl.clearColor(0.56, 0.79, 0.87, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(this.program);
      gl.uniformMatrix4fv(this.locations.viewProjection, false, viewProjection);
      gl.uniform3fv(this.locations.camera, eye);
      return { gl, aspect };
    }

    render(player, platforms, stars, goal, time, collected) {
      this.beginScene(player, time);

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

    renderFelipeNeri(player, children, time, singing, maze) {
      this.beginScene(player, time, Math.PI);
      this.drawOratoryScene(player, children, time, singing, maze);
    }

    drawMazeThemed(maze, theme) {
      const cellSize = 4;
      const wallHeight = 0.48;
      const hasCell = (column, row) => maze.cells.has(`${column},${row}`);
      const goalCell = theme.goalCell || '5,7';

      for (const cell of maze.cells) {
        const [column, row] = cell.split(',').map(Number);
        const x = -12 + column * cellSize;
        const z = -row * cellSize;
        const isGoal = `${column},${row}` === goalCell;
        const floor = (column + row) % 2 ? theme.floor : theme.floorAlt;
        this.draw('cube', [x, 0.015, z], [cellSize - 0.12, 0.04, cellSize - 0.12], floor);
        const edges = [
          { column: column - 1, row, position: [x - 2, wallHeight / 2, z], size: [0.28, wallHeight, cellSize + 0.12] },
          { column: column + 1, row, position: [x + 2, wallHeight / 2, z], size: [0.28, wallHeight, cellSize + 0.12] },
          { column, row: row - 1, position: [x, wallHeight / 2, z + 2], size: [cellSize + 0.12, wallHeight, 0.28] },
          { column, row: row + 1, position: [x, wallHeight / 2, z - 2], size: [cellSize + 0.12, wallHeight, 0.28] },
        ];
        edges.forEach((edge, index) => {
          if (hasCell(edge.column, edge.row) || (isGoal && index === 3)) return;
          this.draw('cube', edge.position, edge.size, theme.wall);
          const capPosition = [...edge.position];
          capPosition[1] = wallHeight + 0.07;
          this.draw('cube', capPosition, [edge.size[0] * 0.88, 0.12, edge.size[2] * 0.88], theme.trim);
        });
      }
    }

    drawFigure(fig, time) {
      const { x, z } = fig;
      const bob = fig.singing
        ? Math.abs(Math.sin(time / 180 + (fig.index || 0))) * 0.11
        : Math.sin(time / 320 + (fig.index || 0)) * 0.025;
      const y = (fig.y || 0) + bob;
      const skin = fig.skin || '#d9a77f';
      const hair = fig.hair || '#4a3423';
      const robe = fig.robe || '#547da5';

      if (fig.size === 'child') {
        this.draw('sphere', [x, y + 0.02, z], [0.31, 0.025, 0.23], [0.12, 0.2, 0.24]);
        if (fig.dress) {
          this.draw('cone', [x, y + 0.4, z], [0.54, 0.76, 0.48], fig.dress);
          this.draw('sphere', [x, y + 0.52, z], [0.17, 0.21, 0.16], robe);
          this.draw('sphere', [x - 0.12, y + 0.8, z], [0.075, 0.2, 0.11], hair);
          this.draw('sphere', [x + 0.12, y + 0.8, z], [0.075, 0.2, 0.11], hair);
        } else {
          this.draw('sphere', [x, y + 0.38, z], [0.19, 0.28, 0.18], robe);
        }
        this.draw('sphere', [x, y + 0.78, z], [0.19, 0.2, 0.18], skin);
        this.draw('sphere', [x, y + 0.91, z + 0.01], [0.2, 0.1, 0.19], hair);
        if (fig.singing) this.draw('sphere', [x, y + 0.76, z - 0.16], [0.045, 0.07, 0.035], '#5a2524');
        return;
      }

      this.draw('sphere', [x, y + 0.02, z], [0.48, 0.035, 0.31], [0.12, 0.2, 0.24]);
      this.draw('sphere', [x, y + 0.62, z], [0.36, 0.58, 0.3], robe);
      this.draw('sphere', [x, y + 1.28, z], [0.29, 0.3, 0.27], skin);
      if (fig.hairStyle === 'veil') {
        const veil = fig.veilColor || '#f2ede2';
        this.draw('sphere', [x, y + 1.38, z], [0.33, 0.2, 0.32], veil);
        this.draw('cube', [x, y + 1.05, z + 0.26], [0.44, 0.55, 0.07], veil);
      } else if (fig.hairStyle === 'hat') {
        this.draw('cylinder', [x, y + 1.52, z], [0.36, 0.1, 0.36], hair);
        this.draw('sphere', [x, y + 1.47, z], [0.27, 0.16, 0.26], hair);
      } else {
        this.draw('sphere', [x, y + 1.49, z], [0.3, 0.1, 0.29], hair);
        this.draw('sphere', [x, y + 1.2, z + 0.22], [0.25, 0.12, 0.1], hair);
      }
      if (fig.beard) this.draw('sphere', [x, y + 1.14, z - 0.2], [0.2, 0.14, 0.09], hair);
      const accessories = Array.isArray(fig.accessory) ? fig.accessory : [fig.accessory];
      if (accessories.includes('medallion')) {
        this.draw('cylinder', [x, y + 0.82, z - 0.28], [0.3, 0.05, 0.3], '#d7ad50', [Math.PI / 2, 0, 0], 0.35);
        this.draw('sphere', [x, y + 0.82, z - 0.31], [0.09, 0.11, 0.04], '#f6e3ae', [0, 0, 0], 0.3);
      }
      if (accessories.includes('cross')) {
        this.draw('cube', [x, y + 0.86, z - 0.29], [0.07, 0.3, 0.04], '#d7ad50', [0, 0, 0], 0.3);
        this.draw('cube', [x, y + 0.92, z - 0.29], [0.2, 0.07, 0.04], '#d7ad50', [0, 0, 0], 0.3);
      }
      if (accessories.includes('book')) {
        this.draw('cube', [x - 0.3, y + 0.2, z - 0.02], [0.25, 0.14, 0.4], '#40343a');
        this.draw('cube', [x + 0.3, y + 0.2, z - 0.02], [0.25, 0.14, 0.4], '#40343a');
      }
      if (accessories.includes('flame')) {
        const flicker = 1 + Math.sin(time / 110 + x) * 0.1;
        this.draw('cone', [x, y + 1.78, z], [0.17, 0.34 * flicker, 0.17], '#ff8a3c', [0, 0, 0], 0.55);
        this.draw('sphere', [x, y + 1.72, z], [0.08, 0.1, 0.08], '#ffd23c', [0, 0, 0], 0.7);
      }
      if (fig.singing) this.draw('sphere', [x, y + 1.22, z - 0.26], [0.05, 0.08, 0.04], '#5a2524');
    }

    drawShrine(goal, theme, time, completed) {
      const gx = goal.x;
      const gz = goal.z - 4;
      this.draw('cube', [gx, 2.2, gz], [8, 4.4, 1.1], theme.shrineWall || '#d9c09a');
      this.draw('cube', [gx, 1.35, gz + 0.57], [1.7, 2.7, 0.1], '#654a38');
      this.draw('cube', [gx - 2.7, 2.3, gz + 0.58], [1.05, 1.5, 0.1], theme.shrineWindow || '#83b9c3');
      this.draw('cube', [gx + 2.7, 2.3, gz + 0.58], [1.05, 1.5, 0.1], theme.shrineWindow || '#83b9c3');
      this.draw('cone', [gx, 4.8, gz], [9, 2.3, 2.2], theme.shrineRoof || '#a84e40');
      this.draw('cylinder', [gx, 6.35, gz], [0.16, 1.1, 0.16], '#d7ad50');
      this.draw('cube', [gx, 6.75, gz], [0.9, 0.14, 0.14], '#d7ad50');

      const sz = goal.z - 1.6;
      const front = sz + 0.12;
      const glow = completed ? 0.8 : 0.3;
      this.draw('cube', [gx, 0.5, sz], [1.7, 1.0, 0.7], theme.pedestal || '#9a8a72');

      if (theme.emblem === 'mercy') {
        this.draw('cube', [gx, 2.35, sz], [2.0, 2.5, 0.1], '#f7f3e6');
        this.draw('sphere', [gx, 2.4, front], [0.4, 0.72, 0.13], '#fdfaf0');
        this.draw('sphere', [gx, 3.2, front], [0.19, 0.21, 0.13], '#eec39a');
        this.draw('sphere', [gx, 3.38, front], [0.21, 0.1, 0.14], '#7a5230');
        if (completed) {
          this.draw('cube', [gx - 0.85, 1.05, front + 0.05], [0.32, 2.7, 0.07], '#fdf6d8', [0, 0, 0.45], 0.9);
          this.draw('cube', [gx + 0.85, 1.05, front + 0.05], [0.32, 2.7, 0.07], '#e5484d', [0, 0, -0.45], 0.9);
        }
      } else if (theme.emblem === 'sacredHeart' || theme.emblem === 'immaculateHeart') {
        const heartColor = theme.emblem === 'sacredHeart' ? '#c62f3b' : '#f3e9f6';
        if (theme.emblem === 'immaculateHeart') {
          this.draw('cube', [gx, 2.35, sz], [2.3, 2.7, 0.08], '#7fb2d9');
          for (let i = 0; i < 8; i++) {
            const angle = i / 8 * Math.PI * 2;
            this.draw('sphere', [gx + Math.cos(angle) * 1.32, 2.35 + Math.sin(angle) * 1.5, front], [0.16, 0.14, 0.14], i % 2 ? '#e86a8a' : '#f6f1e7', [0, 0, 0], 0.3);
          }
        }
        this.draw('sphere', [gx - 0.28, 2.5, front], [0.5, 0.48, 0.18], heartColor, [0, 0, 0], glow);
        this.draw('sphere', [gx + 0.28, 2.5, front], [0.5, 0.48, 0.18], heartColor, [0, 0, 0], glow);
        this.draw('cone', [gx, 1.98, front], [1.0, 1.1, 0.38], heartColor, [Math.PI, 0, 0], glow);
        this.draw('cone', [gx, 3.05, front], [0.26, 0.5, 0.26], '#ff8a3c', [0, 0, 0], 0.6);
        this.draw('cube', [gx, 3.42, front], [0.08, 0.4, 0.08], '#d7ad50');
        this.draw('cube', [gx, 3.48, front], [0.28, 0.08, 0.08], '#d7ad50');
      } else if (theme.emblem === 'medallion') {
        this.draw('cylinder', [gx, 2.3, sz], [1.7, 0.1, 1.7], '#d7ad50', [Math.PI / 2, 0, 0], glow);
        this.draw('sphere', [gx, 2.3, front], [0.36, 0.44, 0.12], '#eec39a');
        this.draw('sphere', [gx, 2.68, front], [0.38, 0.16, 0.13], '#4a3423');
        this.draw('sphere', [gx, 2.08, front], [0.3, 0.18, 0.1], '#6b4a2f');
      } else if (theme.emblem === 'divinoNino') {
        if (completed) this.draw('sphere', [gx, 2.32, sz - 0.14], [0.32, 0.32, 0.06], '#ffe9a0', [0, 0, 0], 0.85);
        this.drawFigure({ x: gx, z: front, y: 1.0, size: 'child', robe: '#e8a0b4', dress: '#e8a0b4', hair: '#4a3423', index: 9 }, time);
        this.draw('sphere', [gx - 0.3, 2.2, front], [0.09, 0.24, 0.08], '#e8a0b4', [0, 0, -0.7]);
        this.draw('sphere', [gx + 0.3, 2.2, front], [0.09, 0.24, 0.08], '#e8a0b4', [0, 0, 0.7]);
      }
    }

    drawCollectible(item, time) {
      const bob = Math.sin(time / 300 + item.x * 1.7 + item.z) * 0.14;
      const base = 0.62 + bob;
      if (item.type === 'ray') {
        this.draw('sphere', [item.x, base + 0.25, item.z], [0.17, 0.55, 0.17], item.color, [0, 0, 0], 0.8);
        this.draw('sphere', [item.x, base + 0.25, item.z], [0.08, 0.3, 0.08], '#fffbe8', [0, 0, 0], 0.9);
      } else if (item.type === 'flame') {
        const flicker = 1 + Math.sin(time / 100 + item.x * 2.1) * 0.09;
        this.draw('cone', [item.x, base + 0.28, item.z], [0.36, 0.66 * flicker, 0.36], '#ff7a33', [0, 0, 0], 0.55);
        this.draw('sphere', [item.x, base + 0.2, item.z], [0.15, 0.2, 0.15], '#ffd23c', [0, 0, 0], 0.85);
        this.draw('cylinder', [item.x, 0.16, item.z], [0.3, 0.32, 0.3], '#8a6a42');
      } else if (item.type === 'rose') {
        this.draw('cylinder', [item.x, 0.3, item.z], [0.05, 0.6, 0.05], '#3f7a3a');
        this.draw('sphere', [item.x - 0.12, 0.42, item.z], [0.14, 0.07, 0.1], '#4a9d68');
        this.draw('sphere', [item.x + 0.12, 0.5, item.z], [0.14, 0.07, 0.1], '#4a9d68');
        this.draw('sphere', [item.x, base + 0.18, item.z], [0.25, 0.21, 0.25], item.color, [0, 0, 0], 0.35);
        this.draw('sphere', [item.x, base + 0.3, item.z], [0.15, 0.12, 0.15], item.color, [0, 0, 0], 0.4);
      }
    }

    drawEndingFx(theme, goal, time) {
      const positions = [
        [-2.2, 3.4], [-1.1, 3.9], [0, 4.2], [1.1, 3.9], [2.2, 3.4],
      ];
      positions.forEach(([dx, y], index) => {
        const float = Math.sin(time / 240 + index * 1.3) * 0.18;
        if (theme.particle === 'flame') {
          this.draw('cone', [goal.x + dx, y + float, goal.z - 1.2], [0.2, 0.4, 0.2], '#ff8a3c', [0, 0, 0], 0.6);
        } else if (theme.particle === 'heart') {
          this.draw('sphere', [goal.x + dx, y + float, goal.z - 1.2], [0.17, 0.17, 0.17], '#e5484d', [0, 0, 0], 0.55);
        } else if (theme.particle === 'petal') {
          this.draw('sphere', [goal.x + dx, y + float, goal.z - 1.2], [0.16, 0.1, 0.16], index % 2 ? '#e86a8a' : '#f6f1e7', [0, 0, 0], 0.4);
        } else {
          this.draw('sphere', [goal.x + dx, y + float, goal.z - 1.2], [0.15, 0.2, 0.12], index % 2 ? '#f2cc63' : '#fff1b1', [0, 0, index % 2 ? -0.5 : 0.5], 0.5);
        }
      });
    }

    renderMazeQuest(player, world, time, maze, theme) {
      this.beginScene(player, time, Math.PI);
      this.draw('cube', [0, -0.5, -14], [100, 1, 100], theme.ground);
      this.drawMazeThemed(maze, theme);
      (theme.trees || []).forEach(([x, z, size]) => this.drawTree(x, 0, z, size || 0.9));
      this.drawShrine(world.goal, theme, time, world.completed);
      for (const item of world.items) {
        if (!item.taken) this.drawCollectible(item, time);
      }
      for (const npc of world.npcs) this.drawFigure(npc.figure, time);
      this.drawFigure(world.playerFigure, time);
      if (world.completed) this.drawEndingFx(theme, world.goal, time);
    }
  }

  window.Game3DRenderer = Renderer;
})();
