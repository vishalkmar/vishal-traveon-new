/**
 * Minimal AES-256-CTR, used only when WebCrypto is unavailable.
 *
 * Browsers expose crypto.subtle in secure contexts only (https, localhost).
 * Opening the dev server on a LAN IP — http://192.168.x.x:5173, e.g. to test on
 * a phone — is not a secure context, so this keeps the reader working there.
 * Production over https always takes the native path, which is far faster.
 *
 * Byte-for-byte compatible with Node's crypto `aes-256-ctr` (128-bit counter).
 */

const SBOX = new Uint8Array(256);
const RCON = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d];

(function buildSbox() {
  const exp = new Uint8Array(512);
  const log = new Uint8Array(256);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    exp[i] = x;
    log[x] = i;
    x ^= (x << 1) ^ (x & 0x80 ? 0x11b : 0); // x *= 3 over GF(2^8)
    x &= 0xff;
  }
  for (let i = 255; i < 512; i++) exp[i] = exp[i - 255];

  SBOX[0] = 0x63;
  for (let a = 1; a < 256; a++) {
    const inv = exp[255 - log[a]];
    let s = inv;
    for (let r = 1; r <= 4; r++) s ^= ((inv << r) | (inv >>> (8 - r))) & 0xff;
    SBOX[a] = s ^ 0x63;
  }
})();

const xtime = (b) => ((b << 1) ^ (b & 0x80 ? 0x1b : 0)) & 0xff;

/** @returns {Uint8Array[]} 15 round keys of 16 bytes (AES-256 => Nr = 14) */
function expandKey(key) {
  const Nk = 8;
  const Nr = 14;
  const w = new Uint8Array(16 * (Nr + 1));
  w.set(key.subarray(0, 32));

  for (let i = Nk; i < 4 * (Nr + 1); i++) {
    const p = (i - 1) * 4;
    let t0 = w[p];
    let t1 = w[p + 1];
    let t2 = w[p + 2];
    let t3 = w[p + 3];

    if (i % Nk === 0) {
      const r = t0; // RotWord
      t0 = SBOX[t1] ^ RCON[i / Nk - 1];
      t1 = SBOX[t2];
      t2 = SBOX[t3];
      t3 = SBOX[r];
    } else if (i % Nk === 4) {
      t0 = SBOX[t0];
      t1 = SBOX[t1];
      t2 = SBOX[t2];
      t3 = SBOX[t3];
    }

    const q = (i - Nk) * 4;
    const o = i * 4;
    w[o] = w[q] ^ t0;
    w[o + 1] = w[q + 1] ^ t1;
    w[o + 2] = w[q + 2] ^ t2;
    w[o + 3] = w[q + 3] ^ t3;
  }

  const rounds = [];
  for (let r = 0; r <= Nr; r++) rounds.push(w.subarray(r * 16, r * 16 + 16));
  return rounds;
}

/** Encrypts `state` (16 bytes) in place. CTR only ever needs the forward cipher. */
function encryptBlock(state, roundKeys) {
  const Nr = 14;
  for (let i = 0; i < 16; i++) state[i] ^= roundKeys[0][i];

  for (let round = 1; round <= Nr; round++) {
    for (let i = 0; i < 16; i++) state[i] = SBOX[state[i]];

    // ShiftRows (state is column-major: byte index = col * 4 + row)
    let t = state[1];
    state[1] = state[5];
    state[5] = state[9];
    state[9] = state[13];
    state[13] = t;

    t = state[2];
    state[2] = state[10];
    state[10] = t;
    t = state[6];
    state[6] = state[14];
    state[14] = t;

    t = state[15];
    state[15] = state[11];
    state[11] = state[7];
    state[7] = state[3];
    state[3] = t;

    if (round !== Nr) {
      for (let c = 0; c < 16; c += 4) {
        const a0 = state[c];
        const a1 = state[c + 1];
        const a2 = state[c + 2];
        const a3 = state[c + 3];
        const all = a0 ^ a1 ^ a2 ^ a3;
        state[c] ^= all ^ xtime(a0 ^ a1);
        state[c + 1] ^= all ^ xtime(a1 ^ a2);
        state[c + 2] ^= all ^ xtime(a2 ^ a3);
        state[c + 3] ^= all ^ xtime(a3 ^ a0);
      }
    }

    const rk = roundKeys[round];
    for (let i = 0; i < 16; i++) state[i] ^= rk[i];
  }
}

/** XORs data[from,to) into out, advancing `counter` in place. `to` must be 16-aligned or the end. */
function ctrRun(data, out, roundKeys, counter, from, to) {
  const keystream = new Uint8Array(16);

  for (let offset = from; offset < to; offset += 16) {
    keystream.set(counter);
    encryptBlock(keystream, roundKeys);

    const end = Math.min(offset + 16, to);
    for (let i = offset; i < end; i++) out[i] = data[i] ^ keystream[i - offset];

    for (let i = 15; i >= 0; i--) {
      counter[i] = (counter[i] + 1) & 0xff;
      if (counter[i] !== 0) break;
    }
  }
}

/**
 * CTR mode is symmetric, so this both encrypts and decrypts.
 *
 * @param {Uint8Array} data
 * @param {Uint8Array} key  32 bytes
 * @param {Uint8Array} iv   16 bytes, incremented as one big-endian counter
 * @returns {Uint8Array} a new buffer of the same length
 */
export function aes256CtrXor(data, key, iv) {
  const out = new Uint8Array(data.length);
  ctrRun(data, out, expandKey(key), Uint8Array.from(iv.subarray(0, 16)), 0, data.length);
  return out;
}

/**
 * Same result as `aes256CtrXor`, but yields to the event loop between slices so
 * a ~20 MB document doesn't freeze the page on a slow device.
 *
 * @param {Function} [onProgress] called with 0..1
 */
export async function aes256CtrXorAsync(data, key, iv, onProgress) {
  const SLICE = 1 << 21; // 2 MB, a multiple of the 16-byte block size
  const out = new Uint8Array(data.length);
  const roundKeys = expandKey(key);
  const counter = Uint8Array.from(iv.subarray(0, 16));

  for (let from = 0; from < data.length; from += SLICE) {
    const to = Math.min(from + SLICE, data.length);
    ctrRun(data, out, roundKeys, counter, from, to);
    onProgress?.(to / data.length);
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return out;
}

export default aes256CtrXor;
