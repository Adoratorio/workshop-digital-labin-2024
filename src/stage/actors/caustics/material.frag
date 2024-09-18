#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 uResolution;    // Screen resolution (width, height)
uniform float uTime;         // Elapsed time, used for animations
uniform float uScroll;       // Controls the vertical scroll of the effect
uniform float uFluctuation;  // Controls the fluctuation of the effect over time

// mod289 function, used to keep values within a specific range
vec4 mod289(vec4 x) {
  return x - floor(x / 289.0) * 289.0;
}

// Permutation function, generates pseudo-random numbers for noisee
vec4 permute(vec4 x) {
  return mod289((x * 34.0 + 1.0) * x);
}

// Function to generate 3D simplex noise, returns both the noise value and the gradient
vec4 snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);

  // Calculation of the first angle of the simplex
  vec3 i  = floor(v + dot(v, vec3(C.y)));
  vec3 x0 = v - i + dot(i, vec3(C.x));

  // Determination of the other angles of the simplex 
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  // Offset for the other angles of the simplex
  vec3 x1 = x0 - i1 + C.x;
  vec3 x2 = x0 - i2 + C.y;
  vec3 x3 = x0 - 0.5;

  // Calculation of permutations to create pseudo-randomness
  vec4 p = permute(
    permute(
      permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0)
    )
    + i.x + vec4(0.0, i1.x, i2.x, 1.0)
  );

  // Generation of gradients for the noise
  vec4 j = p - 49.0 * floor(p / 49.0); // Modulo 49 to limit the values

  vec4 x_ = floor(j / 7.0);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = (x_ * 2.0 + 0.5) / 7.0 - 1.0;
  vec4 y = (y_ * 2.0 + 0.5) / 7.0 - 1.0;

  vec4 h = 1.0 - abs(x) - abs(y);

  // Calculation of gradient vectors for each simplex angle
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 g0 = vec3(a0.xy, h.x);
  vec3 g1 = vec3(a0.zw, h.y);
  vec3 g2 = vec3(a1.xy, h.z);
  vec3 g3 = vec3(a1.zw, h.w);

  // Calculation of the contributions from the simplex vertices
  vec4 m = max(0.6 - vec4(
    dot(x0, x0),
    dot(x1, x1),
    dot(x2, x2),
    dot(x3, x3)
  ), 0.0);
  vec4 m2 = m * m;
  vec4 m3 = m2 * m;
  vec4 m4 = m2 * m2;

  // Sum of contributions to obtain the total gradient
  vec3 grad = -6.0 * m3.x * x0 * dot(x0, g0) + m4.x * g0
    + -6.0 * m3.y * x1 * dot(x1, g1) + m4.y * g1
    + -6.0 * m3.z * x2 * dot(x2, g2) + m4.z * g2
    + -6.0 * m3.w * x3 * dot(x3, g3) + m4.w * g3;

  vec4 px = vec4(
    dot(x0, g0),
    dot(x1, g1),
    dot(x2, g2),
    dot(x3, g3)
  );

  // Returns the gradient and the combined noise value
  return 42.0 * vec4(grad, dot(m4, px));
}

void main() {
  // Normalized fragment coordinates (from 0 to 1)
  vec2 uv = gl_FragCoord.xy / uResolution;

  // Application of vertical scrolling to simulate the movement of light beams
  uv.y += uScroll;

  // Addition of fluctuations to make the movement more organic and dynamic
  uv.y += sin(uFluctuation) * 0.1 + uFluctuation * 0.02;

  // Definition of the camera matrix to project 2D coordinates into 3D
  vec3 ww = normalize(-vec3(1.0, 1.0, 1.0)); // View direction
  ww += 50.0; // Offset to achieve a wider perspective
  vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0))); // Camera's horizontal vector
  vec3 vv = normalize(cross(uu, ww)); // Camera's vertical vector

  // Calculation of the view ray based on screen coordinates
  vec3 rd = uv.x * uu + uv.y * vv + 1.0 * ww;

  // Calculation of the 3D space position to sample the noise
  vec3 pos = -ww + rd * (ww.y / rd.y);

  // Scales the position to control the noise frequency (light beams)
  pos *= 10.0;

  // Modifies the Y component of the position to animate the movement of the beams over time
  pos.y = uTime * 0.3;

  // Initial sampling of the simplex noise to obtain the initial distortion
  vec4 n = snoise(pos);

  // Initial distortion of the position based on the noise, adding complexity to the light beams
  pos -= 0.07 * n.xyz;
  n = snoise(pos);

  // Second distortion to increase complexity and create variations in the beams
  pos -= 0.07 * n.xyz;
  n = snoise(pos);

  // Calculation of light intensity based on the noise value 
  // Using the exponential function accentuates differences, creating brighter areas
  float intensity = exp(n.w * 3.0 - 1.5);

  // Sets the final color of the fragment, using the calculated intensity
  // This creates the visual effect of light beams moving and fluctuating over time
  gl_FragColor = vec4(vec3(intensity), 1.0);
}