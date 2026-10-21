import { closeSync, openSync, readSync } from "node:fs";

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const FALLBACK = { width: 1600, height: 1000 };

/**
 * Real pixel size of a PNG, read from its IHDR chunk (24 bytes: 8 signature, 4 length, 4 "IHDR", then
 * width and height as big-endian uint32). Never throws: a missing, short, non-PNG or zero-sized file
 * returns the 1600x1000 the captures were once assumed to be, so a bad file cannot break the build.
 */
export function pngSize(path: string): { width: number; height: number } {
  let fd: number | undefined;
  try {
    fd = openSync(path, "r");
    const head = Buffer.alloc(24);
    if (readSync(fd, head, 0, 24, 0) < 24 || !head.subarray(0, 8).equals(SIGNATURE) || head.toString("ascii", 12, 16) !== "IHDR") return FALLBACK;
    const width = head.readUInt32BE(16);
    const height = head.readUInt32BE(20);
    return width > 0 && height > 0 ? { width, height } : FALLBACK;
  } catch {
    return FALLBACK;
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
}
