<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* 🔧 CONFIG */
const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "harry-undersand.firebaseapp.com",
  projectId: "harry-undersand"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* PROVIDERS */
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

/* ===== ACTIONS ===== */
window.loginGoogle = async () => {
  const res = await signInWithPopup(auth, googleProvider);
  await saveUser(res.user);
  window.location.href = "dashboard.html";
};

window.loginGithub = async () => {
  const res = await signInWithPopup(auth, githubProvider);
  await saveUser(res.user);
  window.location.href = "dashboard.html";
};

window.loginFacebook = async () => {
  const res = await signInWithPopup(auth, facebookProvider);
  await saveUser(res.user);
  window.location.href = "dashboard.html";
};

window.loginEmail = async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const res = await signInWithEmailAndPassword(auth, email, password);
  await saveUser(res.user);
  window.location.href = "dashboard.html";
};

window.registerEmail = async () => {
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const res = await createUserWithEmailAndPassword(auth, email, password);
  await saveUser(res.user);
  window.location.href = "dashboard.html";
};

window.logout = async () => {
  await signOut(auth);
  window.location.href = "/";
};

/* ===== FIRESTORE ===== */
async function saveUser(user) {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: user.displayName || "",
    email: user.email,
    photo: user.photoURL || "",
    provider: user.providerData[0].providerId,
    lastLogin: serverTimestamp()
  }, { merge: true });
}

/* ===== GUARD ===== */
window.authGuard = (callback) => {
  onAuthStateChanged(auth, callback);
};
</script>

