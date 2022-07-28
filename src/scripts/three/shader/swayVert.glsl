uniform float u_time;
varying vec2 v_uv;

#include './cnoise21.glsl'

void main() {
  v_uv = uv;

  vec3 pos = position;
  pos.x += sin(u_time + cnoise21(v_uv * 0.5 + u_time * 0.5)) * (pos.y + 0.5) * 0.1;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}