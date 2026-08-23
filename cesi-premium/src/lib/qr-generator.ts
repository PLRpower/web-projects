/**
 * Pure TypeScript QR Code Generator (Model 2, Byte Encoding, Error Correction Level M/L)
 * Produces a 2D boolean matrix suitable for crisp SVG rendering.
 */

// Error correction polynomials and Galois Field arithmetic for QR Code
const GF256_EXP: number[] = new Array(512);
const GF256_LOG: number[] = new Array(256);

(function initGF() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
        GF256_EXP[i] = x;
        GF256_EXP[i + 255] = x;
        GF256_LOG[x] = i;
        x <<= 1;
        if (x & 0x100) x ^= 0x11d;
    }
    GF256_LOG[0] = 0;
})();

function gfMul(x: number, y: number): number {
    if (x === 0 || y === 0) return 0;
    return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
}

function gfPolyMul(p1: number[], p2: number[]): number[] {
    const r = new Array(p1.length + p2.length - 1).fill(0);
    for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
            r[i + j] ^= gfMul(p1[i], p2[j]);
        }
    }
    return r;
}

function getGeneratorPoly(degree: number): number[] {
    let gen = [1];
    for (let i = 0; i < degree; i++) {
        gen = gfPolyMul(gen, [1, GF256_EXP[i]]);
    }
    return gen;
}

function calculateECC(data: number[], eccCount: number): number[] {
    const gen = getGeneratorPoly(eccCount);
    const msg = [...data, ...new Array(eccCount).fill(0)];
    for (let i = 0; i < data.length; i++) {
        const coef = msg[i];
        if (coef !== 0) {
            for (let j = 0; j < gen.length; j++) {
                msg[i + j] ^= gfMul(gen[j], coef);
            }
        }
    }
    return msg.slice(data.length);
}

// QR Code Specifications for Version 1 to 4 (Medium Error Correction)
interface VersionSpec {
    version: number;
    size: number;
    totalDataBytes: number;
    eccBytes: number;
    alignmentPositions: number[];
}

const VERSIONS: VersionSpec[] = [
    { version: 1, size: 21, totalDataBytes: 16, eccBytes: 10, alignmentPositions: [] },
    { version: 2, size: 25, totalDataBytes: 28, eccBytes: 16, alignmentPositions: [6, 18] },
    { version: 3, size: 29, totalDataBytes: 44, eccBytes: 26, alignmentPositions: [6, 22] },
    { version: 4, size: 33, totalDataBytes: 64, eccBytes: 36, alignmentPositions: [6, 26] },
    { version: 5, size: 37, totalDataBytes: 86, eccBytes: 48, alignmentPositions: [6, 30] }
];

export function generateQRCodeMatrix(text: string): boolean[][] {
    // 1. Convert text to UTF-8 bytes
    const utf8Bytes: number[] = [];
    for (let i = 0; i < text.length; i++) {
        let code = text.charCodeAt(i);
        if (code < 0x80) {
            utf8Bytes.push(code);
        } else if (code < 0x800) {
            utf8Bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else {
            utf8Bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        }
    }

    // 2. Select QR Version
    const requiredCapacity = utf8Bytes.length + 3; // header & length overhead
    let verSpec = VERSIONS.find(v => v.totalDataBytes >= requiredCapacity);
    if (!verSpec) {
        verSpec = VERSIONS[VERSIONS.length - 1];
    }

    // 3. Build data bit stream (Byte Mode: 0100)
    const bits: number[] = [];
    const pushBits = (val: number, len: number) => {
        for (let i = len - 1; i >= 0; i--) {
            bits.push((val >> i) & 1);
        }
    };

    // Mode: Byte (0100)
    pushBits(0b0100, 4);
    // Character count indicator (8 bits for Version 1-9)
    pushBits(utf8Bytes.length, 8);
    // Data bytes
    for (const b of utf8Bytes) {
        pushBits(b, 8);
    }

    // Terminator (up to 4 zeroes)
    const maxDataBits = verSpec.totalDataBytes * 8;
    const termLen = Math.min(4, maxDataBits - bits.length);
    pushBits(0, termLen);

    // Byte padding to 8-bit boundary
    while (bits.length % 8 !== 0) {
        bits.push(0);
    }

    // Convert to bytes
    const dataBytes: number[] = [];
    for (let i = 0; i < bits.length; i += 8) {
        let byte = 0;
        for (let j = 0; j < 8; j++) {
            byte = (byte << 1) | bits[i + j];
        }
        dataBytes.push(byte);
    }

    // Pad bytes (0xEC, 0x11) until capacity reached
    const PAD_BYTES = [0xec, 0x11];
    let padIdx = 0;
    while (dataBytes.length < verSpec.totalDataBytes) {
        dataBytes.push(PAD_BYTES[padIdx % 2]);
        padIdx++;
    }

    // 4. Calculate Error Correction Codewords
    const eccCodewords = calculateECC(dataBytes, verSpec.eccBytes);
    const finalCodewords = [...dataBytes, ...eccCodewords];

    // Convert finalCodewords to bit stream
    const finalBits: number[] = [];
    for (const byte of finalCodewords) {
        for (let i = 7; i >= 0; i--) {
            finalBits.push((byte >> i) & 1);
        }
    }

    // 5. Initialize Matrix
    const N = verSpec.size;
    const matrix: (boolean | null)[][] = Array.from({ length: N }, () => Array(N).fill(null));
    const isReserved: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));

    const mark = (r: number, c: number, val: boolean) => {
        if (r >= 0 && r < N && c >= 0 && c < N) {
            matrix[r][c] = val;
            isReserved[r][c] = true;
        }
    };

    // Draw Finder Pattern
    const drawFinder = (top: number, left: number) => {
        for (let r = -1; r <= 7; r++) {
            for (let c = -1; c <= 7; c++) {
                const row = top + r;
                const col = left + c;
                if (row >= 0 && row < N && col >= 0 && col < N) {
                    if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
                        const isBlack = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
                        mark(row, col, isBlack);
                    } else {
                        mark(row, col, false); // separator
                    }
                }
            }
        }
    };

    drawFinder(0, 0);
    drawFinder(0, N - 7);
    drawFinder(N - 7, 0);

    // Draw Timing Patterns
    for (let i = 8; i < N - 8; i++) {
        const val = i % 2 === 0;
        mark(6, i, val);
        mark(i, 6, val);
    }

    // Draw Dark Module
    mark(4 * verSpec.version + 9, 8, true);

    // Draw Alignment Patterns if Version >= 2
    if (verSpec.alignmentPositions.length >= 2) {
        const [p1, p2] = verSpec.alignmentPositions;
        const centers = [
            [p1, p1], [p1, p2], [p2, p1], [p2, p2]
        ];
        for (const [rC, cC] of centers) {
            if (isReserved[rC][cC]) continue;
            for (let r = -2; r <= 2; r++) {
                for (let c = -2; c <= 2; c++) {
                    const isBlack = Math.max(Math.abs(r), Math.abs(c)) !== 1;
                    mark(rC + r, cC + c, isBlack);
                }
            }
        }
    }

    // Reserve Format Information Area
    for (let i = 0; i < 9; i++) {
        if (!isReserved[8][i]) { matrix[8][i] = false; isReserved[8][i] = true; }
        if (!isReserved[i][8]) { matrix[i][8] = false; isReserved[i][8] = true; }
    }
    for (let i = 0; i < 8; i++) {
        if (!isReserved[8][N - 1 - i]) { matrix[8][N - 1 - i] = false; isReserved[8][N - 1 - i] = true; }
        if (!isReserved[N - 1 - i][8]) { matrix[N - 1 - i][8] = false; isReserved[N - 1 - i][8] = true; }
    }

    // 6. Place Data Bits in Matrix (zigzag path)
    let bitIdx = 0;
    let upwards = true;
    for (let right = N - 1; right > 0; right -= 2) {
        if (right === 6) right--; // Skip vertical timing column
        const cols = [right, right - 1];

        const rows = upwards
            ? Array.from({ length: N }, (_, i) => N - 1 - i)
            : Array.from({ length: N }, (_, i) => i);

        for (const r of rows) {
            for (const c of cols) {
                if (!isReserved[r][c]) {
                    const bit = bitIdx < finalBits.length ? finalBits[bitIdx++] : 0;
                    // Standard Mask Pattern 0: (row + col) % 2 == 0
                    const mask = (r + c) % 2 === 0;
                    matrix[r][c] = (bit ^ (mask ? 1 : 0)) === 1;
                }
            }
        }
        upwards = !upwards;
    }

    // 7. Embed Format Information (Level M, Mask 0: format bits 101010000010010)
    const FORMAT_INFO = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
    const formatCoordinates: [number, number][] = [
        [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
        [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
    ];
    const formatCoordinates2: [number, number][] = [
        [N - 1, 8], [N - 2, 8], [N - 3, 8], [N - 4, 8], [N - 5, 8], [N - 6, 8], [N - 7, 8],
        [8, N - 8], [8, N - 7], [8, N - 6], [8, N - 5], [8, N - 4], [8, N - 3], [8, N - 2], [8, N - 1]
    ];

    for (let i = 0; i < 15; i++) {
        const val = FORMAT_INFO[i] === 1;
        const [r1, c1] = formatCoordinates[i];
        matrix[r1][c1] = val;
        const [r2, c2] = formatCoordinates2[i];
        matrix[r2][c2] = val;
    }

    // Replace any remaining nulls with false
    return matrix.map(row => row.map(cell => cell === true));
}
