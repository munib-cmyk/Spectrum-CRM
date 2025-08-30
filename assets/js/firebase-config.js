import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJPxt8qFHVD3yUvZU9xuSGPiAhmqzzcv8",
  authDomain: "spectrum-crm-114-v1.firebaseapp.com",
  projectId: "spectrum-crm-114-v1",
  storageBucket: "spectrum-crm-114-v1.appspot.com",
  messagingSenderId: "165466187606",
  appId: "1:165466187606:web:d556d645931ac4f12518f7",
  measurementId: "G-G41W3Y4DQF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };