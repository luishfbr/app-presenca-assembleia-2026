import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV — recomendado pelo NIST para GCM
const KEY_HEX_LENGTH = 64; // 32 bytes = 256 bits em hex

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== KEY_HEX_LENGTH) {
    throw new Error("ENCRYPTION_KEY inválida ou ausente (deve ter 64 chars hex)");
  }
  return Buffer.from(key, "hex");
}

function getHmacKey(): string {
  const key = process.env.HMAC_KEY;
  if (!key || key.length !== KEY_HEX_LENGTH) {
    throw new Error("HMAC_KEY inválida ou ausente (deve ter 64 chars hex)");
  }
  return key;
}

/**
 * Criptografa um plaintext com AES-256-GCM.
 * Retorna uma string no formato: "{iv_hex}:{authTag_hex}:{ciphertext_base64}"
 */
export function encrypt(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH);
  const key = getEncryptionKey();

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("base64"),
  ].join(":");
}

/**
 * Descriptografa um ciphertext gerado por `encrypt`.
 * Lança erro se o authTag não bater (adulteração detectada).
 */
export function decrypt(ciphertext: string): string {
  const parts = ciphertext.split(":");
  if (parts.length !== 3) {
    throw new Error("Formato de ciphertext inválido");
  }

  const [ivHex, authTagHex, encryptedB64] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedB64, "base64");
  const key = getEncryptionKey();

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return (
    decipher.update(encrypted).toString("utf8") + decipher.final("utf8")
  );
}

/**
 * Gera um HMAC-SHA256 determinístico do valor normalizado (trim + lowercase).
 * Usado para:
 *   - Coluna document_hash (UNIQUE constraint + busca exata por documento)
 *   - Verificação de duplicidade sem expor o valor real
 */
export function hashForSearch(value: string): string {
  return createHmac("sha256", getHmacKey())
    .update(value.trim().toLowerCase())
    .digest("hex");
}
