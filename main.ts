import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "The bug was in production for six months. I found it in six seconds and got thanked in six words: 'great, now fix the rest.'";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > 200) {
  console.error(`line must be 1-200 characters, got ${LINE.length}`);
  process.exit(1);
}
if (LINE.trim().length === 0 || LINE.includes("\n")) {
  console.error("line must be a single non-whitespace line");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");

// Read back and verify: exact bytes (ties break on bytes), no trailing newline.
const back = readFileSync(target, "utf8");
if (back !== LINE) {
  console.error("read-back mismatch: entry.txt differs from the line");
  process.exit(1);
}
if (Buffer.byteLength(back, "utf8") !== 124) {
  console.error(`expected 124 bytes, got ${Buffer.byteLength(back, "utf8")}`);
  process.exit(1);
}
