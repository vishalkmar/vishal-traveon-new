import { getApiV1Base } from "./apiUrl";
import { aes256CtrXorAsync } from "./aesCtr";

/**
 * Loads a document that the backend refuses to hand over in the clear.
 *
 * 1. POST /secure-docs/:slug/session  -> short-lived token + one-time AES key
 * 2. GET  /secure-docs/:slug/stream   -> AES-256-CTR encrypted bytes
 * 3. decrypt in the browser with WebCrypto
 *
 * The real S3 URL never reaches the client, and the stream URL on its own
 * downloads nothing but noise — the key only ever travels in the POST body.
 */

const b64ToBytes = (b64) => {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

async function openSession(slug, signal) {
  const res = await fetch(`${getApiV1Base()}/secure-docs/${slug}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
    signal,
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.message || `Session request failed (${res.status})`);
  }
  return json.data;
}

async function downloadEncrypted(slug, token, onProgress, signal) {
  const url = `${getApiV1Base()}/secure-docs/${slug}/stream?t=${encodeURIComponent(token)}`;
  const res = await fetch(url, { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`Document request failed (${res.status})`);

  const total = Number(res.headers.get("Content-Length")) || 0;

  // No streaming body available (very old browser) — fall back to a plain read.
  if (!res.body || typeof res.body.getReader !== "function") {
    const buf = new Uint8Array(await res.arrayBuffer());
    onProgress?.(1);
    return buf;
  }

  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total) onProgress?.(Math.min(received / total, 1));
  }

  const merged = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  if (!total) onProgress?.(1);
  return merged;
}

async function decrypt(bytes, keyB64, ivB64, onProgress) {
  const rawKey = b64ToBytes(keyB64);
  const rawIv = b64ToBytes(ivB64);
  const subtle = window.crypto?.subtle;

  // Browsers only expose WebCrypto in a secure context (https, or localhost).
  // Opening the dev server on a LAN IP falls back to the JS implementation.
  if (!subtle) {
    onProgress?.(0);
    return aes256CtrXorAsync(bytes, rawKey, rawIv, onProgress);
  }

  const key = await subtle.importKey("raw", rawKey, "AES-CTR", false, ["decrypt"]);
  const plain = await subtle.decrypt(
    { name: "AES-CTR", counter: rawIv, length: 128 },
    key,
    bytes
  );
  onProgress?.(1);
  return new Uint8Array(plain);
}

/**
 * @param {string} slug     document slug registered on the backend
 * @param {object} options  { onProgress(value 0..1, phase "download"|"decrypt"), signal }
 * @returns {Promise<Uint8Array>} the decrypted PDF bytes
 */
export async function loadSecureDocument(slug, { onProgress, signal } = {}) {
  const session = await openSession(slug, signal);
  const encrypted = await downloadEncrypted(
    slug,
    session.token,
    (p) => onProgress?.(p, "download"),
    signal
  );
  const bytes = await decrypt(encrypted, session.key, session.iv, (p) =>
    onProgress?.(p, "decrypt")
  );

  if (
    bytes[0] !== 0x25 || // %
    bytes[1] !== 0x50 || // P
    bytes[2] !== 0x44 || // D
    bytes[3] !== 0x46 //    F
  ) {
    throw new Error("Document could not be verified.");
  }

  return bytes;
}

export default loadSecureDocument;
