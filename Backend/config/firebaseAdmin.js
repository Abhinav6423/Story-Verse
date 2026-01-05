import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* resolve __dirname for ESM */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* load service account JSON manually */
const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "firebase-service-account.json"),
    "utf8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
