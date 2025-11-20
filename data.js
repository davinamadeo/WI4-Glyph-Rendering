// Array global yang akan dipakai main.js
var lines = [];   // berisi posisi vertex (xyz)
var colors = [];  // berisi warna per vertex (rgb)
var indices = []; // berisi index untuk gl.TRIANGLES

// Helper: tambah prisma 3D dari polygon 2D (part) yang diekstrusi dengan 'depth'
function addPrism2D(part, depth, baseColor) {
    // part: array of [x, y]
    var n = part.length;
    var baseIndex = lines.length / 3; // index awal vertex baru

    // --- FRONT VERTICES (z = +depth)
    for (let i = 0; i < n; i++) {
        let x = part[i][0];
        let y = part[i][1];
        lines.push(x, y, depth);
    }

    // --- BACK VERTICES (z = -depth)
    for (let i = 0; i < n; i++) {
        let x = part[i][0];
        let y = part[i][1];
        lines.push(x, y, -depth);
    }

    // --- COLORS (untuk semua vertex di part ini)
    for (let i = 0; i < 2 * n; i++) {
        colors.push(baseColor[0], baseColor[1], baseColor[2]);
    }

    // --- FRONT FACE (triangulation fan)
    // gunakan (0, i, i+1) untuk i=1..n-2
    for (let i = 1; i < n - 1; i++) {
        indices.push(baseIndex, baseIndex + i, baseIndex + i + 1);
    }

    // --- BACK FACE (urutan dibalik supaya normalnya keluar)
    let backBase = baseIndex + n;
    for (let i = 1; i < n - 1; i++) {
        indices.push(backBase, backBase + i + 1, backBase + i);
    }

    // --- SIDE FACES
    // tiap edge (i -> next) jadi quad, dibagi 2 triangle
    for (let i = 0; i < n; i++) {
        let next = (i + 1) % n;

        let v0f = baseIndex + i;
        let v1f = baseIndex + next;
        let v0b = backBase + i;
        let v1b = backBase + next;

        // quad: v0f, v1f, v1b, v0b
        // triangle 1
        indices.push(v0f, v1f, v1b);
        // triangle 2
        indices.push(v0f, v1b, v0b);
    }
}

var wDepth = 0.15; // Kedalaman 3D

var wLeftOuter = [
    [-0.85,  0.40],
    [-0.79,  0.40],
    [-0.79, -0.40],
    [-0.85, -0.40]
];
var wLeftInner = [
    [-0.73, -0.40],
    [-0.67, -0.40],
    [-0.61,  0.05],
    [-0.55,  0.05]
];
var wCenter = [
    [-0.58,  0.05],
    [-0.52,  0.05],
    [-0.52, -0.25],
    [-0.58, -0.25]
];
var wRightInner = [
    [-0.45,  0.05],
    [-0.39,  0.05],
    [-0.33, -0.40],
    [-0.27, -0.40]
];
var wRightOuter = [
    [-0.31,  0.40],
    [-0.25,  0.40],
    [-0.25, -0.40],
    [-0.31, -0.40]
];

// W: warna ke-oranye-an
var colorW = [1.0, 0.5, 0.0];

addPrism2D(wLeftOuter,  wDepth, colorW);
addPrism2D(wLeftInner,  wDepth, colorW);
addPrism2D(wCenter,     wDepth, colorW);
addPrism2D(wRightInner, wDepth, colorW);
addPrism2D(wRightOuter, wDepth, colorW);

var iDepth = 0.15;

var iTop = [
    [ 0.00,  0.40],
    [ 0.22,  0.40],
    [ 0.22,  0.34],
    [ 0.00,  0.34]
];
var iMiddle = [
    [ 0.08,  0.34],
    [ 0.14,  0.34],
    [ 0.14, -0.34],
    [ 0.08, -0.34]
];
var iBottom = [
    [ 0.00, -0.34],
    [ 0.22, -0.34],
    [ 0.22, -0.40],
    [ 0.00, -0.40]
];

// I: hijau kebiruan
var colorI = [0.0, 0.9, 0.7];

addPrism2D(iTop,    iDepth, colorI);
addPrism2D(iMiddle, iDepth, colorI);
addPrism2D(iBottom, iDepth, colorI);

var fourDepth = 0.15;

var fourLeft = [
    [0.50,  0.40],
    [0.56,  0.40],
    [0.56,  0.03],
    [0.50,  0.03]
];
var fourHoriz = [
    [0.50,  0.03],
    [0.82,  0.03],
    [0.82, -0.03],
    [0.50, -0.03]
];
var fourRight = [
    [0.70,  0.40],
    [0.76,  0.40],
    [0.76, -0.40],
    [0.70, -0.40]
];

// 4: biru keungu-an
var color4 = [0.2, 0.3, 1.0];

addPrism2D(fourLeft,   fourDepth, color4);
addPrism2D(fourHoriz,  fourDepth, color4);
addPrism2D(fourRight,  fourDepth, color4);

// ===============================
//   OUTLINE EDGES (garis tepi)
// ===============================

var outlineIndices = [];
var cursor = 0;

// part: array [x, y] yang sama seperti dipakai di addPrism2D
function addOutline(part) {
    var n = part.length;

    // FRONT FACE
    for (let i = 0; i < n; i++) {
        let next = (i + 1) % n;
        outlineIndices.push(cursor + i, cursor + next);
    }

    // BACK FACE
    for (let i = 0; i < n; i++) {
        let next = (i + 1) % n;
        outlineIndices.push(cursor + n + i, cursor + n + next);
    }

    // EDGE VERTIKAL (hubungkan front–back, jadi kelihatan 3D)
    for (let i = 0; i < n; i++) {
        outlineIndices.push(cursor + i, cursor + n + i);
    }

    cursor += n * 2; // karena tiap prism menambah n (front) + n (back)
}

// urutan harus sama persis dengan pemanggilan addPrism2D

// W
addOutline(wLeftOuter);
addOutline(wLeftInner);
addOutline(wCenter);
addOutline(wRightInner);
addOutline(wRightOuter);

// I
addOutline(iTop);
addOutline(iMiddle);
addOutline(iBottom);

// 4
addOutline(fourLeft);
addOutline(fourHoriz);
addOutline(fourRight);
