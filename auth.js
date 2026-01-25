<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
getAuth,
onAuthStateChanged,
GoogleAuthProvider,
GithubAuthProvider,
FacebookAuthProvider,
signInWithPopup,
signOut
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import {
getFirestore,
doc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* 🔧 CONFIG FIREBASE */
const firebaseConfig = {
apiKey: "AIzaSyBdo7NO1PnAa90PhEhuzpllkB1ESGZu3J8",
authDomain: "harry-undersand.firebaseapp.com",
projectId: "harry-undersand"
};

/* 🔥 INIT */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* PROVIDERS */
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

/* UI ELEMENTS */
const googleBtn = document.getElementById("googleBtn");
const githubBtn = document.getElementById("githubBtn");
const facebookBtn = document.getElementById("facebookBtn");

const profileBox = document.getElementById("user-profile");
const userPhoto = document.getElementById("userPhoto");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userProvider = document.getElementById("userProvider");
const logoutBtn = document.getElementById("logoutBtn");

const navProfile = document.getElementById("navProfile");
const navUserPhoto = document.getElementById("navUserPhoto");
const navUserName = document.getElementById("navUserName");
const navLogoutBtn = document.getElementById("navLogoutBtn");

/* LOGIN */
googleBtn.addEventListener("click", async () => {
try {
await signInWithPopup(auth, googleProvider);
window.location.href = "dashboard.html";
} catch (e) {
alert(e.message);
}
});

githubBtn.addEventListener("click", async () => {
try {
await signInWithPopup(auth, githubProvider);
window.location.href = "dashboard.html";
} catch (e) {
alert(e.message);
}
});

facebookBtn.addEventListener("click", async () => {
try {
await signInWithPopup(auth, facebookProvider);
window.location.href = "dashboard.html";
} catch (e) {
alert(e.message);
}
});

/* LOGOUT */
logoutBtn.addEventListener("click", async () => {
await signOut(auth);
window.location.href = "/";
});
navLogoutBtn.addEventListener("click", async () => {
await signOut(auth);
window.location.href = "/";
});
</script>
