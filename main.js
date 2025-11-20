function main(){
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    var vertexShaderCode = document.getElementById("vertexShaderCode").text;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    // Fragment shader dengan gradasi sederhana
    var fragmentShaderCode = `
        precision mediump float;
        varying vec3 vColor;
        uniform int uOutlineMode;
        uniform float uTime;
        
        void main(){
            if (uOutlineMode == 1) {
                gl_FragColor = vec4(1.0);
            } else {

                // brightness minimal menjaga warna selalu terang
                float b1 = 0.85 + 0.15 * sin(uTime * 0.8);
                float b2 = 0.85 + 0.15 * sin(uTime * 1.2);
                float b3 = 0.85 + 0.15 * cos(uTime * 1.0);

                float r = vColor.r * b1;
                float g = vColor.g * b2;
                float b = vColor.b * b3;

                gl_FragColor = vec4(r, g, b, 1.0);
            }
        }
    `;


    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);    

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var aPos = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPos);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var aColor = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

    var angleX = 0;
    var angleY = 0;
    var translateY = 0;
    var rotationSpeed = 0.01;
    var time = 0;
    
    var outlineBuffer = null;
    
    var keysPressed = {};
    window.addEventListener('keydown', function(e) {
        keysPressed[e.keyCode] = true;
    });
    window.addEventListener('keyup', function(e) {
        keysPressed[e.keyCode] = false;
    });
    
    function isKeyPressed(keyCode) {
        return keysPressed[keyCode] === true;
    }
    
    function render(){
        if (!freeze){
            angleX += rotationSpeed * 0.7;
            angleY += rotationSpeed;
            translateY += 0.02;
            time += 0.05;
        }

        var sx = Math.sin(angleX);
        var cx = Math.cos(angleX);
        var sy = Math.sin(angleY);
        var cy = Math.cos(angleY);
        var ty = Math.sin(translateY) * 0.3;

        var combinedMatrix = new Float32Array([
            cy,  sy*sx,  sy*cx,  0.0,
            0.0, cx,     -sx,    0.0,
            -sy, cy*sx,  cy*cx,  0.0,
            0.0, ty,     0.0,    1.0
        ]);
        
        if (isKeyPressed(38)) {
            rotationSpeed += 0.005;
        }
        if (isKeyPressed(40)) {
            rotationSpeed -= 0.005;
            if (rotationSpeed < 0) rotationSpeed = 0;
        }
        
        var uFormMatrix = gl.getUniformLocation(program, 'uFormMatrix');
        gl.uniformMatrix4fv(uFormMatrix, false, combinedMatrix);
        
        var uTime = gl.getUniformLocation(program, 'uTime');
        gl.uniform1f(uTime, time);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        var outlineMode = gl.getUniformLocation(program, "uOutlineMode");
        
        // 1. Draw SOLID
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.uniform1i(outlineMode, 0);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        // 2. Draw OUTLINE
        gl.lineWidth(2.5);

        if (!outlineBuffer) {
            outlineBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, outlineBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(outlineIndices), gl.STATIC_DRAW);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, outlineBuffer);
        gl.uniform1i(outlineMode, 1);
        gl.drawElements(gl.LINES, outlineIndices.length, gl.UNSIGNED_SHORT, 0);

        gl.uniform1i(outlineMode, 0);

        window.requestAnimationFrame(render);
    }

    render();    
}