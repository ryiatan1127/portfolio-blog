import fs from "fs";
import path from "path";

const out = path.join(process.cwd(), "public", "search-index.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, "[]");
