var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gl = canvas.getContext("webgl");
if (!gl) console.error("WebGL error");

var time = 0.0;

var vertexSource = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

var fragmentSource = `
precision mediump float;
uniform float time;

float heart(vec2 p) {
    p.x = abs(p.x);
    p.y -= 0.25;
    float h = (p.x*p.x + p.y*p.y - 0.3);
    return h;
}

void main() {
    vec2 uv = (gl_FragCoord.xy / vec2(${window.innerWidth}.0, ${window.innerHeight}.0)) * 2.0 - 1.0;
    float h = heart(uv);
    float glow = 0.02 / abs(h);
    vec3 col = vec3(1.0, 0.1, 0.6) * glow;
    gl_FragColor = vec4(col, 1.0);
}
`;

function compile(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

var vShader = compile(gl.VERTEX_SHADER, vertexSource);
var fShader = compile(gl.FRAGMENT_SHADER, fragmentSource);

var program = gl.createProgram();
gl.attachShader(program, vShader);
gl.attachShader(program, fShader);
gl.linkProgram(program);
gl.useProgram(program);

var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1
]), gl.STATIC_DRAW);

var pos = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(pos);
gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

var timeLoc = gl.getUniformLocation(program, "time");

function loop() {
    time += 0.01;
    gl.uniform1f(timeLoc, time);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(loop);
}
loop();
