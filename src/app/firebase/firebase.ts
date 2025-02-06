import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin"; // Import the ServiceAccount type
import serviceAccount from "./firebase-adminsdk.json"; // Import the JSON file directly

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export default admin;
