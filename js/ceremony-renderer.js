/* ============================================
   OFFLOAD — Ceremony Renderer
   WebGL Particle System: 200 Rising Particles
   Three Phases: Rising → Forming → Sealed
   ============================================ */

const CeremonyRenderer = (() => {
  let canvas = null;
  let gl = null;
  let animationId = null;
  let particles = [];
  let startTime = 0;
  let currentPhase = 0; // 0=rising, 1=forming, 2=sealed
  let onCompleteCallback = null;

  const PARTICLE_COUNT = 200;
  const PHASE_DURATIONS = [3000, 2500, 2000]; // ms per phase

  // ---- Vertex Shader ----
  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute float a_size;
    attribute vec3 a_color;
    attribute float a_speed;
    attribute float a_offset;

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_phase;
    uniform float u_phaseTime;

    varying vec3 v_color;
    varying float v_alpha;

    void main() {
      v_color = a_color;

      vec2 pos = a_position;
      float t = u_time * 0.001;

      // Phase 0: Rising particles
      if (u_phase < 0.5) {
        pos.y = mod(pos.y + t * a_speed * 0.3 + a_offset, 2.0) - 1.0;
        pos.x += sin(t * a_speed + a_offset * 6.28) * 0.1;
        v_alpha = 0.6 + 0.4 * sin(t * 2.0 + a_offset * 6.28);
      }
      // Phase 1: Forming (converging to center)
      else if (u_phase < 1.5) {
        float converge = smoothstep(0.0, 1.0, u_phaseTime);
        pos.x = mix(pos.x, 0.0, converge * 0.7);
        pos.y = mix(pos.y, 0.0, converge * 0.7);
        pos.x += sin(t * a_speed + a_offset * 6.28) * 0.05 * (1.0 - converge);
        v_alpha = 0.8 - converge * 0.2;
      }
      // Phase 2: Sealed (orbiting seal)
      else {
        float angle = t * 0.5 + a_offset * 6.28;
        float radius = 0.05 + a_size * 0.1;
        pos.x = cos(angle) * radius;
        pos.y = sin(angle) * radius;
        v_alpha = 0.9;
      }

      // Convert to clip space
      vec2 clipPos = pos;
      gl_Position = vec4(clipPos, 0.0, 1.0);
      gl_PointSize = a_size * (u_resolution.y / 400.0);
    }
  `;

  // ---- Fragment Shader ----
  const fragmentShaderSource = `
    precision mediump float;
    varying vec3 v_color;
    varying float v_alpha;

    void main() {
      // Create circular point sprite
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) {
        discard;
      }

      // Soft edge
      float alpha = smoothstep(0.5, 0.2, dist) * v_alpha;
      gl_FragColor = vec4(v_color, alpha);
    }
  `;

  // ---- Shader Compilation ----
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  // ---- Program Linking ----
  function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  // ---- Particle Initialization ----
  function initParticles() {
    particles = [];
    const colors = [
      [0.486, 0.435, 0.682], // purple
      [0.165, 0.616, 0.561], // teal
      [0.957, 0.635, 0.380], // amber
      [0.616, 0.569, 0.780], // light purple
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: (Math.random() - 0.5) * 1.8,
        y: -1.0 - Math.random(),
        size: 4 + Math.random() * 12,
        color: color,
        speed: 0.3 + Math.random() * 0.7,
        offset: Math.random(),
      });
    }
  }

  // ---- Setup Buffers ----
  function setupBuffers(gl, program) {
    const positions = new Float32Array(particles.flatMap(p => [p.x, p.y]));
    const sizes = new Float32Array(particles.map(p => p.size));
    const colors = new Float32Array(particles.flatMap(p => p.color));
    const speeds = new Float32Array(particles.map(p => p.speed));
    const offsets = new Float32Array(particles.map(p => p.offset));

    // Position attribute
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Size attribute
    const sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    const sizeLoc = gl.getAttribLocation(program, 'a_size');
    gl.enableVertexAttribArray(sizeLoc);
    gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0);

    // Color attribute
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    const colorLoc = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(colorLoc);
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

    // Speed attribute
    const speedBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, speedBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, speeds, gl.STATIC_DRAW);
    const speedLoc = gl.getAttribLocation(program, 'a_speed');
    gl.enableVertexAttribArray(speedLoc);
    gl.vertexAttribPointer(speedLoc, 1, gl.FLOAT, false, 0, 0);

    // Offset attribute
    const offsetBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);
    const offsetLoc = gl.getAttribLocation(program, 'a_offset');
    gl.enableVertexAttribArray(offsetLoc);
    gl.vertexAttribPointer(offsetLoc, 1, gl.FLOAT, false, 0, 0);
  }

  // ---- Resize Handler ----
  function resize() {
    if (!canvas || !gl) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  // ---- Render Loop ----
  function render(gl, program, uniforms) {
    const elapsed = performance.now() - startTime;

    // Determine phase
    let phaseTime = 0;
    let accumulatedTime = 0;
    for (let i = 0; i < PHASE_DURATIONS.length; i++) {
      if (elapsed < accumulatedTime + PHASE_DURATIONS[i]) {
        currentPhase = i;
        phaseTime = (elapsed - accumulatedTime) / PHASE_DURATIONS[i];
        break;
      }
      accumulatedTime += PHASE_DURATIONS[i];
      if (i === PHASE_DURATIONS.length - 1) {
        currentPhase = 2;
        phaseTime = 1;
      }
    }

    // Check completion
    const totalDuration = PHASE_DURATIONS.reduce((a, b) => a + b, 0);
    if (elapsed >= totalDuration + 1000) {
      if (onCompleteCallback) {
        onCompleteCallback();
        onCompleteCallback = null;
      }
      return;
    }

    // Clear
    gl.clearColor(0.027, 0.039, 0.122, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Enable blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Update uniforms
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.phase, currentPhase);
    gl.uniform1f(uniforms.phaseTime, phaseTime);

    // Draw particles
    gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);

    animationId = requestAnimationFrame(() => render(gl, program, uniforms));
  }

  // ---- Public API ----
  return {
    // Initialize the ceremony renderer
    init(canvasElement) {
      canvas = canvasElement;
      gl = canvas.getContext('webgl', { alpha: false, antialias: false });

      if (!gl) {
        console.warn('WebGL not available, using fallback');
        return false;
      }

      // Compile shaders
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

      if (!vertexShader || !fragmentShader) {
        return false;
      }

      const program = createProgram(gl, vertexShader, fragmentShader);
      if (!program) return false;

      gl.useProgram(program);

      // Initialize particles
      initParticles();
      setupBuffers(gl, program);

      // Resize
      resize();
      window.addEventListener('resize', resize);

      // Store uniforms
      this._program = program;
      this._uniforms = {
        time: gl.getUniformLocation(program, 'u_time'),
        resolution: gl.getUniformLocation(program, 'u_resolution'),
        phase: gl.getUniformLocation(program, 'u_phase'),
        phaseTime: gl.getUniformLocation(program, 'u_phaseTime'),
      };

      return true;
    },

    // Start the ceremony animation
    start(onComplete) {
      if (!gl || !this._program) {
        // Fallback: just call complete after delay
        setTimeout(onComplete, 3000);
        return;
      }

      startTime = performance.now();
      currentPhase = 0;
      onCompleteCallback = onComplete;

      gl.useProgram(this._program);
      animationId = requestAnimationFrame(() =>
        render(gl, this._program, this._uniforms)
      );
    },

    // Stop the ceremony
    stop() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },

    // Check if running
    isRunning() {
      return !!animationId;
    },

    // Cleanup
    destroy() {
      this.stop();
      if (gl) {
        gl.deleteProgram(this._program);
        gl = null;
      }
      canvas = null;
    },

    // Haptic feedback
    triggerHaptic() {
      if (navigator.vibrate) {
        navigator.vibrate([50, 100, 50, 100, 200]);
      }
    }
  };
})();

export { CeremonyRenderer };
